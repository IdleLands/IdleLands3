
import { Effect } from '../effect';

export class DEXLoss extends Effect {
  affect(target) {
    this.setStat(target, 'dex', -this.statByPercent(target, 'dex', this.potency));
  }
}