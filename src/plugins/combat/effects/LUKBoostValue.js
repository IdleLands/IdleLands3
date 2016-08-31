
import { Effect } from '../effect';

export class LUKBoostValue extends Effect {
  affect() {
    this.luk = this.potency;
  }
}