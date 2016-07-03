
import { Event } from '../../../core/base/event';

export const WEIGHT = 10;

// Lose 25-2500 Gold
export class GoldForsake extends Event {
  static operateOn(player) {
    const goldMod = Math.max(player.gold, Math.floor(Event.chance.integer({ min: 25, max: 2000 })));
    const eventText = this.eventText('forsakeGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${goldMod}gold]` });
    player.gainGold(-goldMod);
  }
}