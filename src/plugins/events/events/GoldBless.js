
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

import { GoldBlessParty } from './GoldBlessParty';

export const WEIGHT = 216;

// Gain 10-1000 Gold
export class GoldBless extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, useDiminishingReturns = false) {
    if(player.party && Event.chance.bool({ likelihood: 70 })) {
      GoldBlessParty.operateOn(player);
      return player.party.members;
    }

    let value = Event.chance.integer({ min: 10, max: Math.max(11, 350 * player.level) });
    if(Event.chance.bool({ likelihood: 1 })) {
      const maxGoldGained = Math.max(1000, Math.round(player.gold * 0.02));
      const baseGold = Math.floor(Event.chance.integer({ min: 10, max: maxGoldGained }));
      value = baseGold;
    }

    let goldMod = value; 

    let diminishingReturnsMultiplier;
    if(useDiminishingReturns) {
      if(player.forceEvent.steps > 400) diminishingReturnsMultiplier = 0.05;
      else if(player.forceEvent.steps > 300) diminishingReturnsMultiplier = 0.1;
      else if(player.forceEvent.steps > 200) diminishingReturnsMultiplier = 0.25;
      else if(player.forceEvent.steps > 100) diminishingReturnsMultiplier = 0.5;
    }
    if (diminishingReturnsMultiplier) goldMod = Math.round(goldMod * diminishingReturnsMultiplier);

    goldMod = player.gainGold(goldMod); // gainGold modifies goldMod. Use result to get accurate event text.
    const eventText = this.eventText('blessGold', player, { gold: goldMod });
    const diminishingReturnsText = diminishingReturnsMultiplier ? ' (-' + ((1 - diminishingReturnsMultiplier) * 100) + '%)' : '';

    this.emitMessage({ affected: [player], eventText: `${eventText} [+${goldMod.toLocaleString()}${diminishingReturnsText} gold]`, category: MessageCategories.GOLD });

    return [player];
  }
}
