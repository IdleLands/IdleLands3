
import * as _ from 'lodash';

import { Event } from '../event';
import { Battle as BattleClass } from '../../combat/battle';
import { Party as PartyClass } from '../../party/party';

import { FindItem } from './FindItem';

import { MonsterGenerator } from '../../../shared/monster-generator';

import { MessageCategories } from '../../../shared/adventure-log';

import { emitter } from '../../players/_emitter';

import { Logger } from '../../../shared/logger';
import { SETTINGS } from '../../../static/settings';

export const WEIGHT = -1;

// Create a battle
export class BattleBoss extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, { bossName, bosses }) {
    if(player.level <= SETTINGS.minBattleLevel) return;
    if(player.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 })) return;

    if(!player.party) {
      const partyInstance = new PartyClass({ leader: player });
      partyInstance.isBattleParty = true;
    }

    const monsterPartyInstance = new PartyClass({ leader: bosses[0] });
    monsterPartyInstance.isMonsterParty = true;
    if(bosses.length > 1) {
      for(let i = 1; i < bosses.length; i++) {
        monsterPartyInstance.playerJoin(bosses[i]);
      }
    }

    const parties = [player.party, monsterPartyInstance];

    const introText = `${player.party.displayName} is gearing up for an epic boss battle against ${monsterPartyInstance.displayName}!`;

    const battle = new BattleClass({ introText, parties });
    this.emitMessage({ affected: player.party.players, eventText: introText, category: MessageCategories.COMBAT, extraData: { battleName: battle._id } });

    try {
      battle.startBattle();
    } catch(e) {
      Logger.error('BattleBoss', e, battle.saveObject());
    }

    if(!battle.isLoser(player.party) && !battle._isTie) {
      _.each(player.party.players, p => {
        if(!p.$statistics) return;
    
        _.each(bosses, boss => {
          p.$statistics.incrementStat(`Character.BossKills.${boss._name}`);
        });
      });

      MonsterGenerator._setBossTimer(bossName);

      const dropItems = _.compact(_.flattenDeep(_.map(bosses, boss => {
        return _.map(_.values(boss.equipment), item => {
          if(!item.dropPercent) return null;
          if(!Event.chance.bool({ likelihood: item.dropPercent })) return null;
          return item;
        });
      })));

      const dropCollectibles = _.compact(_.flattenDeep(_.map(bosses, boss => {
        return _.map(boss._collectibles, coll => {
          if(!coll.dropPercent) return null;
          if(!Event.chance.bool({ likelihood: coll.dropPercent })) return null;
          return coll;
        });
      })));

      if(dropItems.length > 0) {
        _.each(dropItems, item => {
          _.each(player.party.players, p => {
            if(!p.canEquip(item)) return;
            FindItem.operateOn(p, null, item);
          });
        });
      }

      if(dropCollectibles.length > 0) {
        _.each(dropCollectibles, coll => {

          const collectibleObj = {
            name: coll.name,
            map: 'Boss',
            region: bossName,
            rarity: coll.rarity || 'guardian',
            description: coll.flavorText,
            storyline: coll.storyline,
            foundAt: Date.now()
          };

          _.each(player.party.players, p => {
            if(p.$collectibles.hasCollectible(collectibleObj.name)) return;
            p.$collectibles.addCollectible(collectibleObj);
            emitter.emit('player:collectible', { player: p, collectible: collectibleObj });
          });
        });
      }
    }
    
    if(!player.party) return [];

    const affected = player.party.players;

    _.each(affected, player => player.recalculateStats());

    if(player.party.isBattleParty) {
      player.party.disband();
    }

    monsterPartyInstance.disband();

    return affected;
  }
}

