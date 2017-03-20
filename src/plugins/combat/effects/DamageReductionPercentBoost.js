
import { Effect } from '../effect';

export class DamageReductionPercentBoost extends Effect {
  affect(target) {
    this.setStat(target, 'damageReductionPercent', this.potency);
  }
}