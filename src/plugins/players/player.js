
import { Character } from '../../core/base/character';

import { savePlayer } from './player.db';
import { PlayerMovement } from './player.movement';

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
    console.log('levelup');
  }

  gainXp(xp = 1) {
    this._xp.add(xp);

    if(this._xp.atMax()) this.levelUp();
  }

  // TODO haste
  moveAction(currentStep = 1) {

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
    if(currentStep < 5) {

      // TODO xpGain stat
      this.gainXp(10);
    }
  }

  save() {
    savePlayer(this);
  }
}