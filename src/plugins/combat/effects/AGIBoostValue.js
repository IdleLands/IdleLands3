
import { Effect } from '../effect';

export class AGIBoostValue extends Effect {
  affect() {
    this.agi = this.potency;
  }
}