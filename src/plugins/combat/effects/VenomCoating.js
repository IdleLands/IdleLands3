
import { Effect } from '../effect';

export class VenomCoating extends Effect {
  affect(target) {
    this.setStat(target, 'venom', this.potency);
    this.setStat(target, 'poison', this.potency * 2);
  }
}