
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 72;

// Lose 25-2000 Gold
export class GoldForsake extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const maxGoldLost = Math.max(2000, Math.round(player.gold * 0.03));
    const baseGold = Math.min(player.gold, Math.floor(Event.chance.integer({ min: 25, max: maxGoldLost })));
    const goldMod = Math.abs(player.gainGold(-baseGold));
    const eventText = this.eventText('forsakeGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${goldMod.toLocaleString()} gold]`, category: MessageCategories.GOLD });

    return [player];
  }
}