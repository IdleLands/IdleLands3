
import _ from 'lodash';

import { Effect } from '../effect';

export class Stuffed extends Effect {
  affect(target) {
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stuffed!`;

    const newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
    _.each(newStats, (val, stat) => {
      this.setStat(target, stat, val);
    });
  }

  tick() {
    super.tick();
    this.stun = Effect.chance.bool({ likelihood: this.potency });
    this.stunMessage = `${this.target.fullname} is stuffed!`;
  }
}