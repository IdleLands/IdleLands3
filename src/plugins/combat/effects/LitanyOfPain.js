
import { Effect } from '../effect';

export class LitanyOfPain extends Effect {
  tick() {
    const damage = Math.round(this.potency);
    this.target._hp.sub(damage);
    this._emitMessage(this.target, `%player suffered ${damage} damage from %casterName's %spellName!`);
  }
}