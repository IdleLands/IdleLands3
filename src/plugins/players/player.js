
import _ from 'lodash';
import Chance from 'chance';
const chance = new Chance(Math.random);

import { Character } from '../../core/base/character';
import { GameState } from '../../core/game-state';

import { Logger } from '../../shared/logger';
import { savePlayer } from './player.db';

export class Player extends Character {
  constructor(opts) {
    super(opts);

    if(!this.joinDate)  this.joinDate = Date.now();
    if(!this.region)    this.region = 'Wilderness';
    if(!this.gold)      this.gold = 0;
    if(!this.map)       this.map = 'Norkos';
    if(!this.x)         this.x = 10;
    if(!this.y)         this.y = 10;
  }

  takeTurn() {
    this.moveAction();
    this.save();
  }

  pickRandomTile() {
    if(!this.ignoreDir)    this.ignoreDir = [];
    if(!this.stepCooldown) this.stepCooldown = 10;

    const directions = [1,  2,  3,  4,  5,  6,  7,  8,  9];
    const weight     = [10, 10, 10, 10, 10, 10, 10, 10, 10];

    // TODO implement drunk
    const MAX_DRUNK = 10;
    const drunk = Math.max(0, Math.min(MAX_DRUNK, 0));

    // this is a lot of math that someone smarter than me(?) wrote, ported directly from OldIdleLands
    if(this.lastDir) {
      const point1 = [this.lastDir % 3, Math.floor(this.lastDir / 3)]; // list -> matrix
      _.each(directions, num => {
        const point2 = [num % 3, Math.floor(num / 3)]; // list -> matrix
        const distance = Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
        if(distance === 0) {
          weight[num - 1] = 40 - 3.6 * drunk;
        } else {
          weight[num - 1] = Math.max(1, 4 - distance * (1 - drunk / MAX_DRUNK)); // each point of drunkenness makes the distance matter less
        }
      });
    }

    const randomDir = () => chance.weighted(directions, weight);
    let dir = null;

    do {
      dir = randomDir();
    } while(_.includes(this.ignoreDir, dir));

    return [this.num2dir(dir, this.x, this.y), dir];

  }

  levelUp() {
    console.log('levelup');
  }

  gainXp(xp = 1) {
    this._xp.add(xp);

    if(this._xp.atMax()) this.levelUp();
  }

  // TODO https://github.com/IdleLands/IdleLandsOld/blob/master/src/character/player/Player.coffee#L478
  canEnterTile(tile) {
    const properties = _.get(tile, 'object.properties');
    if(properties) {
      if(properties.requireMap) return false;
      if(properties.requireRegion) return false;
      if(properties.requireBoss) return false;
      if(properties.requireClass) return false;
      if(properties.requireAchievement) return false;
      if(properties.requireCollectible) return false;
    }
    return !tile.blocked && tile.terrain !== 'Void';
  }

  // TODO https://github.com/IdleLands/IdleLandsOld/blob/master/src/character/player/Player.coffee#L347
  handleTile(tile) {
    const type = _.get(tile, 'object.type');
    if(!type || !this[`handleTile${type}`]) return;
    this[`handleTile${type}`](tile);

    // TODO forceEvent
  }

  // TODO refactor all of this to a service of some sort
  getTileAt(x = this.x, y = this.y) {
    const map = GameState.world.maps[this.map];
    return map.getTile(x, y);
  }

  // TODO haste
  moveAction(currentStep = 1) {

    let [newLoc, dir] = this.pickRandomTile();
    let tile = this.getTileAt(newLoc.x, newLoc.y);
    while(!this.canEnterTile(tile)) {
      [newLoc, dir] = this.pickRandomTile();
      tile = this.getTileAt(newLoc.x, newLoc.y);
    }

    this.lastDir = dir === 5 ? null : dir;
    this.x = newLoc.x;
    this.y = newLoc.y;

    this.oldRegion = this.mapRegion;
    this.mapRegion = tile.region;

    this.handleTile(tile);

    this.stepCooldown--;
    if(currentStep < 5) {

      // TODO xpGain stat
      this.gainXp(10);
    }
  }

  save() {
    savePlayer(this);
  }
}