
import { Effect } from '../effect';

export class LUKBoost extends Effect {
  affect(target) {
    this.setStat(target, 'luk', this.statByPercent(target, 'luk', this.potency));
  }
}