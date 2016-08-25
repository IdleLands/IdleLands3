
import { Effect } from '../effect';

export class PercentageHPHeal extends Effect {
  tick() {
    const healedHp = Math.round(this.target._hp.maximum * this.potency/100);
    this.target._hp.add(healedHp);
    this._emitMessage(this.target, `%player was healed for ${healedHp} hp by %casterName's %spellName!`);
  }
}