
import { Effect } from '../effect';

export class LitanyOfPain extends Effect {
  tick() {
    super.tick();
    const damage = Math.round(this.potency);
    this._emitMessage(this.target, `%player suffered ${damage} damage from %casterName's %spellName!`);
    this.dealDamage(this.target, damage);
  }
}