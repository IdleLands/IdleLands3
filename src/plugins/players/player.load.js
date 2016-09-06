
import { Dependencies } from 'constitute';

import { Player } from './player';

import { PlayerDb } from './player.db';

import { Statistics } from '../statistics/statistics';
import { StatisticsDb } from '../statistics/statistics.db';

import { Achievements } from '../achievements/achievements';
import { AchievementsDb } from '../achievements/achievements.db';

import { Personalities } from '../personalities/personalities';
import { PersonalitiesDb } from '../personalities/personalities.db';

import { Collectibles } from '../collectibles/collectibles';
import { CollectiblesDb } from '../collectibles/collectibles.db';

import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

@Dependencies(PlayerDb, StatisticsDb, AchievementsDb, PersonalitiesDb, CollectiblesDb)
export class PlayerLoad {
  constructor(playerDb, statisticsDb, achievementsDb, personalitiesDb, collectiblesDb) {
    this.playerDb = playerDb;
    this.statisticsDb = statisticsDb;
    this.achievementsDb = achievementsDb;
    this.personalitiesDb = personalitiesDb;
    this.collectiblesDb = collectiblesDb;
  }

  async loadStatistics(player) {
    return new Promise(async resolve => {
      if(!player.statisticsLink) {
        const statisticsObj = constitute(Statistics);
        statisticsObj.init({ _id: player.name, stats: {} });
        await this.statisticsDb.saveStatistics(statisticsObj);
        player.statisticsLink = player.name;
        player.$statistics = statisticsObj;
      } else {
        player.$statistics = await this.statisticsDb.getStatistics(player.name);
      }
      resolve();
    });
  }

  async loadAchievements(player) {
    return new Promise(async resolve => {
      if(!player.achievementsLink) {
        const achievementsObj = constitute(Achievements);
        achievementsObj.init({ _id: player.name, achievements: {} });
        await this.achievementsDb.saveAchievements(achievementsObj);
        player.achievementsLink = player.name;
        player.$achievements = achievementsObj;
      } else {
        player.$achievements = await this.achievementsDb.getAchievements(player.name);
      }
      resolve();
    });
  }

  async loadPersonalities(player) {
    return new Promise(async resolve => {
      if(!player.personalitiesLink) {
        const personalitiesObj = constitute(Personalities);
        personalitiesObj.init({ _id: player.name, activePersonalities: {}, earnedPersonalities: [] });
        await this.personalitiesDb.savePersonalities(personalitiesObj);
        player.personalitiesLink = player.name;
        player.$personalities = personalitiesObj;
      } else {
        player.$personalities = await this.personalitiesDb.getPersonalities(player.name);
      }
      resolve();
    });
  }

  async loadCollectibles(player) {
    return new Promise(async resolve => {
      if(!player.collectiblesLink) {
        const collectiblesObj = constitute(Collectibles);
        collectiblesObj.init({ _id: player.name, collectibles: {} });
        await this.collectiblesDb.saveCollectibles(collectiblesObj);
        player.collectiblesLink = player.name;
        player.$collectibles = collectiblesObj;
      } else {
        player.$collectibles = await this.collectiblesDb.getCollectibles(player.name);
      }
      resolve();
    });
  }

  async loadPlayer(playerId) {

    const playerObj = await this.playerDb.getPlayer({ _id: playerId });

    try {
      const player = constitute(Player);
      player.init(playerObj);

      await Promise.all([
        this.loadStatistics(player),
        this.loadAchievements(player),
        this.loadPersonalities(player),
        this.loadCollectibles(player)
      ]);

      player.$personalities.checkPersonalities(player);

      player.isOnline = true;
      player.recalculateStats();

      return player;
    } catch(e) {
      Logger.error('PlayerLoad:loadPlayer', e);
      throw(e);
    }
  }
}