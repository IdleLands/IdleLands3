
import { Effect } from '../effect';

export class LUKBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'luk', this.potency);
  }
}