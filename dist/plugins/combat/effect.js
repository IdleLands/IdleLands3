"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messagecreator_1 = require("../../plugins/events/messagecreator");
const logger_1 = require("../../shared/logger");
const Chance = require("chance");
const chance = new Chance();
class Effect {
    static get chance() { return chance; }
    constructor({ target, extra, duration, potency }) {
        this.target = target;
        this.extra = extra;
        this.potency = this._potency = potency;
        this.duration = this._duration = duration;
        if (duration <= 0 || !potency) {
            logger_1.Logger.error('Effect', new Error('Bad duration or potency given for effect.'), { name: this.constructor.name, duration, potency });
        }
    }
    _emitMessage(player, message, extraData = {}) {
        extraData.casterName = this.origin.name;
        extraData.spellName = this.origin.spell;
        const parsedMessage = messagecreator_1.MessageParser.stringFormat(message, player, extraData);
        this.target.$battle._emitMessage(parsedMessage);
    }
    statByPercent(player, stat, percent) {
        return Math.round(player.liveStats[stat] * percent / 100);
    }
    dealDamage(player, damage, message, extraData = {}) {
        const source = this.origin.ref;
        damage = player.$battle.dealDamage(player, damage, source);
        if (message) {
            extraData.damage = damage;
            this._emitMessage(player, message, extraData);
        }
        if (player.hp === 0) {
            this.target.$battle.handleDeath(player, source);
        }
        return damage;
    }
    tick() {
        this.duration--;
    }
    affect() { }
    unaffect() {
        this._emitMessage(this.target, 'The effect of %casterName\'s %spellName on %player has dissipated.');
    }
    setStat(target, stat, value) {
        this[stat] = value;
        if (target.$dirty) {
            target.$dirty.flags[stat] = true;
        }
    }
}
exports.Effect = Effect;
