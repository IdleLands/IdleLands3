
import { Effect } from '../effect';

export class STRBoostValue extends Effect {
  affect() {
    this.str = this.potency;
  }
}