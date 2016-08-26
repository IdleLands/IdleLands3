
import { Effect } from '../effect';

export class Prone extends Effect {
  constructor(opts) {
    if(!opts.duration) opts.duration = 1;
    super(opts);
  }

  affect() {
    this.stun = true;
    this.stunMessage = `${this.target.fullname} is stunned!`;
    this._emitMessage(this.target, '%player was knocked prone!');
  }

  tick() {
    super.tick();
    this.stun = true;
    this.stunMessage = `${this.target.fullname} is stunned!`;
  }
}