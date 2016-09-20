
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 25;

// Forsake an item (random stat -5%)
export class ItemForsake extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const item = this.pickValidItem(player);
    if(!item) return;

    const stat = this.pickStat(item);
    if(!stat) return;

    const boost = item[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item[stat]/20)));

    const eventText = this.eventText('forsakeItem', player, { item: item.fullname });

    this.emitMessage({ affected: [player], eventText: `${eventText} [${stat} ${item[stat]} -> ${item[stat]-boost}]`, category: MessageCategories.ITEM });
    item[stat] -= boost;
    item.score;
    player.recalculateStats();
    player.$updateEquipment = true;

    return [player];
  }
}