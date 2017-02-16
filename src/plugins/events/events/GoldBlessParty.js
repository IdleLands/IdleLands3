
import _ from 'lodash';
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = -1;

// Gain 10-1000 Gold
export class GoldBlessParty extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const goldMod = Math.floor(Event.chance.integer({ min: 10, max: 1000 }));
    const eventText = this.eventText('blessGoldParty', player, { gold: goldMod, partyName: player.party.name });

    _.each(player.party.players, member => {
      const totalGold = member.gainGold(goldMod, false);
      this.emitMessage({ affected: [member], eventText: `${eventText} [+${totalGold.toLocaleString()} gold]`, category: MessageCategories.GOLD });
      if(!member.$statistics) return;
      member.$statistics.batchIncrement(['Character.Events', 'Character.Event.GoldBlessParty']);
    });
  }
}