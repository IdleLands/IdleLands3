
import { Effect } from '../effect';

export class DEXBoost extends Effect {
  affect(target) {
    this.setStat(target, 'dex', this.statByPercent(target, 'dex', this.potency));
  }
}