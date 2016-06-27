
import _ from 'lodash';
import { Dependencies } from 'constitute';
import { Character } from '../../core/base/character';

import { SETTINGS } from '../../static/settings';

import { PlayerDb } from './player.db';
import { PlayerMovement } from './player.movement';

import { DataUpdater } from '../../shared/data-updater';

import { emitter } from './_emitter';

@Dependencies(PlayerDb)
export class Player extends Character {
  constructor(playerDb) {
    super();
    this.$playerDb = playerDb;
    this.$playerMovement = PlayerMovement;
  }

  init(opts) {
    super.init(opts);

    if(!this.joinDate)  this.joinDate = Date.now();
    if(!this.mapRegion) this.mapRegion = 'Wilderness';
    if(!this.gold)      this.gold = 0;
    if(!this.map)       this.map = 'Norkos';
    if(!this.x)         this.x = 10;
    if(!this.y)         this.y = 10;
  }

  takeTurn() {
    this.moveAction();
    this.save();
  }

  levelUp() {
    if(this.level === SETTINGS.maxLevel) return;
    this._level.add(1);
    this.resetMaxXp();
    this._xp.toMinimum();
    emitter.emit('player:levelup', { player: this });
  }

  gainXp(xp = 1) {
    this._xp.add(xp);

    if(xp > 0) {
      this.$statistics.incrementStat('Character.XP.Gain', xp);
    } else {
      this.$statistics.incrementStat('Character.XP.Lose', -xp);
    }

    if(this._xp.atMaximum()) this.levelUp();
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

    this.$statistics.batchIncrement(['Character.Steps', `Character.Terrains.${tile.terrain}`, `Character.Regions.${tile.region}`]);

    // TODO xpGain stat
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
    DataUpdater(this.name, 'player', this.buildSaveObject());
  }
}