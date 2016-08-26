
import _ from 'lodash';

import { Effect } from '../effect';

export class Stuffed extends Effect {
  affect() {
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stuffed!`;

    _.extend(this, _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']));
  }

  tick() {
    super.tick();
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stuffed!`;
  }
}