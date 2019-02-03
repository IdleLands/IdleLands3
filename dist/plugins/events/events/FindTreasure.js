"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const FindItem_1 = require("./FindItem");
const item_generator_1 = require("../../../shared/item-generator");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = -1;
// Find treasure
class FindTreasure extends event_1.Event {
    static operateOn(player, { treasureName }) {
        if (player.stepCooldown > 0)
            return;
        player.stepCooldown = 20;
        const eventText = this._parseText('%player came across the worldly treasure of %treasure!', player, { treasure: treasureName });
        this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.EXPLORE });
        player.$statistics.incrementStat(`Character.Treasure.${treasureName}`);
        _.each(item_generator_1.ItemGenerator.getAllTreasure(treasureName, player), item => {
            if (!player.canEquip(item))
                return;
            FindItem_1.FindItem.operateOn(player, null, item);
        });
    }
}
FindTreasure.WEIGHT = exports.WEIGHT;
exports.FindTreasure = FindTreasure;
