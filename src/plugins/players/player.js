
import { Character } from '../../core/base/character';

import { SETTINGS } from '../../static/settings';

import { savePlayer } from './player.db';
import { PlayerMovement } from './player.movement';

import { emitter } from './_emitter';

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

  levelUp() {
    if(this.level === SETTINGS.maxLevel) return;
    this._level.add(1);
    this.resetMaxXp();
    this._xp.toMinimum();
    emitter.emit('player:levelup', { worker: this.$worker, player: this });
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

    let [newLoc, dir] = PlayerMovement.pickRandomTile(this);
    let tile = PlayerMovement.getTileAt(this.map, newLoc.x, newLoc.y);

    while(!PlayerMovement.canEnterTile(this, tile)) {
      [newLoc, dir] = PlayerMovement.pickRandomTile(this);
      tile = PlayerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
    }

    this.lastDir = dir === 5 ? null : dir;
    this.x = newLoc.x;
    this.y = newLoc.y;

    this.oldRegion = this.mapRegion;
    this.mapRegion = tile.region;

    PlayerMovement.handleTile(this, tile);

    this.stepCooldown--;

    this.$statistics.batchIncrement(['Character.Steps', `Character.Terrains.${tile.terrain}`, `Character.Regions.${tile.region}`]);

    // TODO xpGain stat
    this.gainXp(10);
  }

  save() {
    savePlayer(this);
  }
}