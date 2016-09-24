
import { Effect } from '../effect';

export class STRBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'str', this.potency);
  }
}