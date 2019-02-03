"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 72;
// Lose 25-2000 Gold
class GoldForsake extends event_1.Event {
    static operateOn(player, forceMessage) {
        let value = event_1.Event.chance.integer({ min: 10, max: 500 * player.level });
        if (event_1.Event.chance.bool({ likelihood: 5 })) {
            const maxGoldLost = Math.max(1000, Math.round(player.gold * 0.03));
            const baseGold = Math.floor(event_1.Event.chance.integer({ min: 25, max: maxGoldLost }));
            value = baseGold;
        }
        const goldModCheck = player._calcModGold(-value);
        const goldMod = Math.min(player.gold, Math.max(Math.abs(goldModCheck), Math.abs(value)));
        player.gainGold(-goldMod, false);
        const eventText = forceMessage ? this._parseText(forceMessage, player, { gold: goldMod }) : this.eventText('forsakeGold', player, { gold: goldMod });
        this.emitMessage({ affected: [player], eventText: `${eventText} [-${goldMod.toLocaleString()} gold]`, category: adventure_log_1.MessageCategories.GOLD });
        return [player];
    }
}
GoldForsake.WEIGHT = exports.WEIGHT;
exports.GoldForsake = GoldForsake;
