
import _ from 'lodash';
import { Dependencies } from 'constitute';
import { Character } from '../../core/base/character';

import { GameState } from '../../core/game-state';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

import { PlayerDb } from './player.db';
import { PlayerMovement } from './player.movement';
import { ItemGenerator } from '../../shared/item-generator';

import { DataUpdater } from '../../shared/data-updater';
import { EventHandler } from '../events/eventhandler';

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

    this.$partyName = null;

    if(this.isMod) {
      this.emitGMData();
    }

    this.$canSave = true;
  }

  quickLogin() {
    this.$updateAchievements = true;
    this.$updateCollectibles = true;
    this._updateParty();

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

  takeTurn() {

    const activePet = this.$pets.activePet;

    if(activePet) {
      activePet.takeTurn();
      if(activePet.$updatePlayer) {
        this.__updatePetActive();
      }
    }

    if(this.$personalities.isActive('Camping')) {
      this.$statistics.incrementStat('Character.Movement.Camping');
      this.save();
      return;
    }

    this.attemptToDisbandSoloParty();

    try {
      this.moveAction();
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

  gainGold(baseGold = 1, calc = true) {
    
    const gold = calc ? this.liveStats.gold(baseGold) : baseGold;
    if(_.isNaN(gold) || gold === 0 || Math.sign(gold) !== Math.sign(baseGold)) return 0;
    
    super.gainGold(gold);
    
    if(gold > 0) {
      this.$statistics.incrementStat('Character.Gold.Gain', gold);
    } else {
      this.$statistics.incrementStat('Character.Gold.Lose', -gold);
    }
    
    return gold;
  }

  gainXp(baseXp = 1, calc = true) {

    const xp = calc ? this.liveStats.xp(baseXp) : baseXp;
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

        } else if(_.includes(choice.choices, 'No') && this.$personalities.isActive('Denier')) {
          this.handleChoice({ id: choice.id, response: 'No' });

        } else if(this.$personalities.isActive('Indecisive')) {
          this.handleChoice({ id: choice.id, response: _.sample(choice.choices) });
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
    if(result === false) return Events[choice.event].feedback(this);
    this.$statistics.batchIncrement(['Character.Choice.Chosen', `Character.Choice.Choose.${response}`]);
    this.removeChoice(id);
    this.update();
  }

  removeChoice(id) {
    this.choices = _.reject(this.choices, { id });
  }

  changeGender(newGender) {
    if(!_.includes(SETTINGS.validGenders, newGender)) return;
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

    let attempts = 1;
    while(!this.$playerMovement.canEnterTile(this, tile)) {
      if (attempts > 8) {
        // Logger.error('Player', `Player ${this.name} is position locked at ${this.x}, ${this.y} in ${this.map}`);
        break;
      }
      weight[index] = 0;
      [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
      tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
      attempts++;
    }

    this.lastDir = dir === 5 ? null : dir;
    this.x = newLoc.x;
    this.y = newLoc.y;

    const mapInstance = GameState.getInstance().world.maps[this.map];

    if(!mapInstance || this.x <= 0 || this.y <= 0 || this.y > mapInstance.height || this.x > mapInstance.width) {
      this.moveToStart();
    }

    this.oldRegion = this.mapRegion;
    this.mapRegion = tile.region;

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

    this.$statistics.batchIncrement(incrementStats);

    this.gainXp(SETTINGS.xpPerStep);
  }

  equip(item) {
    super.equip(item);
    this._saveSelf();
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

  buildSaveObject() {
    return _.omitBy(this, (val, key) => _.startsWith(key, '$'));
  }

  buildTransmitObject() {
    const badKeys = ['equipment', 'isOnline', 'stepCooldown', 'userId', 'lastDir', 'allIps'];
    const obj = _.omitBy(this, (val, key) => {
      return _.startsWith(key, '$') || _.includes(key, 'Link') || _.includes(key, 'Steps') || _.includes(badKeys, key);
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

  _updateParty() {
    const transmitObject = this.party ? this.party.buildTransmitObject() : {};
    if(this.$lastPartyObject && _.isEqual(transmitObject, this.$lastPartyObject)) return;
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

  update() {
    this._updatePlayer();
    this._updateParty();
    this._updateSystem();

    if(this.$updateEquipment) {
      this._updateEquipment();
    }
  }

  get ascensionLevel() {
    return this.$statistics.getStat('Character.Ascension.Times');
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
    this._level.maximum += 50;
    this._level.set(1);

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

    GameState.getInstance().addFestival({
      name: `${this.name}'s Ascension`,
      message: `${this.name} has ascended! +20% XP for everyone for 24 hours!`,
      hourDuration: 24,
      bonuses: {
        xp: 0.2 + (0.15 * currentAscensionLevel),
        gold: 0.2 + (0.15 * currentAscensionLevel)
      }
    });
  }
}
