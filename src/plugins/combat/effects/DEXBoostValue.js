
import { Effect } from '../effect';

export class DEXBoostValue extends Effect {
  affect(target) {
    this.setStat(target, 'dex', this.potency);
  }
}