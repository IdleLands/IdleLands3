
import { Effect } from '../effect';

export class CONBoostValue extends Effect {
  affect() {
    this.con = this.potency;
  }
}