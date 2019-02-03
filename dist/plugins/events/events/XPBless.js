"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const XPBlessParty_1 = require("./XPBlessParty");
exports.WEIGHT = 108;
// Gain 1-3% XP
class XPBless extends event_1.Event {
    static operateOn(player) {
        if (player.party && event_1.Event.chance.bool({ likelihood: 70 })) {
            XPBlessParty_1.XPBlessParty.operateOn(player);
            return player.party.players;
        }
        let percent = event_1.Event.chance.floating({ fixed: 5, min: 0.01, max: 0.03 });
        const baseXp = Math.floor(player._xp.maximum * percent);
        const xpMod = player.gainXp(baseXp);
        const eventText = this.eventText('blessXp', player, { xp: xpMod });
        // recalculate for the modified value
        percent = xpMod / player._xp.maximum;
        this.emitMessage({ affected: [player], eventText: `${eventText} [+${xpMod.toLocaleString()} xp, ~${(percent * 100).toFixed(2)}%]`, category: adventure_log_1.MessageCategories.XP });
        return [player];
    }
}
XPBless.WEIGHT = exports.WEIGHT;
exports.XPBless = XPBless;
