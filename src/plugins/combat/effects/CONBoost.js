
import { Effect } from '../effect';

export class CONBoost extends Effect {
  affect(target) {
    this.setStat(target, 'con', this.statByPercent(target, 'con', this.potency));
  }
}