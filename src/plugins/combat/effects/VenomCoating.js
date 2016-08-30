
import { Effect } from '../effect';

export class VenomCoating extends Effect {
  affect() {
    this.venom = this.potency;
    this.poison = this.potency * 2;
  }
}