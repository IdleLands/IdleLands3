
import _ from 'lodash';

import { Event } from '../../../core/base/event';
import { GameState } from '../../../core/game-state';

import { Party as PartyClass } from '../../../plugins/party/party';

import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 500;

// Create a party
export class Party extends Event {
  static operateOn(player) {

    if(player.partyName) return;

    const validPlayers = _.reject(GameState.getInstance().getPlayers(), p => p.partyName || p === player || p.$personalities.isActive('Solo'));
    if(validPlayers.length < 3) return;

    const partyInstance = new PartyClass({ leader: player });

    const newPlayers = _.sampleSize(validPlayers, 3);

    player.$statistics.incrementStat('Character.Party.Create');

    _.each(newPlayers, p => {
      partyInstance.playerJoin(p);
    });

    const partyMemberString = _(newPlayers).map('name').join(', ');
    const eventText = this.eventText('party', player, { partyName: partyInstance.name, partyMembers: partyMemberString });

    this.emitMessage({ affected: partyInstance.players, eventText, category: MessageCategories.PARTY });
  }

}

