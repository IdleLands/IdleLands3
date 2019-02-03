"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 1;
// Switcheroo an item (flip any stat between positive and negative)
class Switcheroo extends event_1.Event {
    static operateOn(player) {
        const item = this.pickValidItem(player);
        if (!item)
            return;
        const stat = this.pickStat(item);
        if (!item[stat])
            return;
        const eventText = this.eventText('flipStat', player, { item: item.fullname, stat });
        this.emitMessage({ affected: [player], eventText: `${eventText} [${stat} ${item[stat]} -> ${-item[stat]}]`, category: adventure_log_1.MessageCategories.ITEM });
        item[stat] = -item[stat];
        item.score;
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    }
}
Switcheroo.WEIGHT = exports.WEIGHT;
exports.Switcheroo = Switcheroo;
