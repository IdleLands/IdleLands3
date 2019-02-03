"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const Enchant_1 = require("./Enchant");
exports.WEIGHT = -1;
// Get the opportunity to buy an item
class MerchantEnchant extends event_1.Event {
    static operateOn(player) {
        player.$statistics.batchIncrement(['Character.Events', 'Character.Event.MerchantEnchant']);
        const cost = Math.round(event_1.Event.chance.integer({ min: 100000, max: 500000 }) * player._$priceReductionMultiplier());
        if (cost > player.gold) {
            player.$statistics.incrementStat('Character.Enchant.TooExpensive');
            const message = '%player was offered an enchantment by a wandering merchant, but %she doesn\'t have enough gold.';
            const parsedMessage = this._parseText(message, player, { item: 'an enchantment' });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        const id = event_1.Event.chance.guid();
        const message = `Would you like to buy an enchantment for ${cost.toLocaleString()} gold?`;
        const eventText = this.eventText('merchant', player, { item: 'an enchantment', shopGold: cost });
        const extraData = { cost, eventText };
        player.addChoice({ id, message, extraData, event: 'MerchantEnchant', choices: ['Yes', 'No'] });
        return [player];
    }
    static makeChoice(player, id, response) {
        if (response !== 'Yes')
            return;
        const choice = _.find(player.choices, { id });
        if (player.gold < choice.extraData.cost)
            return event_1.Event.feedback(player, 'You do not have enough gold!');
        player.gainGold(-choice.extraData.cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
        this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: adventure_log_1.MessageCategories.GOLD });
        Enchant_1.Enchant.operateOn(player);
    }
}
MerchantEnchant.WEIGHT = exports.WEIGHT;
exports.MerchantEnchant = MerchantEnchant;
