
import { Effect } from '../effect';

export class AGIBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'agi', this.potency);
  }
}