
import _ from 'lodash';

export class SpellTargetStrategy {

  static all(caster) {
    return caster.$battle.allPlayers;
  }

  static allEnemies(caster) {
    return _(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .reject(p => p.party === caster.party)
      .value();
  }

  static randomEnemy(caster) {
    return [_(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .reject(p => p.party === caster.party)
      .sample()];
  }

  static randomEnemies(caster) {
    return function(numEnemies) {
      const validTargets = _(caster.$battle.allPlayers)
        .reject(p => p.hp === 0)
        .reject(p => p.party === caster.party)
        .value();

      return _.map(new Array(numEnemies), () => _.sample(validTargets));
    };
  }

  static allAllies(caster) {
    return _(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .filter(p => p.party === caster.party)
      .value();
  }

  static randomAlly(caster) {
    return [_(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .reject(p => p.party !== caster.party)
      .sample()];
  }

  static randomDeadAlly(caster) {
    return [_(caster.$battle.allPlayers)
      .reject(p => p.hp > 0)
      .reject(p => p.party !== caster.party)
      .sample()];
  }

  static randomAllyBelowMaxHealth(caster) {
    return [_(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .reject(p => p.party !== caster.party)
      .reject(p => p._hp.atMaximum())
      .sample()];
  }

  static randomAllyWithoutEffect(caster) {
    return function(effect) {
      return [_(caster.$battle.allPlayers)
        .reject(p => p.hp === 0)
        .reject(p => p.party !== caster.party)
        .reject(p => p.$effects.hasEffect(effect))
        .sample()];
    };
  }

  static randomEnemyWithoutEffect(caster) {
    return function(effect) {
      return [_(caster.$battle.allPlayers)
        .reject(p => p.hp === 0)
        .reject(p => p.party === caster.party)
        .reject(p => p.$effects.hasEffect(effect))
        .sample()];
    };
  }

  static self(caster) {
    return [caster];
  }
}