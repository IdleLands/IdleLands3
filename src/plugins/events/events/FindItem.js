
import _ from 'lodash';
import { Event } from '../event';

import { Equipment } from '../../../core/base/equipment';
import { ItemGenerator } from '../../../shared/item-generator';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 70;

// Get given the opportunity to change items
export class FindItem extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, forceItem) {

    let item = forceItem;

    if(!forceItem) {
      item = ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk));

      const playerItem = player.equipment[item.type];
      const text = playerItem.score > item.score ? 'weak' : 'strong';

      if(!player.canEquip(item)) {
        const message = `%player came across %item, but it was too ${text} for %himher, so %she sold it for %gold gold.`;
        const gold = player.sellItem(item);
        const parsedMessage = this._parseText(message, player, { gold, item: item.fullname });
        this.emitMessage({ affected: [player], eventText: parsedMessage, category: MessageCategories.ITEM });
        return;
      }
    }

    const id = Event.chance.guid();
    const message = `Would you like to equip «${item.fullname}»?`;
    const eventText = this.eventText('findItem', player, { item: item.fullname });
    const extraData = { item, eventText };

    player.addChoice({ id, message, extraData, event: 'FindItem', choices: ['Yes', 'No'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    player.equip(new Equipment(choice.extraData.item));
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.ITEM });
  }
}

