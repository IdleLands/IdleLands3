
import _ from 'lodash';
import { Event } from '../event';

import { MessageCategories } from '../../../shared/adventure-log';

import { Enchant } from './Enchant';

export const WEIGHT = -1;

// Get the opportunity to buy an item
export class MerchantEnchant extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {

    player.$statistics.batchIncrement(['Character.Events', 'Character.Event.MerchantEnchant']);

    const cost = Math.round(Event.chance.integer({ min: 100000, max: 500000 }) * player._$priceReductionMultiplier());
    if(cost > player.gold) {
      player.$statistics.incrementStat('Character.Enchant.TooExpensive');
      const message = '%player was offered an enchantment by a wandering merchant, but %she doesn\'t have enough gold.';
      const parsedMessage = this._parseText(message, player, { item: 'an enchantment' });
      this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.GOLD });
      return [player];
    }

    const id = Event.chance.guid();
    const message = `Would you like to buy an enchantment for ${cost} gold?`;
    const eventText = this.eventText('merchant', player, { item: 'an enchantment', shopGold: cost });
    const extraData = { cost, eventText };

    player.addChoice({ id, message, extraData, event: 'MerchantEnchant', choices: ['Yes', 'No'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    if(player.gold < choice.extraData.cost) return false;
    player.gainGold(-choice.extraData.cost, false);
    Enchant.operateOn(player);
    player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.GOLD });
  }

  static feedback(player) {
    Event.feedback(player, 'You do not have enough gold!');
  }
}

