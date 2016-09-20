
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

import { GoldBlessParty } from './GoldBlessParty';

export const WEIGHT = 45;

// Gain 10-1000 Gold
export class GoldBless extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    if(player.party && Event.chance.bool({ likelihood: 70 })) {
      GoldBlessParty.operateOn(player);
      return player.party.members;
    }

    const goldMod = Math.floor(Event.chance.integer({ min: 10, max: 1000 }));
    const eventText = this.eventText('blessGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${goldMod} gold]`, category: MessageCategories.GOLD });
    player.gainGold(goldMod);

    return [player];
  }
}