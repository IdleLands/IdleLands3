
import _ from 'lodash';
import { GameState } from '../../core/game-state';

import { ProfessionChange } from '../events/events/ProfessionChange';
import { BattleBoss } from '../events/events/BattleBoss';
import { FindTreasure } from '../events/events/FindTreasure';
import * as Events from '../events/events/_all';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';
import { emitter } from './_emitter';

import { MonsterGenerator } from '../../shared/monster-generator';

import Chance from 'chance';
const chance = new Chance(Math.random);

const directions = [1, 2, 3, 6, 9, 8, 7, 4];

export class PlayerMovement {

  static num2dir(dir, x, y) {
    switch(dir) {
      case 1:  return { x: x - 1, y: y - 1 };
      case 2:  return { x: x, y: y - 1 };
      case 3:  return { x: x + 1, y: y - 1 };
      case 4:  return { x: x - 1, y: y };
      case 6:  return { x: x + 1, y: y };
      case 7:  return { x: x - 1, y: y + 1 };
      case 8:  return { x: x, y: y + 1 };
      case 9:  return { x: x + 1, y: y + 1 };

      default: return { x: x, y: y };
    }
  }

  static canEnterTile(player, tile) {
    const properties = _.get(tile, 'object.properties');
    if(properties) {
      if(properties.requireMap)         return player.$statistics.getStat(`Character.Maps.${properties.requireMap}`) > 0;
      if(properties.requireRegion)      return player.$statistics.getStat(`Character.Regions.${properties.requireRegion}`) > 0;
      if(properties.requireBoss)        return player.$statistics.getStat(`Character.BossKills.${properties.requireBoss}`) > 0;
      if(properties.requireClass)       return player.professionName === properties.requireClass;
      if(properties.requireAchievement) return player.$achievements.hasAchievement(properties.requireAchievement);
      if(properties.requireCollectible) return player.$collectibles.hasCollectible(properties.requireCollectible);
      if(properties.requireAscension)   return player.ascensionLevel > properties.requireAscension;
      if(properties.requireHoliday) {
        const { start, end } = SETTINGS.holidays[properties.requireHoliday];
        const today = new Date();
        return today.getMonth() >= start.getMonth()
            && today.getDate()  >= start.getDate()
            && today.getMonth() <= end.getMonth()
            && today.getDate()  <= end.getDate();
      }
    }
    return !tile.blocked && tile.terrain !== 'Void';
  }

  // TODO https://github.com/IdleLands/IdleLandsOld/blob/master/src/character/player/Player.coffee#L347
  static handleTile(player, tile) {
    const type = _.get(tile, 'object.type');

    const forceEvent = _.get(tile, 'object.properties.forceEvent', '');
    if(forceEvent) {
      if(!Events[forceEvent]) {
        Logger.error('PlayerMovement', `forceEvent ${forceEvent} does not exist at ${player.x}, ${player.y} in ${player.map}`);
        return;
      }
      Events[forceEvent].operateOn(player, tile.object.properties);
    }

    if(!type || !this[`handleTile${type}`]) return;
    this[`handleTile${type}`](player, tile);
  }

  static handleTileTreasure(player, tile) {
    FindTreasure.operateOn(player, { treasureName: tile.object.name });
  }

