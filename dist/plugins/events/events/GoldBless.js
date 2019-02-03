"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const GoldBlessParty_1 = require("./GoldBlessParty");
exports.WEIGHT = 216;
// Gain 10-1000 Gold
class GoldBless extends event_1.Event {
    static operateOn(player, useDiminishingReturns = false) {
        if (player.party && event_1.Event.chance.bool({ likelihood: 70 })) {
            GoldBlessParty_1.GoldBlessParty.operateOn(player);
            return player.party.members;
        }
        let value = event_1.Event.chance.integer({ min: 10, max: Math.max(11, 350 * player.level) });
        if (event_1.Event.chance.bool({ likelihood: 1 })) {
            const maxGoldGained = Math.max(1000, Math.round(player.gold * 0.02));
            const baseGold = Math.floor(event_1.Event.chance.integer({ min: 10, max: maxGoldGained }));
            value = baseGold;
        }
        let goldMod = value;
        let diminishingReturnsMultiplier;
        if (useDiminishingReturns) {
            if (player.forceEvent.steps > 400)
                diminishingReturnsMultiplier = 0.05;
            else if (player.forceEvent.steps > 300)
                diminishingReturnsMultiplier = 0.1;
            else if (player.forceEvent.steps > 200)
                diminishingReturnsMultiplier = 0.25;
            else if (player.forceEvent.steps > 100)
                diminishingReturnsMultiplier = 0.5;
        }
        if (diminishingReturnsMultiplier)
            goldMod = Math.round(goldMod * diminishingReturnsMultiplier);
        goldMod = player.gainGold(goldMod); // gainGold modifies goldMod. Use result to get accurate event text.
        const eventText = this.eventText('blessGold', player, { gold: goldMod });
        const diminishingReturnsText = diminishingReturnsMultiplier ? ' (-' + ((1 - diminishingReturnsMultiplier) * 100) + '%)' : '';
        this.emitMessage({ affected: [player], eventText: `${eventText} [+${goldMod.toLocaleString()}${diminishingReturnsText} gold]`, category: adventure_log_1.MessageCategories.GOLD });
        return [player];
    }
}
GoldBless.WEIGHT = exports.WEIGHT;
exports.GoldBless = GoldBless;
