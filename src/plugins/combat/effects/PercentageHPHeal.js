
import { Effect } from '../effect';

export class PercentageHPHeal extends Effect {
  tick() {
    super.tick();
    const healedHp = Math.round(this.target._hp.maximum * this.potency/100);
    this.target.$battle.healDamage(this.target, healedHp, this.origin.ref);
    this._emitMessage(this.target, `%player was healed for ${healedHp} hp by %casterName's %spellName!`);
  }
}