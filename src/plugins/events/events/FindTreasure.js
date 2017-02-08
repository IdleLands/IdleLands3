
import _ from 'lodash';

import { Event } from '../event';
import { FindItem } from './FindItem';

import { ItemGenerator } from '../../../shared/item-generator';

export const WEIGHT = -1;

// Find treasure
export class FindTreasure extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, { treasureName }) {
    player.$statistics.incrementStat(`Character.Treasure.${treasureName}`);
    _.each(ItemGenerator.getAllTreasure(treasureName, player), item => {
      if(!player.canEquip(item)) return;
      FindItem.operateOn(player, null, item);
    });
  }
}

