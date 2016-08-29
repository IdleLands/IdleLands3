
import { Effect } from '../effect';

export class DoS extends Effect {

  affect() {
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is dropping packets!`;
  }

  tick() {
    super.tick();
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is dropping packets!`;
  }
}