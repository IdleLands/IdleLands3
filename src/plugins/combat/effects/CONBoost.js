
import { Effect } from '../effect';

export class CONBoost extends Effect {
  affect(target) {
    this.con = this.statByPercent(target, 'con', this.potency);
  }
}