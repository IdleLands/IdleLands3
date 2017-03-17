
import * as _ from 'lodash';

import { Event } from '../event';
import { FindItem } from './FindItem';

import { ItemGenerator } from '../../../shared/item-generator';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = -1;

// Find treasure
export class FindTreasure extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, { treasureName }) {
    const eventText = this._parseText('%player came across the worldly treasure of %treasure!', player, { treasure: treasureName });
    this.emitMessage({ affected: [player], eventText, category: MessageCategories.EXPLORE });

    player.$statistics.incrementStat(`Character.Treasure.${treasureName}`);
    _.each(ItemGenerator.getAllTreasure(treasureName, player), item => {
      if(!player.canEquip(item)) return;
      FindItem.operateOn(player, null, item);
    });
  }
}

