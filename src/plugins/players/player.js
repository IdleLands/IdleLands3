
import * as _ from 'lodash';
import { Dependencies } from 'constitute';
import * as Chance from 'chance';
const chance = new Chance();

import { Character } from '../../core/base/character';

import { GameState } from '../../core/game-state';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

import { PlayerDb } from './player.db';
import { PlayerMovement } from './player.movement';
import { ItemGenerator } from '../../shared/item-generator';
import { MonsterGenerator } from '../../shared/monster-generator';
import { ShopGenerator } from '../../shared/shop-generator';

import { DataUpdater } from '../../shared/data-updater';
import { EventHandler } from '../events/eventhandler';
import { FindItem } from '../events/events/FindItem';

import * as Events from '../events/events/_all';
import * as Achievements from '../achievements/achievements/_all';

import { DirtyChecker } from './player.dirtychecker';

import { emitter } from './_emitter';

@Dependencies(PlayerDb)
export class Player extends Character {
  constructor(playerDb) {
    super();
    this.$playerDb = playerDb;
    this.$playerMovement = PlayerMovement;
    this.$itemGenerator = ItemGenerator;
    this.$dataUpdater = DataUpdater;
  }

  init(opts, save = true) {
    this.$dirty = new DirtyChecker();
    this.$canSave = save;

    super.init(opts);

    if(!this.joinDate)  this.joinDate = Date.now();
    if(!this.mapRegion) this.mapRegion = 'Wilderness';
    if(!this.gold)      this.gold = 0;
    if(!this.map)       this.map = 'Norkos';
    if(!this.x)         this.x = 10;
    if(!this.y)         this.y = 10;

    if(!this.choices)   this.choices = [];
    if(_.size(this.equipment) < 10) this.generateBaseEquipment();

    this.$updateAchievements = true;
    this.$updateCollectibles = true;
    this.$updateGenders = true;
    this.$updatePremium = true;
    this.$updateShop = true;

    this.$partyName = null;

    if(this.isMod) {
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

    if(this.isMod) {
      this.emitGMData();
    }
  }

  emitGMData() {
    const maps = _.keys(GameState.getInstance().world.maps);
    const teleNames = _.map(SETTINGS.allTeleports, 'name');
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
    if(this.title) return `${viewName}, the ${this.title}`;
    return viewName;
  }

  get deathMessage() {
    if(this._deathMessage) return this._deathMessage;
    return this.randomDeathMessage();
  }

  get guild() {
    const gamestate = GameState.getInstance();
    return gamestate.hasGuild(this.guildName) || { $noGuild: true };
  }

  get hasGuild() {
    return this.guild && !this.guild.$noGuild;
  }

  takeTurn() {
    Logger.silly('Player:TakeTurn', `${this.name} taking turn.`);

    const activePet = this.$pets.activePet;

    if(activePet) {
      activePet.takeTurn();
      if(activePet.$updatePlayer) {
        this.__updatePetActive();
      }
    }

    if(this.$battle) return;

    if(this.$personalities.isActive('Camping')) {
      this.$statistics.incrementStat('Character.Movement.Camping');
      this.save();
      return;
    }

    this.attemptToDisbandSoloParty();

    try {
      Logger.silly('Player:TakeTurn', `${this.name} moving.`);
      this.moveAction();
      Logger.silly('Player:TakeTurn', `${this.name} doing event?`);
      EventHandler.tryToDoEvent(this);
    } catch(e) {
      Logger.error('Player', e);
    }

    if(this.$partyName) {
      this.party.playerTakeStep(this);
    }

    this.save();
  }

  attemptToDisbandSoloParty() {
    if(!this.$partyName) return;

    const party = this.party;
    if(party.players.length > 1) return;

    party.disband(this, false);
  }

  levelUp() {
    if(this.level === this._level.maximum) return;
    super.levelUp();
    this._saveSelf();
    emitter.emit('player:levelup', { player: this });
  }

  _calcModGold(baseXp) {
    return this.liveStats.gold(baseXp);
  }

  gainGold(baseGold = 1, calc = true) {
    
    let gold = calc ? this._calcModGold(baseGold) : baseGold;
    if(_.isNaN(gold) || gold === 0 || Math.sign(gold) !== Math.sign(baseGold)) return 0;
    
    super.gainGold(gold);
    
    if(gold > 0) {
      if(this.guild && !this.guild.$noGuild) {
        const taxes = this.guild.getTaxedAmount(this, gold);
        this.guild.payTaxes(this, taxes);
        gold -= taxes;

        this.$statistics.incrementStat('Character.Gold.Taxed', taxes);
      }

      this.$statistics.incrementStat('Character.Gold.Gain', gold);

    } else {
      this.$statistics.incrementStat('Character.Gold.Lose', -gold);
    }
    
    return gold;
  }

  _calcModXp(baseXp) {
    return this.liveStats.xp(baseXp);
  }

  gainXp(baseXp = 1, calc = true) {

    const xp = calc ? this._calcModXp(baseXp) : baseXp;
    if(_.isNaN(xp) || xp === 0 || Math.sign(xp) !== Math.sign(baseXp)) return 0;
    
    super.gainXp(xp);

    if(xp > 0) {
      this.$statistics.incrementStat('Character.XP.Gain', xp);
    } else {
      this.$statistics.incrementStat('Character.XP.Lose', -xp);
    }

    if(this._xp.atMaximum()) this.levelUp();

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
    return SETTINGS.maxChoices + (SETTINGS.maxChoices * premiumTier);
  }

  _$maxItemBoost() {
    const premiumTier = this.premiumTier();
    return 0.5 * premiumTier;
  }

  addChoice(messageData) {
    this.choices.push(messageData);
    this._choiceLimit = this._$choiceLimit();

    if(this.choices.length > this._choiceLimit) {
      if(this.$personalities.isAnyActive(['Affirmer', 'Denier', 'Indecisive'])) {
        const choice = this.choices[0];
        if(_.includes(choice.choices, 'Yes') && this.$personalities.isActive('Affirmer')) {
          this.handleChoice({ id: choice.id, response: 'Yes' });
          this.$statistics.incrementStat('Character.Choice.Affirm');

        } else if(_.includes(choice.choices, 'No') && this.$personalities.isActive('Denier')) {
          this.handleChoice({ id: choice.id, response: 'No' });
          this.$statistics.incrementStat('Character.Choice.Deny');

        } else if(this.$personalities.isActive('Indecisive')) {
          this.handleChoice({ id: choice.id, response: _.sample(choice.choices) });
          this.$statistics.incrementStat('Character.Choice.Indecisive');
        }

      } else {
        this.choices.shift();
        this.$statistics.incrementStat('Character.Choice.Ignore');
      }
    }

    this.$statistics.incrementStat('Character.Choices');
  }

  handleChoice({ id, response }) {
    const choice = _.find(this.choices, { id });
    if(!choice) return;
    const result = Events[choice.event].makeChoice(this, id, response);
    if(_.isString(result)) return;
    this.$statistics.batchIncrement(['Character.Choice.Chosen', `Character.Choice.Choose.${response}`]);
    this.removeChoice(id);
    this.update();
  }

  emitLevelChange() {
    emitter.emit('player:changelevel', { player: this });
  }

  removeChoice(id) {
    this.choices = _.reject(this.choices, { id });
  }

  get validGenders() {
    return SETTINGS.validGenders.concat(_.get(this.$premium, 'genders', []));
  }

  changeGender(newGender) {
    if(!_.includes(this.validGenders, newGender)) return;
    this.gender = newGender;
    emitter.emit('player:changegender', { player: this });
  }

  changeTitle(newTitle) {
    const titles = this.$achievements.titles();
    if(newTitle && !_.includes(titles, newTitle)) return;
    this.title = newTitle;
    if(newTitle) {
      this._deathMessage = this.$achievements.getDeathMessageForTitle(newTitle);
    } else {
      this._deathMessage = null;
    }
    emitter.emit('player:changetitle', { player: this });
  }

  changeName(newName) {
    if(!newName) return;
    this.nameEdit = newName;
    emitter.emit('player:changename', { player: this });
  }

  togglePersonality(personality) {
    if(!_.find(this.$personalities.earnedPersonalities, { name: personality })) return;
    this.$personalities.togglePersonality(this, personality);
    this._updatePersonalities();
  }

  moveToStart() {
    this.map = 'Norkos';
    this.x = 10;
    this.y = 10;
  }

  moveAction() {

    const weight = this.$playerMovement.getInitialWeight(this);

    let [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
    let tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);

    const partyTileCheck = () => {
      if(!this.$playerMovement.canEnterTile(this, tile) && this.party) {
        this.$partyStepsLeft = this.$partyStepsLeft || 3;

        if(this.$partyStepsLeft <= 0) {
          this.party.playerLeave(this);
        }

        this.$partyStepsLeft--;
      }
    };

    partyTileCheck();

    let attempts = 1;
    while(!this.$playerMovement.canEnterTile(this, tile)) {
      if(attempts > 8) {
        Logger.error('Player', new Error(`Player ${this.name} is position locked at ${this.x}, ${this.y} in ${this.map}`));
        break;
      }
      weight[index] = 0;
      [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
      tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);

      partyTileCheck();

      attempts++;
      Logger.silly('Player:Move', `${this.name} doing tile enter check again ${attempts}`);
    }

    if(!tile.terrain) {
      Logger.error('PlayerMovement', new Error(`Invalid tile terrain undefined for ${this.name} @ ${this.map}: ${this.x},${this.y}`));
    }

    this.lastDir = dir === 5 ? null : dir;
    this.x = newLoc.x;
    this.y = newLoc.y;

    const mapInstance = GameState.getInstance().world.maps[this.map];

    Logger.silly('Player:Move', `${this.name} doing validation`);

    if(!mapInstance || this.x <= 0 || this.y <= 0 || this.y > mapInstance.height || this.x > mapInstance.width) {
      Logger.error('PlayerMovement', new Error(`Out of bounds for ${this.name} on ${this.map}: ${this.x}, ${this.y}`));
      this.moveToStart();
    }

    const oldRegion = this.oldRegion;

    this.oldRegion = this.mapRegion;
    this.mapRegion = tile.region;

    if(!this.$shop || (oldRegion !== this.mapRegion)) {
      this.$updateShop = true;

      this.$shop = ShopGenerator.regionShop(this);
    }

    this.mapPath = tile.path;

    this.$playerMovement.handleTile(this, tile);

    this.stepCooldown--;

    const incrementStats = [
      'Character.Steps',
      `Character.Maps.${this.map}`,
      `Character.Terrains.${tile.terrain}`,
      `Character.Regions.${tile.region}`
    ];

    if(this.$personalities.isActive('Drunk')) {
      incrementStats.push('Character.Movement.Drunk');
    }

    if(this.$personalities.isActive('Solo') && !this.party) {
      incrementStats.push('Character.Movement.Solo');
    }

    if(this.party) {
      incrementStats.push('Character.Movement.Party');
    }

    Logger.silly('Player:Move', `${this.name} incrementing stats`);
    this.$statistics.batchIncrement(incrementStats);

    Logger.silly('Player:Move', `${this.name} gaining xp`);
    this.gainXp(SETTINGS.xpPerStep);
  }

  buyShopItem(itemId) {
    const items = _.get(this, '$shop.slots', []);
    const item = _.find(items, { id: itemId });

    if(!item) return 'Item does not exist';

    if(this.gold < item.price) return 'Too expensive for your blood';

    this.gold -= item.price;
    delete item.price;

    FindItem.operateOn(this, null, item);

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
    if(!this.guild || this.guild.$noGuild) return;
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
    if(!this.$canSave) return;
    this.$playerDb.savePlayer(this);
  }

  save() {
    this.checkAchievements();

    if(!this.saveSteps) this.saveSteps = SETTINGS.saveSteps;
    this.saveSteps--;

    if(this.saveSteps <= 0) {
      Logger.silly('Player:TakeTurn', `${this.name} actually saving.`);
      this._save();
      this.saveSteps = SETTINGS.saveSteps;
    }
    this.update();
  }

  _save() {
    this._saveSelf();
    this.$statistics.save();
    this.$pets.save();
  }

  checkAchievements() {
    if(!this.achievementSteps) this.achievementSteps = SETTINGS.achievementSteps;
    this.achievementSteps--;

    if(this.achievementSteps <= 0) {
      this._checkAchievements();

      this.achievementSteps = SETTINGS.achievementSteps;
    }
  }

  _checkAchievements() {
    this.$pets.checkPets(this);

    const newAchievements = this.$achievements.checkAchievements(this);

    if(newAchievements.length > 0) {
      emitter.emit('player:achieve', { player: this, achievements: newAchievements });
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
    this.$dataUpdater(this.name, 'bosstimers', MonsterGenerator.bossTimers);
  }

  _updateParty(force = false) {
    const transmitObject = this.party ? this.party.buildTransmitObject() : {};
    if(!force && this.$lastPartyObject && _.isEqual(transmitObject, this.$lastPartyObject)) return;
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
    const guild = this.guild;
    guild.$me = _.find(guild.members, { name: this.name });
    this.$dataUpdater(this.name, 'guild', guild);
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
    if(!this.$pets.activePet) return;
    this.$dataUpdater(this.name, 'petactive', this.$pets.activePet.buildTransmitObject());
  }

  __updateFestivals() {
    this.$dataUpdater(this.name, 'festivals', GameState.getInstance().festivals);
  }

  _updateSystem() {
    this.__updateFestivals();
  }

  _updatePremium() {
    this.$dataUpdater(this.name, 'premium', {
      conversionRate: SETTINGS.ilpConversionRate,
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

    if(this.$updateShop) {
      this.$updateShop = false;
      this._updateShop();
    }

    if(this.$updateEquipment) {
      this.$updateEquipment = false;
      this._updateEquipment();
    }

    if(this.$updateCollectibles) {
      this.$updateCollectibles = false;
      this._updateCollectibles();
    }

    if(this.$updateAchievements) {
      this.$updateAchievements = false;
      this._updateAchievements();
    }

    if(this.$updateGenders) {
      this.$updateGenders = false;
      this._updateGenders();
    }

    if(this.$updatePremium) {
      this.$updatePremium = false;
      this._updatePremium();
    }
  }

  get ascensionLevel() {
    return this.$statistics ? this.$statistics.getStat('Character.Ascension.Times') : 0;
  }

  getSalvageValues(item, baseMultiplier = 1, bonus = 0) {
    const critSalvageChance = this.calcLuckBonusFromValue(this.liveStats.luk + bonus);
    const isCrit = chance.integer({ min: 0, max: 10000 }) <= critSalvageChance ? 1 : 0;
    const multiplier = isCrit ? 3 : baseMultiplier;

    const wood = Math.round(item.woodValue() * multiplier);
    const stone = Math.round(item.stoneValue() * multiplier);
    const clay = Math.round(item.clayValue() * multiplier);
    const astralium = Math.round(item.astraliumValue() * multiplier);

    return { wood, stone, clay, astralium, isCrit };
  }

  incrementSalvageStatistics({ wood, stone, clay, astralium, isCrit }, numItems = 1) {
    this.$statistics.incrementStat('Character.Item.Salvage', numItems);

    if(wood > 0)      this.$statistics.incrementStat('Character.Salvage.Wood', wood);
    if(stone > 0)     this.$statistics.incrementStat('Character.Salvage.Stone', stone);
    if(clay > 0)      this.$statistics.incrementStat('Character.Salvage.Clay', clay);
    if(astralium > 0) this.$statistics.incrementStat('Character.Salvage.Astralium', astralium);
    if(isCrit > 0)    this.$statistics.incrementStat('Character.Salvage.CriticalSuccess', isCrit);

    this.guild.addResources({ wood, stone, clay, astralium });
  }

  ascend() {
    if(!this._level.atMaximum()) return;
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
      pet.unequipAll();
      pet.inventory = [];
    });

    this.$statistics.incrementStat('Character.Ascension.Levels', this.level);
    this._level.maximum += SETTINGS.ascensionLevelBoost;
    this._level.set(1);
    this._xp.set(0);

    this.resetMaxXp();

    this.$statistics.incrementStat('Character.Ascension.CollectiblesFound', this.$collectibles.totalCollectibles());
    this.$collectibles.reset();
    this.$collectibles.save();

    this.moveToStart();
    this.choices = [];

    this.$personalities.turnAllOff(this);

    this.recalculateStats();
    this._checkAchievements();
    this.update();
    this.save();

    this.$pets.save();
    this.$statistics.save();

    this.lastAscension = Date.now();

    const ascBonus = 0.25 + (0.05 * currentAscensionLevel);

    GameState.getInstance().addFestival({
      name: `${this.name}'s Ascension`,
      message: `${this.name} has ascended! +${ascBonus*100}% XP/Gold for everyone for 24 hours!`,
      startedBy: this.name,
      hourDuration: 24,
      bonuses: {
        xp: ascBonus,
        gold: ascBonus
      }
    });
  }
}
