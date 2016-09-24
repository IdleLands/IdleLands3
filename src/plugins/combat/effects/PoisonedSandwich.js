
import _ from 'lodash';

import { Effect } from '../effect';

export class PoisonedSandwich extends Effect {
  affect(target) {
    const newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
    _.each(newStats, (val, stat) => {
      this.setStat(target, stat, val);
    });
  }

  tick() {
    super.tick();

    const damage = Math.round(this.potency);
    this._emitMessage(this.target, `%player suffered ${damage} damage from %casterName's %spellName!`);
    this.dealDamage(this.target, damage);
  }
}