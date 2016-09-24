
import { Effect } from '../effect';

export class AGIBoost extends Effect {
  affect(target) {
    this.setStat(target, 'agi', this.statByPercent(target, 'agi', this.potency));
  }
}