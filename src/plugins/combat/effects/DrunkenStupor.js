
import { Effect } from '../effect';

export class DrunkenStupor extends Effect {

  affect() {
    this.stun = this.target.$drunk.gtePercent(50) && Effect.chance.bool({ likelihood: 75 });
    this.stunMessage = `${this.target.fullname} falls into a drunken stupor!`;
  }

  tick() {
    super.tick();
    this.target.$drunk.sub(25);
    this.stun = this.target.$drunk.gtePercent(50) && Effect.chance.bool({ likelihood: 75 });
    this.stunMessage = `${this.target.fullname} is too drunk to act!`;
  }

  unaffect() {
    super.unaffect();
    this.target.$drunk.toMinimum();
  }
}