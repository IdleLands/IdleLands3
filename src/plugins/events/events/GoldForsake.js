
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 10;

// Lose 25-2000 Gold
export class GoldForsake extends Event {
  static operateOn(player) {
    const goldMod = Math.min(player.gold, Math.floor(Event.chance.integer({ min: 25, max: 2000 })));
    const eventText = this.eventText('forsakeGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${goldMod} gold]`, category: MessageCategories.GOLD });
    player.gainGold(-goldMod);

    return [player];
  }
}