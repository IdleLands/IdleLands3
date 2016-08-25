
import { Effect } from '../effect';

export class BluntHit extends Effect {
  affect() {
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stunned!`;
  }

  tick() {
    super.tick();
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stunned!`;
  }
}