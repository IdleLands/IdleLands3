
import _ from 'lodash';
import { Dependencies } from 'constitute';
import { Character } from '../../core/base/character';

import { SETTINGS } from '../../static/settings';

import { PlayerDb } from './player.db';
import { PlayerMovement } from './player.movement';
import { ItemGenerator } from '../../shared/item-generator';

import { DataUpdater } from '../../shared/data-updater';
import { EventHandler } from '../events/eventhandler';

import * as Events from '../events/eventtypes/_all';

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
  }

  generateBaseEquipment() {
    const items = this.$itemGenerator.newPlayerEquipment();
    _.each(items, item => this.equip(item));
  }

  get fullname() {
    if(this.title) return `${this.name}, the ${this.title}`;
    return this.name;
  }

  takeTurn() {
    this.moveAction();
    EventHandler.tryToDoEvent(this);
    const newAchievements = this.$achievements.checkAchievements(this);
    if(newAchievements.length > 0) {
      emitter.emit('player:achieve', { player: this, achievements: newAchievements });
    }
    this.save();
  }

  levelUp() {
    if(this.level === SETTINGS.maxLevel) return;
    this._level.add(1);
    this.resetMaxXp();
    this._xp.toMinimum();
    this.recalculateStats();
    emitter.emit('player:levelup', { player: this });
  }

  gainGold(gold = 1) {
    super.gainGold(gold);

    if(gold > 0) {
      this.$statistics.incrementStat('Character.Gold.Gain', gold);
    } else {
      this.$statistics.incrementStat('Character.Gold.Lose', -gold);
    }
  }

  gainXp(xp = 1) {
    super.gainXp(xp);

    if(xp > 0) {
      this.$statistics.incrementStat('Character.XP.Gain', xp);
    } else {
      this.$statistics.incrementStat('Character.XP.Lose', -xp);
    }

    if(this._xp.atMaximum()) this.levelUp();
  }

  addChoice(messageData) {
    if(this.choices.length > SETTINGS.maxChoices) {
      this.choices.shift();
      this.$statistics.incrementStat('Character.Choice.Ignore');
    }

    this.choices.push(messageData);
    this.$statistics.incrementStat('Character.Choices');
  }

  handleChoice({ id, response }) {
    const choice = _.find(this.choices, { id });
    const result = Events[choice.event].makeChoice(this, id, response);
    if(result === false) return Events[choice.event].feedback(this);
    this.$statistics.batchIncrement(['Character.Choice.Chosen', `Character.Choice.Choose.${response}`]);
    this.removeChoice(id);
    this.update();
  }

  removeChoice(id) {
    this.choices = _.reject(this.choices, { id });
  }

  moveAction() {
    let [newLoc, dir] = this.$playerMovement.pickRandomTile(this);
    let tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);

    while(!this.$playerMovement.canEnterTile(this, tile)) {
      [newLoc, dir] = this.$playerMovement.pickRandomTile(this);
      tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
    }

    this.lastDir = dir === 5 ? null : dir;
    this.x = newLoc.x;
    this.y = newLoc.y;

    this.oldRegion = this.mapRegion;
    this.mapRegion = tile.region;

    this.mapPath = tile.path;

    this.$playerMovement.handleTile(this, tile);

    this.stepCooldown--;

    this.$statistics.batchIncrement([
      'Character.Steps',
      `Character.Maps.${this.map}`,
      `Character.Terrains.${tile.terrain}`,
      `Character.Regions.${tile.region}`
    ]);

    this.gainXp(10);
  }

  buildSaveObject() {
    return _.omitBy(this, (val, key) => _.startsWith(key, '$'));
  }

  save() {
    this.$playerDb.savePlayer(this);
    this.update();
  }

  update() {
    this.$dataUpdater(this.name, 'player', this.buildSaveObject());
    this.$dataUpdater(this.name, 'statistics', this.$statistics.stats);
    this.$dataUpdater(this.name, 'achievements', this.$achievements.achievements);
  }
}