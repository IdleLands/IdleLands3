
import { Effect } from '../effect';

export class AGIBoost extends Effect {
  affect(target) {
    this.agi = this.statByPercent(target, 'agi', this.potency);
  }
}