  static handleTileBoss(player, tile) {
    const boss = MonsterGenerator.generateBoss(tile.object.name, player);
    if(!boss) return;
    BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: boss });
  }

  static handleTileBossParty(player, tile) {
    const bossparty = MonsterGenerator.generateBossParty(tile.object.name, player);
    if(!bossparty) return;
    BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: bossparty });
  }

  static handleTileTrainer(player, tile) {
    if(player.stepCooldown > 0) return;
    player.stepCooldown = 10;

    const professionName = tile.object.name;
    const trainerName = tile.object.properties.realName ?
      `${tile.object.properties.realName}, the ${professionName} trainer` :
      `the ${professionName} trainer`;
    ProfessionChange.operateOn(player, { professionName, trainerName });
  }

  static handleTileTeleport(player, tile, force = false) {

    const dest = tile.object.properties;
    dest.x = +dest.destx;
    dest.y = +dest.desty;

    if(dest.movementType === 'ascend' && player.$personalities.isActive('Delver')) return;
    if(dest.movementType === 'descend' && player.$personalities.isActive('ScaredOfTheDark')) return;

    if(!force && (dest.movementType === 'ascend' || dest.movementType === 'descend')) {
      if(player.stepCooldown > 0) return;
      player.stepCooldown = 10;
    }

    if(!dest.map && !dest.toLoc) {
      Logger.error('PlayerMovement', new Error(`No dest.map at ${player.x}, ${player.y} in ${player.map}`));
      return;
    }

    if(!dest.movementType) {
      Logger.error('PlayerMovement', new Error(`No dest.movementType at ${player.x}, ${player.y} in ${player.map}`));
      return;
    }

    if(!dest.fromName) dest.fromName = player.map;
    if(!dest.destName) dest.destName = dest.map;

    if(dest.toLoc) {
      const toLocData = SETTINGS.locToTeleport(dest.toLoc);
      dest.x = toLocData.x;
      dest.y = toLocData.y;
      dest.map = toLocData.map;
      dest.destName = toLocData.formalName;
    }

    player.map = dest.map;
    player.x = dest.x;
    player.y = dest.y;

    player.oldRegion = player.mapRegion;
    player.mapRegion = tile.region;

    player.$statistics.incrementStat(`Character.Movement.${_.capitalize(dest.movementType)}`);

    emitter.emit('player:transfer', { player, dest });
  }

  static handleTileCollectible(player, tile) {

    const collectible = tile.object;
    const collectibleName = collectible.name;
    const collectibleRarity = _.get(collectible, 'properties.rarity', 'basic');

    if(player.$collectibles.hasCollectible(collectibleName)) return;

    const collectibleObj = {
      name: collectibleName,
      map: player.map,
      region: player.mapRegion,
      rarity: collectibleRarity,
      description: collectible.properties.flavorText,
      storyline: collectible.properties.storyline,
      foundAt: Date.now()
    };

    player.$collectibles.addCollectible(collectibleObj);

    emitter.emit('player:collectible', { player, collectible: collectibleObj });
  }

  static getTileAt(map, x, y) {
    let mapInstance = GameState.getInstance().world.maps[map];
    if(!mapInstance) {
      mapInstance = GameState.getInstance().world.maps.Norkos;
      x = 10;
      y = 10;
    }
    return mapInstance.getTile(x, y);
  }

  static pickFollowTile(player, target) {
    return [0, { x: target.x, y: target.y }, target.lastDir];
  }

  static pickRandomTile(player, weight, overrideFollow = false) {
    if(!player.stepCooldown) player.stepCooldown = 0;

    if(player.party && !overrideFollow) {
      const party = player.party;
      const follow = party.getFollowTarget(player);

      if(follow && follow.map === player.map) {
        return this.pickFollowTile(player, follow);
      }
    }

    const indexes = [0, 1, 2, 3, 4, 5, 6, 7];

    const randomIndex = chance.weighted(indexes, weight);
    const dir = directions[randomIndex];

    return [randomIndex, this.num2dir(dir, player.x, player.y), dir];
  }

  static getInitialWeight(player) {
  
    let weight = [300, 40, 7,  3,  1,  3,  7,  40];
    
    const MAX_DRUNK = 10;
    const drunkFromPersonality = player.$personalities.isActive('Drunk') ? 7 : 0;
    const drunk = Math.max(0, Math.min(MAX_DRUNK, drunkFromPersonality));

    if(player.lastDir && !drunk) {
      const lastDirIndex = directions.indexOf(player.lastDir);
      weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
    } else if(drunk) {
      weight = [1, 1, 1, 1, 1, 1, 1, 1];
    }

    return weight;

  }

}
