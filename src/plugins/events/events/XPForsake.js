
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 5;

// Lose 3-5% XP
export class XPForsake extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const percent = Event.chance.floating({ fixed: 5, min: 0.03, max: 0.05 });
    const xpMod = Math.floor(player._xp.maximum * percent);
    const eventText = this.eventText('forsakeXp', player, { xp: xpMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${xpMod} xp, ~${(percent*100).toFixed(2)}%]`, category: MessageCategories.XP });
    player.gainXp(-xpMod);

    return [player];
  }
}