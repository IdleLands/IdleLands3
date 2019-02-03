"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = -1;
// Gain 1-3% XP
class XPBlessParty extends event_1.Event {
    static operateOn(player) {
        const member = _(player.party.players)
            .sortBy(['level'])
            .head();
        const percent = event_1.Event.chance.floating({ fixed: 5, min: 0.01, max: 0.03 });
        const xpMod = Math.floor(member._xp.maximum * percent);
        const eventText = this.eventText('blessXpParty', player, { xp: xpMod, partyName: player.party.name });
        _.each(player.party.players, member => {
            const totalXp = member.gainXp(xpMod, false);
            // recalculate for the modified value
            const myPercent = xpMod / member._xp.maximum;
            this.emitMessage({ affected: [member], eventText: `${eventText} [+${totalXp.toLocaleString()} xp, ~${(myPercent * 100).toFixed(2)}%]`, category: adventure_log_1.MessageCategories.XP });
            if (!member.$statistics)
                return;
            member.$statistics.batchIncrement(['Character.Events', 'Character.Event.XPBlessParty']);
        });
    }
}
XPBlessParty.WEIGHT = exports.WEIGHT;
exports.XPBlessParty = XPBlessParty;
