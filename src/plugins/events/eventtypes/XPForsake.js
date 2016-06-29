
import { Event } from '../../../core/base/event';

export const WEIGHT = 25;

// Lose 5-15% XP
export class XPForsake extends Event {
  static operateOn(player) {
    const xpMod = Math.floor(Event.chance.integer({ min: player._xp.maximum * 0.05, max: player._xp.maximum * 0.15 }));
    const eventText = this.eventText('forsakeXp', player, { xp: xpMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${xpMod}xp]` });
    player._xp.sub(xpMod);
  }
}