
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
    const damage = Math.round(this.origin.ref.liveStats.int * 0.25 * this.potency);
    this.target._hp.sub(damage);
    this._emitMessage(this.target, `%player suffered ${damage} damage from %casterName's %spellName!`);
  }
}