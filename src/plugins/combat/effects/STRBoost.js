
import { Effect } from '../effect';

export class STRBoost extends Effect {
  affect(target) {
    this.str = this.statByPercent(target, 'str', this.potency);
  }
}