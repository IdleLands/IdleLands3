
const isBattleDebug = process.env.BATTLE_DEBUG;

import _ from 'lodash';

import { Event } from '../event';
import { Battle as BattleClass } from '../../combat/battle';
import { Party as PartyClass } from '../../party/party';

import { MonsterGenerator } from '../../../shared/monster-generator';

import { MessageCategories } from '../../../shared/adventure-log';

import { Logger } from '../../../shared/logger';
import { SETTINGS } from '../../../static/settings';

export const WEIGHT = isBattleDebug ? 300 : 3;

// Create a battle
export class Battle extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    if(player.level <= SETTINGS.minBattleLevel) return;

    if(player.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 })) return;

    if(!player.party) {
      const partyInstance = new PartyClass({ leader: player });
      partyInstance.isBattleParty = true;
    }

    const monsters = MonsterGenerator.generateMonsters(player.party);

    const monsterPartyInstance = new PartyClass({ leader: monsters[0] });
    monsterPartyInstance.isMonsterParty = true;
    if(monsters.length > 1) {
      for(let i = 1; i < monsters.length; i++) {
        monsterPartyInstance.playerJoin(monsters[i]);
      }
    }

    const parties = [player.party, monsterPartyInstance];

    const introText = this.eventText('battle', player, { _eventData: { parties } });

    const battle = new BattleClass({ introText, parties });
    this.emitMessage({ affected: player.party.players, eventText: introText, category: MessageCategories.COMBAT, extraData: { battleName: battle._id } });

    try {
      battle.startBattle();
    } catch(e) {
      Logger.error('Battle', e, battle.saveObject());
    }

    _.each(player.party.players, player => player.recalculateStats());

    if(player.party.isBattleParty) {
      player.party.disband();
    }

    monsterPartyInstance.disband();

    return [player];
  }
}

