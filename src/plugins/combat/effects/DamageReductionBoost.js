
import { Effect } from '../effect';

export class DamageReductionBoost extends Effect {
  affect(target) {
    this.setStat(target, 'damageReduction', this.potency);
  }
}