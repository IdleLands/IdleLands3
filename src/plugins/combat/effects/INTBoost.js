
import { Effect } from '../effect';

export class INTBoost extends Effect {
  affect(target) {
    this.int = this.statByPercent(target, 'int', this.potency);
  }
}