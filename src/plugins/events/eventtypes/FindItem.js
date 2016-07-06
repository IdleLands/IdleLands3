
import _ from 'lodash';
import { Event } from '../../../core/base/event';

import { Equipment } from '../../../core/base/equipment';
import { ItemGenerator } from '../../../shared/item-generator';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 25;

// Get given the opportunity to change classes
export class FindItem extends Event {
  static operateOn(player) {

    const item = ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk));
    if(!player.canEquip(item)) {
      const message = '%player came across %item, but it was useless to %himher, so %she sold it for %gold gold.';
      const gold = player.sellItem(item);
      const parsedMessage = this._parseText(message, player, { gold, item: item.fullname });
      this.emitMessage({ affected: [player], eventText: parsedMessage });
      return;
    }

    const id = Event.chance.guid();
    const message = `Would you like to equip «${item.fullname}»?`;
    const eventText = this.eventText('findItem', player, { item: item.fullname });
    const extraData = { item, eventText };

    player.addChoice({ id, message, extraData, event: 'FindItem', choices: ['Yes', 'No'] });
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    player.equip(new Equipment(choice.extraData.item));
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.ITEM });
  }
}

