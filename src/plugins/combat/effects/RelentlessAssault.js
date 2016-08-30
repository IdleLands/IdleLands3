
import { Effect } from '../effect';

export class RelentlessAssault extends Effect {
  tick() {
    super.tick();

    this.target.$battle.doAttack(this.target, 'Attack');
    this.target.$battle.doAttack(this.target, 'Attack');
    this.target._special.sub(25);

    if(this.target._special.atMinimum()) this.duration = 0;
  }
}