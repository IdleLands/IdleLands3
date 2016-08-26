
import { Effect } from '../effect';

export class DEXBoost extends Effect {
  affect(target) {
    this.dex = this.statByPercent(target, 'dex', this.potency);
  }
}