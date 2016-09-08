
import _ from 'lodash';

import { Event } from '../event';
import { GameState } from '../../../core/game-state';

import { Battle as BattleClass } from '../../combat/battle';
import { Party as PartyClass } from '../../party/party';

import { MessageCategories } from '../../../shared/adventure-log';
import { Logger } from '../../../shared/logger';
import { SETTINGS } from '../../../static/settings';

export const WEIGHT = 4;

// Create a pvp battle
export class BattlePvP extends Event {
  static operateOn(player) {
    if(player.level <= SETTINGS.minBattleLevel) return;
    if(player.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 })) return;

    const allPlayers = _.reject(GameState.getInstance().getPlayers(), p => p.$battle);
    let opponent = null;

    // 1v1
    if(!player.party || player.party.players.length === 1) {
      const partyInstance = new PartyClass({ leader: player });
      partyInstance.isBattleParty = true;

      opponent = _(allPlayers)
        .reject(p => p.party)
        .reject(p => p.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 }))
        .reject(p => p.level < player.level - SETTINGS.pvpBattleRange || p.level > player.level + SETTINGS.pvpBattleRange)
        .sample();
      if(!opponent) return;

      const opponentParty = new PartyClass({ leader: opponent });
      opponentParty.isBattleParty = true;

    // XvX
    } else {
      opponent = _(allPlayers)
        .reject(p => p.level < player.level - SETTINGS.pvpBattleRange || p.level > player.level + SETTINGS.pvpBattleRange)
        .reject(p => p.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 }))
        .reject(p => !p.party || p.party === player.party || p.party.players.length === 1)
        .sample();
      if(!opponent) return;

    }

    const parties = [player.party, opponent.party];
    const players = _.flatten(_.map(parties, party => party.players));

    const introText = this.eventText('battle', player, { _eventData: { parties } });

    const battle = new BattleClass({ introText, parties });
    this.emitMessage({ affected: players, eventText: introText, category: MessageCategories.COMBAT, extraData: { battleName: battle._id } });

    try {
      battle.startBattle();
    } catch(e) {
      Logger.error('Battle:PvP', e, battle.saveObject());
    }

    if(player.party.isBattleParty) {
      player.party.disband();
    }

    if(opponent.party.isBattleParty) {
      opponent.party.disband();
    }
  }
}

