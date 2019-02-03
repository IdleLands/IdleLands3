"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const stat_calculator_1 = require("../../../shared/stat-calculator");
class Attack extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    calcDamage() {
        const min = (this.caster.liveStats.str / 3) * (this.caster.liveStats.silver > 0 ? 1.1 : 1);
        const max = (this.caster.liveStats.str * (this.caster.liveStats.power > 0 ? 1.1 : 1));
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    preCast() {
        let message = '%player attacked %targetName with %hisher %weaponName and dealt %damage damage!';
        const weaponName = _.get(this.caster.equipment, 'mainhand.fullname', 'claw');
        const targets = this.determineTargets();
        if (_.compact(targets).length === 0) {
            return;
        }
        _.each(targets, target => {
            let done = false;
            let connected = true;
            let damage = this.calcDamage();
            const messageData = {
                weaponName,
                damage
            };
            const critChance = Math.min(100, Math.max(0, 1 + this.caster.liveStats.crit + (this.caster.liveStats.vorpal ? 10 : 0)));
            if (spell_1.Spell.chance.bool({ likelihood: critChance }) && target.liveStats.aegis <= 0) {
                this.caster.$battle.tryIncrement(this.caster, 'Combat.Give.CriticalHit');
                this.caster.$battle.tryIncrement(target, 'Combat.Receive.CriticalHit');
                damage = this.caster.liveStats.str * this.spellPower * (this.caster.liveStats.lethal > 0 ? 1.5 : 1);
                message = '%player CRITICALLY attacked %targetName with %hisher %weaponName and dealt %damage damage!';
                done = true;
            }
            const canDodge = spell_1.Spell.chance.bool({ likelihood: 80 });
            const [dodge, overcomeDodge] = [-target.liveStats.dodge, this.caster.liveStats.overcomeDodge];
            const dodgeRoll = spell_1.Spell.chance.integer({ min: dodge, max: Math.max(dodge + 1, overcomeDodge) });
            if (!done && canDodge && dodgeRoll <= 0) {
                done = true;
                connected = false;
                this.caster.$battle.tryIncrement(this.caster, 'Combat.Give.Dodge');
                this.caster.$battle.tryIncrement(target, 'Combat.Receive.Dodge');
                message = '%player attacked %targetName with %hisher %weaponName, but %targetName dodged!';
                damage = 0;
            }
            const canAvoidHit = spell_1.Spell.chance.bool({ likelihood: 80 });
            const [avoidHit, hit, deflect] = [-target.liveStats.avoidHit, this.caster.liveStats.hit, -target.liveStats.deflect];
            const hitRoll = spell_1.Spell.chance.integer({ min: avoidHit, max: Math.max(avoidHit + 1, hit) });
            if (!done && canAvoidHit && deflect <= hitRoll && hitRoll <= 0) {
                message = '%player attacked %targetName with %hisher %weaponName, but %player missed!';
                damage = 0;
                connected = false;
                if (hitRoll < deflect) {
                    this.caster.$battle.tryIncrement(this.caster, 'Combat.Give.Deflect');
                    this.caster.$battle.tryIncrement(target, 'Combat.Receive.Deflect');
                    const deflectItem = _.get(_.sample(_.values(target.equipment)), 'fullname', 'claw');
                    messageData.deflectItem = deflectItem;
                    message = '%player attacked %targetName with %hisher %weaponName, but %targetName deflected it with %deflectItem!';
                }
                else {
                    this.caster.$battle.tryIncrement(this.caster, 'Combat.Give.Miss');
                    this.caster.$battle.tryIncrement(target, 'Combat.Receive.Miss');
                }
            }
            super.cast({
                damage,
                message,
                messageData,
                targets: [target]
            });
            if (!connected)
                return;
            _.each(stat_calculator_1.ATTACK_STATS, stat => {
                const canUse = this.caster.liveStats[stat];
                if (canUse <= 0)
                    return;
                const chance = spell_1.Spell.chance.bool({ likelihood: Math.max(0, Math.min(100, canUse * 5)) });
                if (!chance)
                    return;
                const properEffect = _.capitalize(stat);
                if (target.$effects.hasEffect(properEffect))
                    return;
                const effectProto = require(`../effects/${properEffect}`)[properEffect];
                const effect = new effectProto({ target, potency: canUse, duration: 0 });
                effect.origin = { name: this.caster.fullname, ref: this.caster, spell: stat };
                target.$effects.add(effect);
                effect.affect(target);
                this.caster.$battle.tryIncrement(this.caster, `Combat.Give.CombatEffect.${properEffect}`);
                this.caster.$battle.tryIncrement(target, `Combat.Receive.CombatEffect.${properEffect}`);
            });
        });
    }
}
Attack.description = 'A simple attack that uses STR to deal damage.';
Attack.element = spell_1.SpellType.PHYSICAL;
Attack.tiers = [
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Archer' },
    { name: 'attack', spellPower: 1.2, weight: 30, cost: 0, level: 1, profession: 'Barbarian' },
    { name: 'strike', spellPower: 2.3, weight: 30, cost: 0, level: 50, profession: 'Barbarian' },
    { name: 'attack', spellPower: 1.0, weight: 40, cost: 0, level: 1, profession: 'Bard' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Beatomancer' },
    { name: 'attack', spellPower: 0.7, weight: 20, cost: 0, level: 1, profession: 'Bitomancer' },
    { name: 'attack', spellPower: 0.8, weight: 20, cost: 0, level: 1, profession: 'Cleric' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Clockborg' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Druid' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Fencer' },
    { name: 'attack', spellPower: 1.1, weight: 65, cost: 0, level: 1, profession: 'Fighter' },
    { name: 'strike', spellPower: 1.3, weight: 65, cost: 0, level: 50, profession: 'Fighter' },
    { name: 'assault', spellPower: 1.7, weight: 65, cost: 0, level: 100, profession: 'Fighter',
        collectibles: ['Broken Katana'] },
    { name: 'attack', spellPower: 1.0, weight: 30, cost: 0, level: 1, profession: 'Generalist' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Jester' },
    { name: 'strike', spellPower: 1.5, weight: 50, cost: 0, level: 90, profession: 'Jester' },
    { name: 'attack', spellPower: 0.5, weight: 50, cost: 0, level: 1, profession: 'Lich' },
    { name: 'attack', spellPower: 0.6, weight: 15, cost: 0, level: 1, profession: 'Mage' },
    { name: 'attack', spellPower: 0.9, weight: 20, cost: 0, level: 1, profession: 'MagicalMonster' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Monster' },
    { name: 'attack', spellPower: 0.5, weight: 20, cost: 0, level: 1, profession: 'Necromancer' },
    { name: 'attack', spellPower: 1.1, weight: 50, cost: 0, level: 1, profession: 'Pirate' },
    { name: 'strike', spellPower: 1.9, weight: 50, cost: 0, level: 75, profession: 'Pirate' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Rogue' },
    { name: 'strike', spellPower: 1.4, weight: 20, cost: 0, level: 25, profession: 'Rogue' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'SandwichArtist' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Trickster' }
];
exports.Attack = Attack;
