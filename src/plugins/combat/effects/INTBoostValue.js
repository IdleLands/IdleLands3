
import { Effect } from '../effect';

export class INTBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'int', this.potency);
  }
}