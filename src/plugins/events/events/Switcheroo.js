
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 1;

// Switcheroo an item (flip any stat between positive and negative)
export class Switcheroo extends Event {
  static operateOn(player) {
    const item = this.pickValidItem(player);
    const stat = this.pickStat(item);

    const eventText = this.eventText('flipStat', player, { item: item.fullname });

    this.emitMessage({ affected: [player], eventText: `${eventText} [${stat} ${item[stat]} -> ${-item[stat]}]`, category: MessageCategories.ITEM });
    item[stat] = -item[stat];
    item.score;
    player.recalculateStats();
    player.$updateEquipment = true;
  }
}