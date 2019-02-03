"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 36;
// Lose 3-5% XP
class XPForsake extends event_1.Event {
    static operateOn(player, forceMessage) {
        const percent = event_1.Event.chance.floating({ fixed: 5, min: 0.03, max: 0.05 });
        const baseXP = Math.floor(player._xp.maximum * percent);
        const xpModCheck = player._calcModXp(-baseXP);
        const xpMod = Math.max(baseXP, xpModCheck);
        player.gainXp(-xpMod, false);
        const eventText = forceMessage ? this._parseText(forceMessage, player, { xp: Math.abs(xpMod) }) : this.eventText('forsakeXp', player, { xp: Math.abs(xpMod) });
        this.emitMessage({ affected: [player], eventText: `${eventText} [-${Math.abs(xpMod).toLocaleString()} xp, ~${(percent * 100).toFixed(2)}%]`, category: adventure_log_1.MessageCategories.XP });
        return [player];
    }
}
XPForsake.WEIGHT = exports.WEIGHT;
exports.XPForsake = XPForsake;
