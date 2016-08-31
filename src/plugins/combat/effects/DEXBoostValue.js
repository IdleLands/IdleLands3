
import { Effect } from '../effect';

export class DEXBoostValue extends Effect {
  affect() {
    this.dex = this.potency;
  }
}