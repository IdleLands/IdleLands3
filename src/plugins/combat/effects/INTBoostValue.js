
import { Effect } from '../effect';

export class INTBoostValue extends Effect {
  affect() {
    this.int = this.potency;
  }
}