
import { Effect } from '../effect';

export class STRLoss extends Effect {
  affect(target) {
    this.str = -this.statByPercent(target, 'str', this.potency);
  }
}