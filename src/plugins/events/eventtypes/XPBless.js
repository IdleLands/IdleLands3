
import { Event } from '../../../core/base/event';

export const WEIGHT = 100;

// Gain 1-10% XP
export class XPBless extends Event {
  static operateOn(player) {
    const xpMod = Math.floor(Event.chance.integer({ min: player._xp.maximum * 0.01, max: player._xp.maximum * 0.1 }));
    const eventText = this.eventText('blessXp', player, { xp: xpMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${xpMod}xp]` });
    player._xp.add(xpMod);
  }
}