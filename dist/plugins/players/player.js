"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const constitute_1 = require("constitute");
const Chance = require("chance");
const chance = new Chance();
const character_1 = require("../../core/base/character");
const game_state_1 = require("../../core/game-state");
const settings_1 = require("../../static/settings");
const logger_1 = require("../../shared/logger");
const player_db_1 = require("./player.db");
const player_movement_1 = require("./player.movement");
const item_generator_1 = require("../../shared/item-generator");
const monster_generator_1 = require("../../shared/monster-generator");
const shop_generator_1 = require("../../shared/shop-generator");
const data_updater_1 = require("../../shared/data-updater");
const eventhandler_1 = require("../events/eventhandler");
const FindItem_1 = require("../events/events/FindItem");
const Events = require("../events/events/_all");
const Achievements = require("../achievements/achievements/_all");
const player_dirtychecker_1 = require("./player.dirtychecker");
const _emitter_1 = require("./_emitter");
let Player = class Player extends character_1.Character {
    constructor(playerDb) {
        super();
        this.$playerDb = playerDb;
        this.$playerMovement = player_movement_1.PlayerMovement;
        this.$itemGenerator = item_generator_1.ItemGenerator;
        this.$dataUpdater = data_updater_1.DataUpdater;
    }
    init(opts, save = true) {
        this.$dirty = new player_dirtychecker_1.DirtyChecker();
        this.$canSave = save;
        super.init(opts);
        if (!this.joinDate)
            this.joinDate = Date.now();
        if (!this.mapRegion)
            this.mapRegion = 'Wilderness';
        if (!this.gold)
            this.gold = 0;
        if (!this.map)
            this.map = 'Norkos';
        if (!this.x)
            this.x = 10;
        if (!this.y)
            this.y = 10;
        if (!this.choices)
            this.choices = [];
        if (_.size(this.equipment) < 10)
            this.generateBaseEquipment();
        this.$updateAchievements = true;
        this.$updateCollectibles = true;
        this.$updateGenders = true;
        this.$updatePremium = true;
        this.$updateShop = true;
        this.$partyName = null;
        if (this.isMod) {
            this.emitGMData();
        }
        this.$canSave = true;
        this.lastLogin = Date.now();
    }
    quickLogin() {
        this.$updateAchievements = true;
        this.$updateCollectibles = true;
        this.$updateGenders = true;
        this.$updatePremium = true;
        if (this.isMod) {
            this.emitGMData();
        }
    }
    emitGMData() {
        const maps = _.keys(game_state_1.GameState.getInstance().world.maps);
        const teleNames = _.map(settings_1.SETTINGS.allTeleports, 'name');
        const permAchs = _(Achievements)
            .values()
            .filter(ach => ach.permanentProp)
            .map(ach => ({ property: ach.permanentProp, name: ach.name }))
            .value();
        const allEvents = _(Events)
            .keys()
            .reject(key => Events[key].WEIGHT <= 0)
            .value();
        this.$dataUpdater(this.name, 'gmdata', { maps, teleNames, permAchs, allEvents });
    }
    generateBaseEquipment() {
        const items = this.$itemGenerator.newPlayerEquipment();
        _.each(items, item => this.equip(item));
    }
    get fullname() {
        const viewName = this.nameEdit ? this.nameEdit : this.name;
        if (this.title)
            return `${viewName}, the ${this.title}`;
        return viewName;
    }
    get deathMessage() {
        if (this._deathMessage)
            return this._deathMessage;
        return this.randomDeathMessage();
    }
    get guild() {
        const gamestate = game_state_1.GameState.getInstance();
        return gamestate.hasGuild(this.guildName) || { $noGuild: true };
    }
    get hasGuild() {
        return this.guild && !this.guild.$noGuild;
    }
    takeTurn() {
        logger_1.Logger.silly('Player:TakeTurn', `${this.name} taking turn.`);
        const activePet = this.$pets.activePet;
        if (activePet) {
            activePet.takeTurn();
            if (activePet.$updatePlayer) {
                this.__updatePetActive();
            }
        }
        if (this.$battle)
            return;
        if (this.$personalities.isActive('Camping')) {
            this.$statistics.incrementStat('Character.Movement.Camping');
            this.save();
            return;
        }
        this.attemptToDisbandSoloParty();
        try {
            logger_1.Logger.silly('Player:TakeTurn', `${this.name} moving.`);
            this.moveAction();
            logger_1.Logger.silly('Player:TakeTurn', `${this.name} doing event?`);
            eventhandler_1.EventHandler.tryToDoEvent(this);
        }
        catch (e) {
            logger_1.Logger.error('Player', e);
        }
        if (this.$partyName) {
            this.party.playerTakeStep(this);
        }
        this.save();
    }
    attemptToDisbandSoloParty() {
        if (!this.$partyName)
            return;
        const party = this.party;
        if (party.players.length > 1)
            return;
        party.disband(this, false);
    }
    levelUp() {
        if (this.level === this._level.maximum)
            return;
        super.levelUp();
        this._saveSelf();
        _emitter_1.emitter.emit('player:levelup', { player: this });
    }
    _calcModGold(baseXp) {
        return this.liveStats.gold(baseXp);
    }
    gainGold(baseGold = 1, calc = true) {
        let gold = calc ? this._calcModGold(baseGold) : baseGold;
        if (_.isNaN(gold) || gold === 0 || Math.sign(gold) !== Math.sign(baseGold))
            return 0;
        super.gainGold(gold);
        if (gold > 0) {
            if (this.guild && !this.guild.$noGuild) {
                const taxes = this.guild.getTaxedAmount(this, gold);
                this.guild.payTaxes(this, taxes);
                gold -= taxes;
                this.$statistics.incrementStat('Character.Gold.Taxed', taxes);
            }
            this.$statistics.incrementStat('Character.Gold.Gain', gold);
        }
        else {
            this.$statistics.incrementStat('Character.Gold.Lose', -gold);
        }
        return gold;
    }
    _calcModXp(baseXp) {
        return this.liveStats.xp(baseXp);
    }
    gainXp(baseXp = 1, calc = true) {
        const xp = calc ? this._calcModXp(baseXp) : baseXp;
        if (_.isNaN(xp) || xp === 0 || Math.sign(xp) !== Math.sign(baseXp))
            return 0;
        super.gainXp(xp);
        if (xp > 0) {
            this.$statistics.incrementStat('Character.XP.Gain', xp);
        }
        else {
            this.$statistics.incrementStat('Character.XP.Lose', -xp);
        }
        if (this._xp.atMaximum())
            this.levelUp();
        return xp;
    }
    premiumTier() {
        const tier = this.$achievements.premiumTier();
        this._premiumTier = tier;
        this.$statistics.setStat('Game.PremiumTier', tier);
        return tier;
    }
    _$priceReductionMultiplier() {
        const premiumTier = this.premiumTier();
        return 1 - (0.1 * premiumTier);
    }
    _$choiceLimit() {
        const premiumTier = this.premiumTier();
        return settings_1.SETTINGS.maxChoices + (settings_1.SETTINGS.maxChoices * premiumTier);
    }
    _$maxItemBoost() {
        const premiumTier = this.premiumTier();
        return 0.5 * premiumTier;
    }
    addChoice(messageData) {
        this.choices.push(messageData);
        this._choiceLimit = this._$choiceLimit();
        if (this.choices.length > this._choiceLimit) {
            if (this.$personalities.isAnyActive(['Affirmer', 'Denier', 'Indecisive'])) {
                const choice = this.choices[0];
                let failed = false;
                if (_.includes(choice.choices, 'Yes') && this.$personalities.isActive('Affirmer')) {
                    const res = this.handleChoice({ id: choice.id, response: 'Yes' }, false);
                    if (!res) {
                        this.$statistics.incrementStat('Character.Choice.Affirm');
                    }
                    else {
                        failed = true;
                    }
                }
                else if (_.includes(choice.choices, 'No') && this.$personalities.isActive('Denier')) {
                    const res = this.handleChoice({ id: choice.id, response: 'No' }, false);
                    if (!res) {
                        this.$statistics.incrementStat('Character.Choice.Deny');
                    }
                    else {
                        failed = true;
                    }
                }
                else if (this.$personalities.isActive('Indecisive')) {
                    const res = this.handleChoice({ id: choice.id, response: _.sample(['Yes', 'No']) }, false);
                    if (!res) {
                        this.$statistics.incrementStat('Character.Choice.Indecisive');
                    }
                    else {
                        failed = true;
                    }
                }
                this.choices.shift();
                if (failed) {
                    this.$statistics.incrementStat('Character.Choice.Ignore');
                }
            }
            else {
                this.choices.shift();
                this.$statistics.incrementStat('Character.Choice.Ignore');
            }
        }
        this.$statistics.incrementStat('Character.Choices');
    }
    handleChoice({ id, response }, removeChoice = true) {
        const choice = _.find(this.choices, { id });
        if (!choice)
            return;
        const result = Events[choice.event].makeChoice(this, id, response);
        if (_.isString(result))
            return;
        this.$statistics.batchIncrement(['Character.Choice.Chosen', `Character.Choice.Choose.${response}`]);
        if (removeChoice)
            this.removeChoice(id);
        this.update();
    }
    emitLevelChange() {
        _emitter_1.emitter.emit('player:changelevel', { player: this });
    }
    removeChoice(id) {
        this.choices = _.reject(this.choices, { id });
    }
    get validGenders() {
        return settings_1.SETTINGS.validGenders
            .concat(_.get(this.$premium, 'genders', []))
            .concat(this.$achievements.genders());
    }
    changeGender(newGender) {
        if (!_.includes(this.validGenders, newGender))
            return;
        this.gender = newGender;
        _emitter_1.emitter.emit('player:changegender', { player: this });
    }
    changeTitle(newTitle) {
        const titles = this.$achievements.titles();
        if (newTitle && !_.includes(titles, newTitle))
            return;
        this.title = newTitle;
        if (newTitle) {
            this._deathMessage = this.$achievements.getDeathMessageForTitle(newTitle);
        }
        else {
            this._deathMessage = null;
        }
        _emitter_1.emitter.emit('player:changetitle', { player: this });
    }
    changeName(newName) {
        if (!newName)
            return;
        this.nameEdit = newName;
        _emitter_1.emitter.emit('player:changename', { player: this });
    }
    togglePersonality(personality) {
        if (!_.find(this.$personalities.earnedPersonalities, { name: personality }))
            return;
        this.$personalities.togglePersonality(this, personality);
        this.recalculateStats();
        this.update();
        this._updatePersonalities();
    }
    moveToStart() {
        this.map = 'Norkos';
        this.x = 10;
        this.y = 10;
    }
    moveAction() {
        const weight = this.$playerMovement.getInitialWeight(this);
        const party = this.party;
        let index, newLoc, dir, tile;
        if (!this.stepCooldown)
            this.stepCooldown = 0;
        if (party) {
            const follow = party.getFollowTarget(this);
            if (follow) {
                [index, newLoc, dir] = this.$playerMovement.pickFollowTile(this, follow);
                tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
                if (!this.$playerMovement.partyTileCheck(this, tile)) {
                    this.party.playerLeave(this);
                    tile = null;
                }
            }
        }
        if (!tile) {
            [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
            tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
            let attempts = 1;
            while (!this.$playerMovement.canEnterTile(this, tile)) {
                if (attempts > 8) {
                    logger_1.Logger.error('Player', new Error(`Player ${this.name} is position locked at ${this.x}, ${this.y} in ${this.map}`));
                    break;
                }
                weight[index] = 0;
                [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
                tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
                attempts++;
                logger_1.Logger.silly('Player:Move', `${this.name} doing tile enter check again ${attempts}`);
            }
        }
        if (!tile.terrain) {
            logger_1.Logger.error('PlayerMovement', new Error(`Invalid tile terrain undefined for ${this.name} @ ${this.map}: ${this.x},${this.y}`));
        }
        this.lastDir = dir === 5 ? null : dir;
        const oldLoc = { x: this.x, y: this.y };
        this.x = newLoc.x;
        this.y = newLoc.y;
        const mapInstance = game_state_1.GameState.getInstance().world.maps[this.map];
        logger_1.Logger.silly('Player:Move', `${this.name} doing validation`);
        if (!mapInstance || this.x <= 0 || this.y <= 0 || this.y > mapInstance.height || this.x > mapInstance.width) {
            const customPayload = { player: this.buildTransmitObject(), oldLoc: oldLoc, nextTile: [index, newLoc, dir] };
            if (party) {
                customPayload.party = this.party ? this.party.buildTransmitObject() : null;
            }
            logger_1.Logger.error('PlayerMovement', new Error(`Out of bounds for ${this.name} at ${this.mapRegion} on ${this.map}: ${this.x}, ${this.y}. Old ${oldLoc.x}, ${oldLoc.y}`), { custom: customPayload });
            this.moveToStart();
        }
        const oldRegion = this.oldRegion;
        this.oldRegion = this.mapRegion;
        this.mapRegion = tile.region;
        if (!this.$shop || (oldRegion !== this.mapRegion)) {
            this.$updateShop = true;
            logger_1.Logger.silly('Player:Move', `${this.name} generating shop`);
            this.$shop = shop_generator_1.ShopGenerator.regionShop(this);
            logger_1.Logger.silly('Player:Move', `${this.name} generated shop`);
        }
        this.mapPath = tile.path;
        if (this.forceEvent) {
            this.forceEvent.decrementer--;
            if (this.forceEvent.decrementer <= 0) {
                this.forceEvent.steps--;
                if (this.forceEvent.steps < 0)
                    this.forceEvent.steps = 0;
                this.forceEvent.decrementer = 240;
            }
        }
        logger_1.Logger.silly('Player:Move', `${this.name} handling tile`);
        this.$playerMovement.handleTile(this, tile);
        logger_1.Logger.silly('Player:Move', `${this.name} handled tile`);
        this.stepCooldown--;
        const incrementStats = [
            'Character.Steps',
            `Character.Terrains.${tile.terrain}`,
            `Character.Regions.${tile.region}`,
            `Character.ProfessionSteps.${this.professionName}`
        ];
        if (!_.includes(this.map, 'Guild Base -')) {
            incrementStats.push(`Character.Maps.${this.map}`);
        }
        if (this.$personalities.isActive('Drunk')) {
            incrementStats.push('Character.Movement.Drunk');
        }
        if (this.$personalities.isActive('Solo') && !this.party) {
            incrementStats.push('Character.Movement.Solo');
        }
        if (this.party) {
            incrementStats.push('Character.Movement.Party');
        }
        logger_1.Logger.silly('Player:Move', `${this.name} incrementing stats`);
        this.$statistics.batchIncrement(incrementStats);
        logger_1.Logger.silly('Player:Move', `${this.name} gaining xp`);
        this.gainXp(settings_1.SETTINGS.xpPerStep);
    }
    buyShopItem(itemId) {
        const items = _.get(this, '$shop.slots', []);
        const item = _.find(items, { id: itemId });
        if (!item)
            return 'Item does not exist';
        if (this.gold < item.price)
            return 'Too expensive for your blood';
        this.gold -= item.price;
        delete item.price;
        FindItem_1.FindItem.operateOn(this, null, item);
        this.$shop.slots = _.without(this.$shop.slots, item);
        this.$statistics.incrementStat('Character.Gold.Spent', item.price);
        this.$statistics.incrementStat('Character.Item.Buy');
        this.$updateEquipment = true;
        this.$updateShop = true;
        this.update();
    }
    equip(item) {
        super.equip(item);
        this.recalculateStats();
        this._saveSelf();
        this.update();
    }
    unequip(item, replaceWith) {
        this.equipment[item.type] = replaceWith;
        this.recalculateStats();
        this._saveSelf();
    }
    recalculateStats() {
        super.recalculateStats();
        this.$dirty.reset();
    }
    tryUpdateGuild() {
        if (!this.guild || this.guild.$noGuild)
            return;
        this.guild.updateMember(this);
    }
    buildSaveObject() {
        return _.omitBy(this, (val, key) => _.startsWith(key, '$') || _.isNotWritable(this, key));
    }
    buildTransmitObject() {
        const badKeys = ['equipment', 'isOnline', 'stepCooldown', 'userId', 'lastDir', 'allIps', 'profession', 'spells'];
        const obj = _.omitBy(this, (val, key) => {
            return _.startsWith(key, '$')
                || _.isFunction(val)
                || _.isNotWritable(this, key)
                || _.includes(key, 'Link')
                || _.includes(key, 'Steps')
                || _.includes(badKeys, key);
        });
        obj.ascensionLevel = this.ascensionLevel;
        return obj;
    }
    _saveSelf() {
        if (!this.$canSave)
            return;
        this.$playerDb.savePlayer(this);
    }
    save() {
        this.checkAchievements();
        if (!this.saveSteps)
            this.saveSteps = settings_1.SETTINGS.saveSteps;
        this.saveSteps--;
        if (this.saveSteps <= 0) {
            logger_1.Logger.silly('Player:TakeTurn', `${this.name} actually saving.`);
            this._save();
            this.saveSteps = settings_1.SETTINGS.saveSteps;
        }
        this.update();
    }
    _save() {
        this._saveSelf();
        this.$statistics.save();
        this.$pets.save();
    }
    checkAchievements() {
        if (!this.achievementSteps)
            this.achievementSteps = settings_1.SETTINGS.achievementSteps;
        this.achievementSteps--;
        if (this.achievementSteps <= 0) {
            this._checkAchievements();
            this.achievementSteps = settings_1.SETTINGS.achievementSteps;
        }
    }
    _checkAchievements() {
        this.$pets.checkPets(this);
        const newAchievements = this.$achievements.checkAchievements(this);
        if (newAchievements.length > 0) {
            _emitter_1.emitter.emit('player:achieve', { player: this, achievements: newAchievements });
            this.$personalities.checkPersonalities(this);
        }
    }
    _updatePlayer() {
        this.$dataUpdater(this.name, 'player', this.buildTransmitObject());
    }
    _updateShop() {
        this.$dataUpdater(this.name, 'shop', this.$shop || { slots: [] });
    }
    _updateBossTimers() {
        this.$dataUpdater(this.name, 'bosstimers', monster_generator_1.MonsterGenerator.bossTimers);
    }
    _updateParty(force = false) {
        const transmitObject = this.party ? this.party.buildTransmitObject() : {};
        if (!force && this.$lastPartyObject && _.isEqual(transmitObject, this.$lastPartyObject))
            return;
        this.$lastPartyObject = transmitObject;
        this.$dataUpdater(this.name, 'party', transmitObject);
    }
    _updateEquipment() {
        this.$dataUpdater(this.name, 'equipment', this.equipment);
    }
    _updateStatistics() {
        this.$dataUpdater(this.name, 'statistics', this.$statistics.stats);
    }
    _updateAchievements() {
        this.$dataUpdater(this.name, 'achievements', this.$achievements.achievements);
    }
    _updateCollectibles() {
        this.$dataUpdater(this.name, 'collectibles', { current: this.$collectibles.collectibles, prior: this.$collectibles.priorCollectibleData });
    }
    _updatePersonalities() {
        this.$dataUpdater(this.name, 'personalities', { earned: this.$personalities.earnedPersonalities, active: this.$personalities.activePersonalities });
    }
    _updateGenders() {
        this.$dataUpdater(this.name, 'genders', this.validGenders);
    }
    _updateGuild() {
        let guild = this.guild;
        if (this.hasGuild) {
            const guildTrans = guild.buildTransmitObject();
            guildTrans.$me = _.find(guild.members, { name: this.name });
            guild = guildTrans;
        }
        this.$dataUpdater(this.name, 'guild', guild);
    }
    _updateGuildBuildings() {
        if (!this.hasGuild)
            return;
        this.$dataUpdater(this.name, 'guildbuildings', this.guild.buildBuildingTransmitObject());
    }
    _updatePet() {
        this.__updatePetBuyData();
        this.__updatePetBasic();
        this.__updatePetActive();
    }
    __updatePetBasic() {
        this.$dataUpdater(this.name, 'petbasic', this.$pets.earnedPets);
    }
    __updatePetBuyData() {
        this.$dataUpdater(this.name, 'petbuy', this.$pets.petInfo);
    }
    __updatePetActive() {
        if (!this.$pets.activePet)
            return;
        this.$dataUpdater(this.name, 'petactive', this.$pets.activePet.buildTransmitObject());
    }
    __updateFestivals() {
        this.$dataUpdater(this.name, 'festivals', game_state_1.GameState.getInstance().festivals);
    }
    _updateSystem() {
        this.__updateFestivals();
    }
    _updatePremium() {
        this.$dataUpdater(this.name, 'premium', {
            conversionRate: settings_1.SETTINGS.ilpConversionRate,
            buyable: this.$premium.buyable,
            ilp: this.$premium.ilp,
            bought: this.$premium.oneTimeItemsPurchased,
            consumables: this.$premium.consumables
        });
    }
    update() {
        this._updatePlayer();
        this._updateParty();
        this._updateSystem();
        if (this.$updateShop) {
            this.$updateShop = false;
            this._updateShop();
        }
        if (this.$updateEquipment) {
            this.$updateEquipment = false;
            this._updateEquipment();
        }
        if (this.$updateCollectibles) {
            this.$updateCollectibles = false;
            this._updateCollectibles();
        }
        if (this.$updateAchievements) {
            this.$updateAchievements = false;
            this._updateAchievements();
        }
        if (this.$updateGenders) {
            this.$updateGenders = false;
            this._updateGenders();
        }
        if (this.$updatePremium) {
            this.$updatePremium = false;
            this._updatePremium();
        }
    }
    get ascensionLevel() {
        return this.$statistics ? this.$statistics.getStat('Character.Ascension.Times') : 0;
    }
    getSalvageValues(item, baseMultiplier = 1, bonus = 0) {
        const salvageBoost = this.liveStats.salvage;
        const critSalvageChance = this.calcLuckBonusFromValue(this.liveStats.luk + bonus);
        const isCrit = chance.integer({ min: 0, max: 10000 }) <= (salvageBoost + critSalvageChance) ? 1 : 0;
        const multiplier = (salvageBoost / 10) + (isCrit ? 3 : baseMultiplier);
        const wood = Math.round(item.woodValue() * multiplier);
        const stone = Math.round(item.stoneValue() * multiplier);
        const clay = Math.round(item.clayValue() * multiplier);
        const astralium = Math.round(item.astraliumValue() * multiplier);
        return { wood, stone, clay, astralium, isCrit };
    }
    incrementSalvageStatistics({ wood, stone, clay, astralium, isCrit }, numItems = 1) {
        this.$statistics.incrementStat('Character.Item.Salvage', numItems);
        if (wood > 0)
            this.$statistics.incrementStat('Character.Salvage.Wood', wood);
        if (stone > 0)
            this.$statistics.incrementStat('Character.Salvage.Stone', stone);
        if (clay > 0)
            this.$statistics.incrementStat('Character.Salvage.Clay', clay);
        if (astralium > 0)
            this.$statistics.incrementStat('Character.Salvage.Astralium', astralium);
        if (isCrit > 0)
            this.$statistics.incrementStat('Character.Salvage.CriticalSuccess', isCrit);
        this.guild.addResources({ wood, stone, clay, astralium });
    }
    ascend() {
        if (!this._level.atMaximum())
            return;
        const currentAscensionLevel = this.$statistics.getStat('Character.Ascension.Times');
        this.$statistics.incrementStat('Character.Ascension.Times');
        this.$statistics.incrementStat('Character.Ascension.Gold', this.gold);
        this.gold = 0;
        _.each(this.$pets.$pets, pet => {
            this.$statistics.incrementStat('Character.Ascension.Gold', pet.gold.getTotal());
            pet.gold.set(0);
        });
        this.$statistics.incrementStat('Character.Ascension.ItemScore', this.itemScore);
        this.generateBaseEquipment();
        _.each(this.$pets.$pets, pet => {
            if (pet.$category === 'Protector')
                return;
            pet.unequipAll();
            pet.inventory = [];
        });
        this.$statistics.incrementStat('Character.Ascension.Levels', this.level);
        this._level.maximum += settings_1.SETTINGS.ascensionLevelBoost;
        this._level.set(1);
        this._xp.set(0);
        this.resetMaxXp();
        this.$statistics.incrementStat('Character.Ascension.CollectiblesFound', this.$collectibles.totalCollectibles());
        this.$collectibles.reset();
        this.$collectibles.save();
        this.moveToStart();
        this.choices = [];
        this.$personalities.turnAllOff(this);
        if (this.party) {
            this.party.playerLeave(this);
        }
        this.recalculateStats();
        this._checkAchievements();
        this.update();
        this.save();
        this.$pets.save();
        this.$statistics.save();
        this.lastAscension = Date.now();
        const ascBonus = 0.25 + (0.05 * currentAscensionLevel);
        game_state_1.GameState.getInstance().addFestival({
            name: `${this.name}'s Ascension`,
            message: `${this.name} has ascended! +${(ascBonus * 100).toFixed(0)}% XP/Gold for everyone for 24 hours!`,
            startedBy: this.name,
            hourDuration: 24,
            bonuses: {
                xp: ascBonus,
                gold: ascBonus
            }
        });
    }
};
Player = __decorate([
    constitute_1.Dependencies(player_db_1.PlayerDb),
    __metadata("design:paramtypes", [Object])
], Player);
exports.Player = Player;
