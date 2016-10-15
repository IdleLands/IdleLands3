
import { Effect } from '../effect';

export class LitanyOfPain extends Effect {
  tick() {
    super.tick();
    const damage = Math.round(this.potency);
    this.dealDamage(this.target, damage, '%player suffered %damage damage from %casterName\'s %spellName!');
  }
}