
import { Effect } from '../effect';

// copy-paste because this effect is way more important than a normal DR skill
export class Tranquility extends Effect {
  affect(target) {
    this.setStat(target, 'damageReduction', this.potency);
  }
}