
import { Effect } from '../effect';

export class Prone extends Effect {
  constructor(opts) {
    if(!opts.duration) opts.duration = 1;
    super(opts);
  }

  affect() {
    this.stun = !this.target.$isBoss;
    this.stunMessage = `${this.target.fullname} is stunned!`;
    this._emitMessage(this.target, '%player was knocked prone!');
  }

  tick() {
    super.tick();
    this.stun = !this.target.$isBoss;
    this.stunMessage = `${this.target.fullname} is stunned!`;
  }
}