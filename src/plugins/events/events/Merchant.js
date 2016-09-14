
import _ from 'lodash';
import { Event } from '../event';

import { Equipment } from '../../../core/base/equipment';
import { ItemGenerator } from '../../../shared/item-generator';
import { MessageCategories } from '../../../shared/adventure-log';

import { SETTINGS } from '../../../static/settings';

export const WEIGHT = 15;

// Get the opportunity to buy an item
export class Merchant extends Event {
  static operateOn(player) {

    const item = ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk + player.liveStats.merchantItemGeneratorBonus));
    if(!player.canEquip(item)) {
      const playerItem = player.equipment[item.type];
      const text = playerItem.score > item.score ? 'weak' : 'strong';

      player.$statistics.incrementStat('Character.Item.Discard');
      const message = `%player was offered %item by a wandering merchant, but it was too ${text} for %himher.`;
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.GOLD });
      return [player];
    }

    const sellScore = item.score * SETTINGS.merchantMultiplier;
    const cost = sellScore - (sellScore*player.liveStats.merchantCostReductionMultiplier);
    if(cost > player.gold) {
      player.$statistics.incrementStat('Character.Item.TooExpensive');
      const message = '%player was offered %item by a wandering merchant, but %she doesn\'t have enough gold.';
      const parsedMessage = this._parseText(message, player, { item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.GOLD });
      return [player];
    }

    const id = Event.chance.guid();
    const message = `Would you like to buy «${item.fullname}» for ${cost} gold?`;
    const eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
    const extraData = { item, cost, eventText };

    player.addChoice({ id, message, extraData, event: 'Merchant', choices: ['Yes', 'No'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    if(player.gold < choice.extraData.cost) return false;
    player.equip(new Equipment(choice.extraData.item));
    player.gainGold(-choice.extraData.cost);
    player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.GOLD });
  }

  static feedback(player) {
    Event.feedback(player, 'You do not have enough gold!');
  }
}

