
import _ from 'lodash';

export class SpellTargetStrategy {
  static allEnemies(caster) {
    return _(caster.$battle.allPlayers)
      .reject(p => p.party === caster.party)
      .value();
  }

  static randomEnemy(caster) {
    return [_(caster.$battle.allPlayers)
      .reject(p => p.party === caster.party)
      .sample()];
  }

  static allAllies(caster) {
    return _(caster.$battle.allPlayers)
      .filter(p => p.party === caster.party)
      .value();
  }

  static self(caster) {
    return [caster];
  }
}