
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

import { GoldBlessParty } from './GoldBlessParty';

export const WEIGHT = 216;

// Gain 10-1000 Gold
export class GoldBless extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    if(player.party && Event.chance.bool({ likelihood: 70 })) {
      GoldBlessParty.operateOn(player);
      return player.party.members;
    }

    const maxGoldGained = Math.max(1000, Math.round(player.gold * 0.02));
    const baseGold = Math.floor(Event.chance.integer({ min: 10, max: maxGoldGained }));
    const goldMod = player.gainGold(baseGold);
    const eventText = this.eventText('blessGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${goldMod.toLocaleString()} gold]`, category: MessageCategories.GOLD });

    return [player];
  }
}