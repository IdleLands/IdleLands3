
import { Effect } from '../effect';

export class Frostbite extends Effect {
  affect() {
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is frostbitten!`;
  }

  tick() {
    super.tick();
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is frostbitten!`;
  }
}