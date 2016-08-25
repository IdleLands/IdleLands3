
import { Effect } from '../effect';

export class DamageReductionBoost extends Effect {
  affect() {
    this.damageReduction = this.potency;
  }
}