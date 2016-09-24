
import { Effect } from '../effect';

export class CONBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'con', this.potency);
  }
}