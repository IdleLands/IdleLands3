
import { Event } from '../../../core/base/event';

export const WEIGHT = 100;

// Gain 2-4% XP
export class XPBless extends Event {
  static operateOn(player) {
    const percent = Event.chance.floating({ fixed: 5, min: 0.02, max: 0.04 });
    const xpMod = Math.floor(player._xp.maximum * percent);
    const eventText = this.eventText('blessXp', player, { xp: xpMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${xpMod}xp, ~${(percent*100).toFixed(2)}%]` });
    player.gainXp(xpMod);
  }
}