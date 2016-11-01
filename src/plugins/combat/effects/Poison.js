
import { Effect } from '../effect';

export class Poison extends Effect {
  constructor(opts) {
    if(!opts.duration) opts.duration = 5;
    super(opts);
  }

  affect() {
    this._emitMessage(this.target, '%player was poisoned!');
  }

  tick() {
    super.tick();
    const damage = Math.round(this.origin.ref.liveStats.int * Math.log(this.potency + 1) / 6);  // ln(x+1)/6 * int
    if(damage > 0) {
      const message = '%player suffered %damage damage from %casterName\'s %spellName!';
      this.dealDamage(this.target, damage, message);
    } else {
      this._emitMessage(this.target, '%casterName\'s %spellName was ineffective against %player!');
    }
  }
}