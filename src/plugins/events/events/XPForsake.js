
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 36;

// Lose 3-5% XP
export class XPForsake extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, forceMessage) {
    const percent = Event.chance.floating({ fixed: 5, min: 0.03, max: 0.05 });
    const baseXP = Math.floor(player._xp.maximum * percent);
    const xpModCheck = player._calcModXp(-baseXP);

    const xpMod = Math.max(baseXP, xpModCheck);
    player.gainXp(-xpMod, false);

    const eventText = forceMessage ? this._parseText(forceMessage, player, { xp: Math.abs(xpMod) }) : this.eventText('forsakeXp', player, { xp: Math.abs(xpMod) });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${Math.abs(xpMod).toLocaleString()} xp, ~${(percent*100).toFixed(2)}%]`, category: MessageCategories.XP });
	
    return [player];
  }
}
