import { Effect } from '../effect';

export class Intimidate extends Effect {
  affect() {
    this.setStat(this.target, 'aegis', -this.potency);
    this._emitMessage(this.target, '%casterName is getting up in %player\'s face!');
  }

  tick() {
    this._emitMessage(this.target, '%casterName is getting up in %player\'s face!');
  }
}
