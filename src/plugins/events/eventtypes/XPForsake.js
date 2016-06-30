
import { Event } from '../../../core/base/event';

export const WEIGHT = 75;

// Lose 3-5% XP
export class XPForsake extends Event {
  static operateOn(player) {
    const xpMod = Math.floor(Event.chance.integer({ min: player._xp.maximum * 0.03, max: player._xp.maximum * 0.05 }));
    const eventText = this.eventText('forsakeXp', player, { xp: xpMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${xpMod}xp]` });
    player._xp.sub(xpMod);
  }
}