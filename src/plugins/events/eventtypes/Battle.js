
import { Event } from '../../../core/base/event';

import { Battle as BattleClass } from '../../combat/battle';
import { Party as PartyClass } from '../../party/party';

import { MonsterGenerator } from '../../../shared/monster-generator';

import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 3;

// Create a battle
export class Battle extends Event {
  static operateOn(player) {
    if(player.level <= 5) return;

    if(!player.party) {
      const partyInstance = new PartyClass({ leader: player });
      partyInstance.isBattleParty = true;
    }

    const monsters = MonsterGenerator.generateMonsters(player.party);

    const monsterPartyInstance = new PartyClass({ leader: monsters[0] });

    if(monsters.length > 1) {
      for(let i = 1; i < monsters.length; i++) {
        monsterPartyInstance.playerJoin(monsters[i]);
      }
    }

    const parties = [player.party, monsterPartyInstance];

    const introText = this.eventText('battle', player, { _eventData: { parties } });

    const battle = new BattleClass({ introText, parties });
    this.emitMessage({ affected: player.party.players, eventText: introText, category: MessageCategories.COMBAT, extraData: { battleName: battle.name } });
    battle.startBattle();
  }
}

