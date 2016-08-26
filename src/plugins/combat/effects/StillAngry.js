
import { Effect } from '../effect';

export class StillAngry extends Effect {
  affect() {
    this.stun = true;
    this.stunMessage = `${this.origin.name} is still fuming about the résumé that ${this.target.fullname} turned down!`;
  }

  tick() {
    super.tick();
    this.stun = true;
    this.stunMessage = `${this.origin.name} is still fuming about the résumé that ${this.target.fullname} turned down!`;
  }
}