"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 90;
// Forsake an item (random stat -5%)
class ItemForsake extends event_1.Event {
    static operateOn(player) {
        const item = this.pickValidItem(player);
        if (!item)
            return;
        const stat = this.pickStat(item);
        if (!stat)
            return;
        const boost = item[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item[stat] / 20)));
        const eventText = this.eventText('forsakeItem', player, { item: item.fullname });
        this.emitMessage({ affected: [player], eventText: `${eventText} [${stat} ${item[stat].toLocaleString()} -> ${(item[stat] - boost).toLocaleString()}]`, category: adventure_log_1.MessageCategories.ITEM });
        item[stat] -= boost;
        item.score;
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    }
}
ItemForsake.WEIGHT = exports.WEIGHT;
exports.ItemForsake = ItemForsake;
