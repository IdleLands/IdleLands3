"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = -1;
// Gain 10-1000 Gold
class GoldBlessParty extends event_1.Event {
    static operateOn(player) {
        const goldMod = Math.floor(event_1.Event.chance.integer({ min: 10, max: 10000 }));
        const eventText = this.eventText('blessGoldParty', player, { gold: goldMod, partyName: player.party.name });
        _.each(player.party.players, member => {
            const totalGold = member.gainGold(goldMod, false);
            this.emitMessage({ affected: [member], eventText: `${eventText} [+${totalGold.toLocaleString()} gold]`, category: adventure_log_1.MessageCategories.GOLD });
            if (!member.$statistics)
                return;
            member.$statistics.batchIncrement(['Character.Events', 'Character.Event.GoldBlessParty']);
        });
    }
}
GoldBlessParty.WEIGHT = exports.WEIGHT;
exports.GoldBlessParty = GoldBlessParty;
