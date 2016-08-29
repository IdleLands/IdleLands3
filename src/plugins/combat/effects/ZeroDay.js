
import { Effect } from '../effect';

export class ZeroDay extends Effect {
  affect() {
    this.damageReduction = -this.potency;
  }
}