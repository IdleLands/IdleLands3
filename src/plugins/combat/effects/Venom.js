
import { Effect } from '../effect';

export class Venom extends Effect {
  constructor(opts) {
    if(!opts.duration) opts.duration = 5;
    super(opts);
  }

  affect() {
    this._emitMessage(this.target, '%player had a dangerous venom injected into %hisher veins!');
  }

  tick() {
    super.tick();
    const damage = Math.round(this.target.hp * 0.02 * this.potency);
    const message = '%player suffered %damage damage from %casterName\'s %spellName!';
    this.dealDamage(this.target, damage, message);
  }
}