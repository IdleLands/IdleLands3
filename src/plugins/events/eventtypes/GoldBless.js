
import { Event } from '../../../core/base/event';

export const WEIGHT = 75;

// Gain 10-1000 Gold
export class GoldBless extends Event {
  static operateOn(player) {
    const goldMod = Math.floor(Event.chance.integer({ min: 10, max: 1000 }));
    const eventText = this.eventText('blessGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${goldMod}gold]` });
    player.gold += goldMod;
  }
}