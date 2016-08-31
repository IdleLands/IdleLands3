
import _ from 'lodash';

import { Effect } from '../effect';

export class PoisonedSandwich extends Effect {
  affect() {
    _.extend(this, _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']));
  }

  tick() {
    super.tick();

    const damage = Math.round(this.potency);
    this._emitMessage(this.target, `%player suffered ${damage} damage from %casterName's %spellName!`);
    this.dealDamage(this.target, damage);
  }
}