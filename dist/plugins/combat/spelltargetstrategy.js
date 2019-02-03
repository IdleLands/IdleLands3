"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
class SpellTargetStrategy {
    static all(caster) {
        return caster.$battle.allPlayers;
    }
    static allAlive(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .value();
    }
    static allEnemies(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .value();
    }
    static enemyWithMostMp(caster) {
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party === caster.party)
                .sortBy(p => p.mp)
                .reverse()
                .value()[0]];
    }
    static strongestEnemyScore(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .sortBy(p => p.itemScore)
            .reverse()
            .value()[0];
    }
    static randomEnemyNotProfession(caster) {
        return function (profession) {
            return [_(caster.$battle.allPlayers)
                    .reject(p => p.hp === 0)
                    .reject(p => p.professionName === profession)
                    .reject(p => p.party === caster.party)
                    .sample()];
        };
    }
    static randomEnemy(caster) {
        if (caster.professionName === 'Lich')
            return this.allEnemies(caster);
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party === caster.party)
                .sample()];
    }
    static randomEnemies(caster) {
        return function (numEnemies) {
            const validTargets = _(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party === caster.party)
                .value();
            return _.map(new Array(numEnemies), () => _.sample(validTargets));
        };
    }
    static randomDeadEnemy(caster) {
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp > 0)
                .reject(p => p.party === caster.party)
                .sample()];
    }
    // Dead enemy and not bonecrafted before
    static randomBonecraftable(caster) {
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp > 0)
                .reject(p => p.party === caster.party)
                .reject(p => p.$prevParty)
                .sample()];
    }
    // Not boss, not bitomancer
    static randomBitFlippable(caster) {
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party === caster.party)
                .reject(p => p.$isBoss)
                .reject(p => p.professionName === 'Bitomancer')
                .sample()];
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
    static randomAllyBelowHealthPercent(caster) {
        return function (percent) {
            return [_(caster.$battle.allPlayers)
                    .reject(p => p.hp === 0)
                    .reject(p => p.party !== caster.party)
                    .reject(p => p._hp.greaterThanPercent(percent))
                    .sample()];
        };
    }
    static randomAllyBelowMaxHealth(caster) {
        return [_(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party !== caster.party)
                .reject(p => p._hp.atMaximum())
                .sample()];
    }
    static randomAllyWithoutEffect(caster) {
        return function (effect) {
            return [_(caster.$battle.allPlayers)
                    .reject(p => p.hp === 0)
                    .reject(p => p.party !== caster.party)
                    .reject(p => p.$effects.hasEffect(effect))
                    .sample()];
        };
    }
    static randomEnemyWithoutEffect(caster) {
        return function (effect) {
            return [_(caster.$battle.allPlayers)
                    .reject(p => p.hp === 0)
                    .reject(p => p.party === caster.party)
                    .reject(p => p.$effects.hasEffect(effect))
                    .sample()];
        };
    }
    static randomAllyWithoutEffectAndPrioritizeCaster(caster) {
        return function (effect) {
            const allies = _(caster.$battle.allPlayers)
                .reject(p => p.hp === 0)
                .reject(p => p.party !== caster.party)
                .reject(p => p.$effects.hasEffect(effect)).value();
            const weights = _.map(allies, ally => {
                return (ally === caster) ? 7 : 5;
            });
            return [chance.weighted(allies, weights)];
        };
    }
    static self(caster) {
        return [caster];
    }
}
exports.SpellTargetStrategy = SpellTargetStrategy;
