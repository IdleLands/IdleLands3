
import { Effect } from '../effect';

export class Thunderstrike extends Effect {
  tick() {
    super.tick();
    this._emitMessage(this.target, 'A storm brews over %player...');
  }

  unaffect() {
    const damage = this.potency * this._duration;
    this.target.$battle.dealDamage(this.target, damage);
    this._emitMessage(this.target, '%player got struck by %casterName\'s %spellName and took %damage damage!', { damage });
  }
}