
import { Effect } from '../effect';

export class INTBoost extends Effect {
  affect(target) {
    this.setStat(target, 'int', this.statByPercent(target, 'int', this.potency));
  }
}