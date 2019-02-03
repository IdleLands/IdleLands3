"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const equipment_1 = require("../../../core/base/equipment");
const item_generator_1 = require("../../../shared/item-generator");
const adventure_log_1 = require("../../../shared/adventure-log");
const settings_1 = require("../../../static/settings");
const MerchantEnchant_1 = require("./MerchantEnchant");
exports.WEIGHT = 306;
// Get the opportunity to buy an item
class Merchant extends event_1.Event {
    static operateOn(player, opts) {
        let { merchantBonus } = opts || {};
        merchantBonus = +merchantBonus;
        if (_.isNaN(merchantBonus))
            merchantBonus = event_1.Event.chance.integer({ min: -3, max: 15 });
        if (event_1.Event.chance.bool({ likelihood: Math.max(0, Math.min(100, merchantBonus / 10)) })) {
            MerchantEnchant_1.MerchantEnchant.operateOn(player);
            return [player];
        }
        const item = item_generator_1.ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk + player.liveStats.merchantItemGeneratorBonus + merchantBonus), player.level);
        if (!player.canEquip(item)) {
            const playerItem = player.equipment[item.type];
            const text = playerItem.score > item.score ? 'weak' : 'strong';
            player.$statistics.incrementStat('Character.Item.Discard');
            const message = `%player was offered %item by a wandering merchant, but it was too ${text} for %himher.`;
            const parsedMessage = this._parseText(message, player, { item: item.fullname });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        const sellScore = Math.abs(item.score) * settings_1.SETTINGS.merchantMultiplier;
        const cost = Math.round((sellScore - (sellScore * player.liveStats.merchantCostReductionMultiplier)) * player._$priceReductionMultiplier());
        if (cost > player.gold) {
            player.$statistics.incrementStat('Character.Item.TooExpensive');
            const message = '%player was offered %item by a wandering merchant, but it costs too much gold for %himher.';
            const parsedMessage = this._parseText(message, player, { item: item.fullname });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        const id = event_1.Event.chance.guid();
        const message = `Would you like to buy «${item.fullname}» (Score: ${item.score.toLocaleString()}) for ${cost.toLocaleString()} gold?`;
        const eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
        const extraData = { item, cost, eventText };
        const choices = ['Yes', 'No'];
        if (player.$pets.activePet) {
            choices.push('Pet');
        }
        player.addChoice({ id, message, extraData, event: 'Merchant', choices });
        return [player];
    }
    static makeChoice(player, id, response) {
        if (response === 'No')
            return;
        const choice = _.find(player.choices, { id });
        if ((!_.includes(choice.choices, 'Pet') && response === 'Pet'))
            return event_1.Event.feedback(player, 'Invalid choice. Cheater.');
        if (player.gold < choice.extraData.cost)
            return event_1.Event.feedback(player, 'You do not have enough gold!');
        const item = new equipment_1.Equipment(choice.extraData.item);
        if (response === 'Yes') {
            player.equip(item);
            item._wasEquipped = true;
            this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: adventure_log_1.MessageCategories.GOLD });
        }
        if (response === 'Pet') {
            const pet = player.$pets.activePet;
            pet.findItem(item);
            const eventText = this._parseText('%player bought a fancy %item for %pet with %hisher %gold gold!', player, { item: item.fullname, gold: choice.extraData.cost });
            this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.ITEM });
        }
        player.gainGold(-choice.extraData.cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
        player.$statistics.incrementStat('Character.Item.Buy');
    }
}
Merchant.WEIGHT = exports.WEIGHT;
exports.Merchant = Merchant;
