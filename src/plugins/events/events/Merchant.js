
import * as _ from 'lodash';
import { Event } from '../event';

import { Equipment } from '../../../core/base/equipment';
import { ItemGenerator } from '../../../shared/item-generator';
import { MessageCategories } from '../../../shared/adventure-log';

import { SETTINGS } from '../../../static/settings';

import { MerchantEnchant } from './MerchantEnchant';

export const WEIGHT = 306;

// Get the opportunity to buy an item
export class Merchant extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, opts) {

    let { merchantBonus } = opts || {};

    merchantBonus = +merchantBonus;
    if(_.isNaN(merchantBonus)) merchantBonus = Event.chance.integer({ min: -3, max: 15 });

    if(Event.chance.bool({ likelihood: Math.max(0, Math.min(100, merchantBonus/10)) })) {
      MerchantEnchant.operateOn(player);
      return [player];
    }

    const item = ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk + player.liveStats.merchantItemGeneratorBonus + merchantBonus), player.level);
    if(!player.canEquip(item)) {
      const playerItem = player.equipment[item.type];
      const text = playerItem.score > item.score ? 'weak' : 'strong';

      player.$statistics.incrementStat('Character.Item.Discard');
      const message = `%player was offered %item by a wandering merchant, but it was too ${text} for %himher.`;
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.GOLD });
      return [player];
    }

    const sellScore = Math.abs(item.score) * SETTINGS.merchantMultiplier;
    const cost = Math.round((sellScore - (sellScore*player.liveStats.merchantCostReductionMultiplier)) * player._$priceReductionMultiplier());
    if(cost > player.gold) {
      player.$statistics.incrementStat('Character.Item.TooExpensive');
      const message = '%player was offered %item by a wandering merchant, but it costs too much gold for %himher.';
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.GOLD });
      return [player];
    }

    const id = Event.chance.guid();
    const message = `Would you like to buy «${item.fullname}» for ${cost.toLocaleString()} gold?`;
    const eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
    const extraData = { item, cost, eventText };

    const choices = ['Yes', 'No'];
    if(player.$pets.activePet) {
      choices.push('Pet');
    }

    player.addChoice({ id, message, extraData, event: 'Merchant', choices });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response === 'No') return;
    const choice = _.find(player.choices, { id });
    if((!_.includes(choice.choices, 'Pet') && response === 'Pet')) return Event.feedback(player, 'Invalid choice. Cheater.');

    if(player.gold < choice.extraData.cost) return Event.feedback(player, 'You do not have enough gold!');

    const item = new Equipment(choice.extraData.item);

    if(response === 'Yes') {
      player.equip(item);
      this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.GOLD });
    }

    if(response === 'Pet') {
      const pet = player.$pets.activePet;
      if(pet.inventoryFull()) return Event.feedback(player, 'Pet inventory full.');
      pet.addToInventory(item);
      const eventText = this._parseText('%player bought a fancy %item for %pet with %hisher %goldgold!', player, { item: item.fullname, gold: choice.extraData.cost });
      this.emitMessage({ affected: [player], eventText, category: MessageCategories.ITEM });
    }

    player.gainGold(-choice.extraData.cost, false);
    player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
  }
}

