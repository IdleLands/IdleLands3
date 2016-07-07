
import { Dependencies } from 'constitute';

import { Player } from './player';

import { PlayerDb } from './player.db';

import { Statistics } from '../statistics/statistics';
import { StatisticsDb } from '../statistics/statistics.db';

import { Achievements } from '../achievements/achievements';
import { AchievementsDb } from '../achievements/achievements.db';

import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

@Dependencies(PlayerDb, StatisticsDb, AchievementsDb)
export class PlayerLoad {
  constructor(playerDb, statisticsDb, achievementsDb) {
    this.playerDb = playerDb;
    this.statisticsDb = statisticsDb;
    this.achievementsDb = achievementsDb;
  }

  async loadPlayer(playerName) {

    const playerObj = await this.playerDb.getPlayer({ name: playerName });
    try {
      const player = constitute(Player);
      player.init(playerObj);

      if(!player.statisticsLink) {
        const statisticsObj = constitute(Statistics);
        statisticsObj.init({ _id: player.name, stats: {} });
        await this.statisticsDb.saveStatistics(statisticsObj);
        player.statisticsLink = player.name;
        player.$statistics = statisticsObj;
      } else {
        player.$statistics = await this.statisticsDb.getStatistics(player.name);
      }

      if(!player.achievementsLink) {
        const achievementsObj = constitute(Achievements);
        achievementsObj.init({ _id: player.name, achievements: {} });
        await this.achievementsDb.saveAchievements(achievementsObj);
        player.achievementsLink = player.name;
        player.$achievements = achievementsObj;
      } else {
        player.$achievements = await this.achievementsDb.getAchievements(player.name);
      }

      player.isOnline = true;

      return player;
    } catch(e) {
      Logger.error('PlayerLoad:loadPlayer', e);
      throw(e);
    }
  }
}