
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

  init(opts) {
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
  }

  quickLogin() {
    this.$updateAchievements = true;
    this.$updateCollectibles = true;

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

  gainGold(gold = 1) {
    gold = this.liveStats.gold(gold);
    super.gainGold(gold);

    if(gold > 0) {
      this.$statistics.incrementStat('Character.Gold.Gain', gold);
    } else {
      this.$statistics.incrementStat('Character.Gold.Lose', -gold);
    }

    return gold;
  }

  gainXp(xp = 1) {
    xp = this.liveStats.xp(xp);
    super.gainXp(xp);

    if(xp > 0) {
      this.$statistics.incrementStat('Character.XP.Gain', xp);
    } else {
      this.$statistics.incrementStat('Character.XP.Lose', -xp);
    }

    if(this._xp.atMaximum()) this.levelUp();

    return xp;
  }

  addChoice(messageData) {
    this.choices.push(messageData);

    if(this.choices.length > SETTINGS.maxChoices) {
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
    if(newTitle && !_.includes(this.$achievements.titles(), newTitle)) return;
    this.title = newTitle;
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

  moveAction() {
    const weight = this.$playerMovement.getInitialWeight(this);

    let [index, newLoc, dir] = this.$playerMovement.pickRandomTile(this, weight);
    let tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);

    let attempts = 1;
    while(!this.$playerMovement.canEnterTile(this, tile)) {
      if (attempts > 8) {
        Logger.error('Player', `Player ${this.name} is position locked at ${this.x}, ${this.y} in ${this.map}`);
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
      this.map = 'Norkos';
      this.x = 10;
      this.y = 10;
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

  buildSaveObject() {
    return _.omitBy(this, (val, key) => _.startsWith(key, '$'));
  }

  buildTransmitObject() {
    const badKeys = ['equipment', 'isOnline', 'stepCooldown', 'userId', 'lastDir', 'allIps'];
    return _.omitBy(this, (val, key) => {
      return _.startsWith(key, '$') || _.includes(key, 'Link') || _.includes(key, 'Steps') || _.includes(badKeys, key);
    });
  }

  _saveSelf() {
    this.$playerDb.savePlayer(this);
  }

  save() {
    this.checkAchievements();

    if(!this.saveSteps) this.saveSteps = SETTINGS.saveSteps;
    this.saveSteps--;

    if(this.saveSteps <= 0) {
      this._saveSelf();
      this.$statistics.save();
      this.$pets.save();
      this.saveSteps = SETTINGS.saveSteps;
    }
    this.update();
  }

  checkAchievements() {
    if(!this.achievementSteps) this.achievementSteps = SETTINGS.achievementSteps;
    this.achievementSteps--;

    if(this.achievementSteps <= 0) {
      this.$pets.checkPets(this);
      const newAchievements = this.$achievements.checkAchievements(this);
      if(newAchievements.length > 0) {
        emitter.emit('player:achieve', { player: this, achievements: newAchievements });
        this.$personalities.checkPersonalities(this);
      }

      this.achievementSteps = SETTINGS.achievementSteps;
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
    this.$dataUpdater(this.name, 'collectibles', this.$collectibles.collectibles);
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

  update() {
    this._updatePlayer();
    this._updateParty();

    if(this.$updateEquipment) {
      this._updateEquipment();
    }
    // this._updateStatistics();
    /* if(this.$updateAchievements) {
      this._updateAchievements();
      this.$updateAchievements = false;
    } */
    /* if(this.$updateCollectibles) {
      this._updateCollectibles();
      this.$updateCollectibles = false;
    } */
    // this._updatePersonalities();
  }
}
