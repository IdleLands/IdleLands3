
import _ from 'lodash';

import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

import { SPECIAL_STATS_BASE, ATTACK_STATS_BASE } from '../../../shared/stat-calculator';

export const WEIGHT = 2;

// Enchant an item (+special stat, +50 to random stat, +1 enchantLevel)
export class Enchant extends Event {
  static operateOn(player) {
    const item = this.pickValidItemForEnchant(player);
    if(!item) return;

    let eventText = this.eventText('enchant', player, { item: item.fullname });

    item.enchantLevel = item.enchantLevel || 0;
    item.enchantLevel++;

    if(Event.chance.bool({ likelihood: 75 })) {
      const stat = this.pickStat(item);
      const boost = 50;

      eventText = `${eventText} [${stat} ${item[stat]} -> ${item[stat]+boost}]`;

      item[stat] += boost;

    } else {
      const { enchantMax, name } = _.sample(SPECIAL_STATS_BASE.concat(ATTACK_STATS_BASE));
      item[name] = item[name] || 0;

      eventText = `${eventText} [${name} ${item[name]} -> ${item[name]+enchantMax}]`;

      item[name] += enchantMax;
    }

    this.emitMessage({ affected: [player], eventText, category: MessageCategories.ITEM });
    item.score;
    player.recalculateStats();
    player.$updateEquipment = true;
  }
}