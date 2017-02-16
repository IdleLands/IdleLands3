
import _ from 'lodash';
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = -1;

// Gain 1-3% XP
export class XPBlessParty extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const member = _(player.party.players)
      .sortBy(['level'])
      .head();
    const percent = Event.chance.floating({ fixed: 5, min: 0.01, max: 0.03 });
    const xpMod = Math.floor(member._xp.maximum * percent);
    const eventText = this.eventText('blessXpParty', player, { xp: xpMod, partyName: player.party.name });

    _.each(player.party.players, member => {
      const totalXp = member.gainXp(xpMod, false);
      this.emitMessage({ affected: [member], eventText: `${eventText} [+${totalXp.toLocaleString()} xp, ~${(percent*100).toFixed(2)}%]`, category: MessageCategories.XP });
      if(!member.$statistics) return;
      member.$statistics.batchIncrement(['Character.Events', 'Character.Event.XPBlessParty']);
    });
  }
}