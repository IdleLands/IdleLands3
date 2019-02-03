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
const constitute_1 = require("constitute");
const _ = require("lodash");
const logger_1 = require("../../shared/logger");
const equipment_1 = require("../../core/base/equipment");
const settings_1 = require("../../static/settings");
const petdata = require("../../../assets/maps/content/pets.json");
const pet_1 = require("./pet");
let Pets = class Pets {
    constructor(container) {
        const PetsDb = require('./pets.db.js').PetsDb;
        try {
            container.schedulePostConstructor((petsDb) => {
                this.petsDb = petsDb;
            }, [PetsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Pets', e);
        }
    }
    // clear current variables and set new
    init(opts) {
        this._id = undefined;
        this.earnedPets = [];
        this.earnedPetData = {};
        this.activePetId = '';
        this.$pets = {};
        _.extend(this, opts);
    }
    __emptyGear({ slot }) {
        return new equipment_1.Equipment({ name: 'nothing', type: slot });
    }
    get activePet() {
        return this.$pets[this.activePetId];
    }
    _updateSimplePetInfo(petType, key, value) {
        _.find(this.earnedPets, { name: petType })[key] = value;
    }
    _syncGear(pet) {
        if (!pet.equipment)
            pet.equipment = {};
        _.each(pet.$slots, (value, key) => {
            if (!pet.equipment[key])
                pet.equipment[key] = [];
            while (pet.equipment[key].length < value) {
                pet.equipment[key].push(this.__emptyGear({ slot: key }));
            }
            while (pet.equipment[key].length > value) {
                pet.addToInventory(pet.equipment[key].shift());
            }
        });
    }
    _setupPetData(petName, petData, myPetData, player) {
        myPetData.$specialStats = petData.specialStats;
        myPetData.$category = petData.category;
        myPetData.$slots = petData.slots;
        myPetData.$scale = petData.scale;
        myPetData.$scaleCost = petData.scaleCost;
        myPetData.$petId = petName;
        myPetData.$ownerRef = player;
        myPetData.$manager = this;
    }
    addNewPet(player, type, name) {
        if (this.earnedPetData[type])
            return;
        if (!name || !name.trim() || name.length > 20)
            return;
        if (!petdata[type])
            return;
        const cost = petdata[type].cost;
        if (player.gold < cost)
            return;
        player.gainGold(-cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', cost);
        const pet = new pet_1.Pet();
        this._setupPetData(type, petdata[type], pet, player);
        pet.init({
            name,
            creator: player.name,
            owner: player.name,
            attr: _.sample(settings_1.SETTINGS.validPetAttributes)
        });
        this._syncGear(pet);
        const petInList = _.find(this.earnedPets, { name: type });
        petInList.bought = true;
        petInList.level = 1;
        petInList.profession = 'Monster';
        petInList.petName = name;
        this.activePetId = type;
        this.earnedPetData[type] = pet.buildSaveObject();
        this.$pets[pet.$petId] = pet;
        this.save();
        player.save();
        player._updatePet();
    }
    restorePetData(player) {
        _.each(petdata, (petData, petName) => {
            if (!this.earnedPetData[petName])
                return;
            const myPetData = this.earnedPetData[petName];
            this._setupPetData(petName, petData, myPetData, player);
        });
        this.$pets = _.mapValues(this.earnedPetData, d => {
            const pet = new pet_1.Pet();
            pet.init(d);
            this._syncGear(pet);
            return pet;
        });
    }
    feedGold(player, amount) {
        amount = Math.round(+amount);
        if (_.isNaN(amount) || amount < 0 || player.gold < amount)
            return 'Bad amount of gold specified.';
        const pet = this.activePet;
        if (!pet)
            return;
        const xpGained = pet.$_scale.xpPerGold * amount;
        if (!pet.canGainXp())
            return 'Pet cannot gain XP at this time.';
        player.gainGold(-amount, false);
        player.$statistics.incrementStat('Character.Pet.GoldFed', amount);
        pet.gainXp(xpGained);
        player._updatePet();
        player.update();
    }
    feedMax(player) {
        const pet = this.activePet;
        if (!pet)
            return;
        const xpGainedPerGold = pet.$_scale.xpPerGold;
        if (!pet.canGainXp())
            return 'Pet cannot gain XP at this time.';
        while (pet.canGainXp()) {
            const xpNeeded = pet._xp.maximum - pet._xp.__current;
            const amount = Math.floor(xpNeeded / xpGainedPerGold);
            if (player.gold < amount)
                break;
            player.gainGold(-amount, false);
            player.$statistics.incrementStat('Character.Pet.GoldFed', amount);
            if (pet.level === pet._level.maximum) {
                pet.gainXp(xpNeeded);
                break;
            }
            else {
                pet.levelUp();
            }
        }
        player._updatePet();
        player.update();
    }
    changePet(player, newPetType) {
        if (!this.earnedPetData[newPetType])
            return;
        this.activePetId = newPetType;
        player.__updatePetActive();
        this.updatePlayerPetSoulSync(player);
        this.save();
    }
    updatePlayerPetSoulSync(player) {
        const pet = this.activePet;
        if (!pet)
            return;
        if (player.ascensionLevel < 3)
            return;
        const baseItem = {
            type: 'soul',
            itemClass: 'idle'
        };
        _.extend(baseItem, _.cloneDeep(pet.equipment.soul[0]) || {});
        baseItem.name = `${pet.name}'s Soul`;
        delete baseItem.itemFindRangeMultiplier;
        delete baseItem.itemValueMultiplier;
        delete baseItem.itemFindRange;
        player.equipment.soul = baseItem;
        player._updateEquipment();
    }
    togglePetSmartSetting(setting) {
        if (!this.activePet)
            return;
        if (!_.includes(['self', 'sell', 'equip', 'salvage'], setting))
            return;
        const pet = this.activePet;
        pet.smart[setting] = !pet.smart[setting];
        this.save();
    }
    changePetProfession(player, newProfession) {
        if (!this.activePet)
            return;
        const allProfessions = player.$achievements.petClasses();
        if (!_.includes(allProfessions, newProfession))
            return 'You have not unlocked that pet class!';
        this.activePet.changeProfession(newProfession);
        player.__updatePetActive();
        player.__updatePetBasic();
    }
    changePetAttr(player, newAttr) {
        if (!this.activePet)
            return;
        const allAttrs = player.$achievements.petAttributes();
        if (newAttr && !_.includes(allAttrs, newAttr))
            return;
        this.activePet.changeAttr(newAttr);
        player.__updatePetActive();
        player.__updatePetBasic();
    }
    upgradePet(player, scaleAttr) {
        const pet = this.activePet;
        if (!pet)
            return;
        if (pet.$scale[scaleAttr].length - 1 === pet.scaleLevel[scaleAttr])
            return;
        const cost = pet.$scaleCost[scaleAttr][pet.scaleLevel[scaleAttr] + 1];
        if (player.gold < cost)
            return;
        player.gainGold(-cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', cost);
        player.$statistics.incrementStat('Character.Pet.Upgrades');
        pet.scaleLevel[scaleAttr]++;
        pet.doUpgrade(scaleAttr);
        player.__updatePetActive();
        player.update();
    }
    passPetItem(player, itemId, petId) {
        const pet = this.activePet;
        if (!pet)
            return 'You have no pet!';
        const item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return 'Item does not exist.';
        const otherPet = this.$pets[petId];
        if (!otherPet)
            return 'You do not have that pet!';
        if (otherPet.$petId === pet.$petId)
            return 'You cannot give it to the same pet!';
        if (otherPet.inventoryFull())
            return 'Other pet inventory full.';
        pet.removeFromInventory(item);
        otherPet.addToInventory(item);
        player.__updatePetActive();
    }
    takePetGold(player) {
        const pet = this.activePet;
        if (!pet)
            return;
        const gold = pet.gold.getValue();
        player.gainGold(gold, false);
        pet.gainGold(-gold);
        player.$statistics.incrementStat('Character.Pet.GoldTaken', gold);
        player.__updatePetActive();
    }
    checkPetRequirements(player, { requirements }) {
        const { statistics, achievements, collectibles, bosses } = requirements;
        let earned = true;
        if (statistics) {
            _.each(statistics, (value, key) => {
                let statVal = player.$statistics.getStat(key);
                if (_.isObject(statVal))
                    statVal = player.$statistics.countChild(key);
                if (statVal < value)
                    earned = false;
            });
        }
        if (achievements) {
            _.each(achievements, ({ name, tier }) => {
                if (!player.$achievements.hasAchievementAtTier(name, tier))
                    earned = false;
            });
        }
        if (collectibles) {
            _.each(collectibles, collectible => {
                if (!player.$collectibles.hasCollectible(collectible))
                    earned = false;
            });
        }
        if (bosses) {
            _.each(bosses, boss => {
                if (!player.$statistics.getStat(`Character.BossKills.${boss}`))
                    earned = false;
            });
        }
        return earned;
    }
    salvageAllPetItems(player) {
        const pet = this.activePet;
        if (!pet)
            return 'You have no pet!';
        if (pet.$_scale.salvage === 0)
            return 'Your pet cannot salvage!';
        if (!player.hasGuild)
            return 'You are not in a guild!';
        let woodGained = 0;
        let clayGained = 0;
        let stoneGained = 0;
        let astraliumGained = 0;
        let crits = 0;
        const items = pet.inventory.length;
        _.each(pet.inventory, item => {
            const { wood, clay, stone, astralium, isCrit } = pet.salvageItem(item);
            woodGained += wood;
            clayGained += clay;
            stoneGained += stone;
            astraliumGained += astralium;
            crits += isCrit;
            pet.removeFromInventory(item);
        });
        player.incrementSalvageStatistics({ wood: woodGained, clay: clayGained, stone: stoneGained, astralium: astraliumGained, isCrit: crits }, items);
        player.__updatePetActive();
        return `You earned ${woodGained} wood, ${clayGained} clay, ${stoneGained} stone, and ${astraliumGained} astralium by salvaging all items.`;
    }
    salvagePetItem(player, itemId) {
        const pet = this.activePet;
        if (!pet)
            return 'You have no pet!';
        if (pet.$_scale.salvage === 0)
            return 'Your pet cannot salvage!';
        const item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return 'Item does not exist.';
        if (!player.hasGuild)
            return 'You are not in a guild!';
        const { wood, clay, stone, astralium, isCrit } = pet.salvageItem(item);
        player.incrementSalvageStatistics({ wood, clay, stone, astralium, isCrit });
        return `You earned ${wood} wood, ${clay} clay, ${stone} stone, and ${astralium} astralium by ${isCrit ? 'critically ' : ' '}salvaging.`;
    }
    sellPetItem(player, itemId) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        const item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        const goldGained = pet.sellItem(item, true) || 0;
        pet.removeFromInventory(item);
        player.__updatePetActive();
        return `Sold ${item.name} for ${goldGained.toLocaleString()} gold.`;
    }
    sellAllPetItems(player) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        let goldGained = 0;
        _.each(pet.inventory, item => {
            goldGained += pet.sellItem(item, true) || 0;
            pet.removeFromInventory(item);
        });
        player.__updatePetActive();
        return `Sold all items for ${goldGained.toLocaleString()} gold.`;
    }
    unequipPetItem(player, itemId) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        if (pet.inventoryFull()) {
            return 'Pet inventory full.';
        }
        const item = _.find(_.flatten(_.values(pet.equipment)), { id: itemId });
        if (!item)
            return;
        if (item.isNothing) {
            return 'Cannot unequip nothing.';
        }
        if (item.type === 'soul') {
            return 'Souls are irreplaceable.';
        }
        pet.unequip(item, true);
        pet.addToInventory(item);
        player.__updatePetActive();
    }
    equipPetItem(player, itemId) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        const item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        if (!pet.canManuallyEquip(item)) {
            return 'No place to equip item.';
        }
        if (!pet.canEquip(item)) {
            return 'Item too strong for pet or pet does not have the correct appendages.';
        }
        pet.equip(item, true);
        pet.removeFromInventory(item);
        player.__updatePetActive();
    }
    giveItemToPet(player, itemId) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        if (pet.inventoryFull()) {
            return 'Pet inventory full.';
        }
        const item = _.find(_.values(player.equipment), { id: itemId });
        if (!item)
            return;
        if (item.type === 'providence') {
            return 'Providences are gifts from the gods, you cannot forsake them like this.';
        }
        if (item.type === 'soul') {
            return 'How dare you?';
        }
        if (item.isNothing) {
            return 'Cannot unequip nothing.';
        }
        item._wasEquipped = true;
        player.unequip(item, this.__emptyGear({ slot: item.type }));
        pet.addToInventory(item);
        player._updateEquipment();
        player.__updatePetActive();
    }
    takeItemFromPet(player, itemId) {
        const pet = this.activePet;
        if (!this.activePet)
            return;
        const item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        if (!player.canEquip(item, 1, false) && !item._wasEquipped) {
            return 'Item too powerful for you.';
        }
        if (player.equipment[item.type] && !player.equipment[item.type].isNothing) {
            pet.addToInventory(player.equipment[item.type]);
        }
        player.equip(item);
        pet.removeFromInventory(item);
        player._updateEquipment();
        player.__updatePetActive();
    }
    checkPets(player) {
        _.each(petdata, (petData, petName) => {
            if (_.find(this.earnedPets, { name: petName }))
                return;
            if (!this.checkPetRequirements(player, petData))
                return;
            this.earnedPets.push({ bought: false, name: petName });
        });
    }
    changePetName(player, petId, petName) {
        if (!player.$premium.canConsume('renameTagPet'))
            return 'You do not have a pet rename tag!';
        player.$premium.consume(player, 'renameTagPet');
        const pet = this.$pets[petId];
        pet.name = petName;
        this._updateSimplePetInfo(petId, 'petName', petName);
        player._updatePet();
        this.save();
    }
    get petInfo() {
        return _.reduce(_.keys(petdata), (prev, cur) => {
            prev[cur] = _.pick(petdata[cur], ['cost', 'category', 'description']);
            return prev;
        }, {});
    }
    buildSaveObject() {
        _.each(this.$pets, pet => {
            this.earnedPetData[pet.$petId] = pet.buildSaveObject();
        });
        return _.omitBy(this, (val, key) => _.startsWith(key, '$') || _.isNotWritable(this, key));
    }
    save() {
        this.petsDb.savePets(this.buildSaveObject());
    }
};
Pets = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Pets);
exports.Pets = Pets;
