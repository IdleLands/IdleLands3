
import { Effect } from '../effect';

export class STRLoss extends Effect {
  affect(target) {
    this.setStat(target, 'str', -this.statByPercent(target, 'str', this.potency));
  }
}