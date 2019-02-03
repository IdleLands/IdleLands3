"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class SpellTargetPossibilities {
    static yes() {
        return true;
    }
    static enemyHasMp(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .filter(p => p.mp)
            .value().length > 1;
    }
    static moreThanOneEnemy(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .value().length > 1;
    }
    static enemyNotProfession(caster, profession) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .reject(p => p.professionName === profession)
            .value().length >= 1;
    }
    static anyEnemyDead(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp > 0)
            .reject(p => p.party === caster.party)
            .value().length >= 1;
    }
    // Dead and not bonecrafted before
    static anyBonecraftable(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp > 0)
            .reject(p => p.party === caster.party)
            .reject(p => p.$prevParty)
            .value().length >= 1;
    }
    // Not a boss, not a bitomancer
    static anyBitFlippable(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .reject(p => p.$isBoss)
            .reject(p => p.professionName === 'Bitomancer')
            .value().length >= 1;
    }
    static allyWithoutEffect(caster, effect) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party !== caster.party)
            .reject(p => p.$effects.hasEffect(effect))
            .value().length >= 1;
    }
    static allyBelowHealthPercent(caster, percent) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party !== caster.party)
            .reject(p => p._hp.greaterThanPercent(percent))
            .value().length >= 1;
    }
    static allyBelowMaxHealth(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party !== caster.party)
            .reject(p => p._hp.atMaximum())
            .value().length >= 1;
    }
    static anyAllyDead(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp > 0)
            .reject(p => p.party !== caster.party)
            .value().length >= 1;
    }
    static allyBelow50PercentHealth(caster) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party !== caster.party)
            .reject(p => p._hp.greaterThanPercent(50))
            .value().length >= 1;
    }
    static enemyWithoutEffect(caster, effect) {
        return _(caster.$battle.allPlayers)
            .reject(p => p.hp === 0)
            .reject(p => p.party === caster.party)
            .reject(p => p.$effects.hasEffect(effect))
            .value().length >= 1;
    }
}
exports.SpellTargetPossibilities = SpellTargetPossibilities;
