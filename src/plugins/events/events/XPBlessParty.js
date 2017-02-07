
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

    this.emitMessage({ affected: player.party.players, eventText: `${eventText} [+${xpMod.toLocaleString()} xp, ~${(percent*100).toFixed(2)}%|${member.name}]`, category: MessageCategories.XP });

    _.each(player.party.players, member => {
      member.gainXp(xpMod, false);
      if(!member.$statistics) return;
      member.$statistics.batchIncrement(['Character.Events', 'Character.Event.XPBlessParty']);
    });
  }
}