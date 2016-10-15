
import { Effect } from '../effect';

export class Heartbleed extends Effect {

  affect() {
    this._emitMessage(this.target, '%player\'s heart begins bleeding!');
  }

  tick() {
    super.tick();
    const damage = Math.round(this.target._hp.maximum * 0.07);
    const message = '%player suffered %damage damage from %casterName\'s %spellName!';
    this.dealDamage(this.target, damage, message);
  }
}