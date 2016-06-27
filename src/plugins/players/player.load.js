
import { Dependencies, default as constitute } from 'constitute';

import { Player } from './player';

import { PlayerDb } from './player.db';

import { Statistics } from '../statistics/statistics';
import { StatisticsDb } from '../statistics/statistics.db';

import { Logger } from '../../shared/logger';

@Dependencies(PlayerDb, StatisticsDb)
export class PlayerLoad {
  constructor(playerDb, statisticsDb) {
    this.PlayerDb = playerDb;
    this.StatisticsDb = statisticsDb;
  }

  async loadPlayer(playerName) {

    const playerObj = await this.PlayerDb.getPlayer({ name: playerName });
    try {
      const player = constitute(Player);
      player.init(playerObj);

      if(!player.statisticsLink) {
        const statisticsObj = constitute(Statistics);
        statisticsObj.init({ _id: player.name, stats: {} });
        const newStatistics = await this.StatisticsDb.saveStatistics(statisticsObj);
        player.statisticsLink = newStatistics._id;
        player.$statistics = statisticsObj;
      } else {
        player.$statistics = await this.StatisticsDb.getStatistics(player.name);
      }

      player.isOnline = true;

      return player;
    } catch(e) {
      Logger.error('PlayerLoad:loadPlayer', e);
      throw(e);
    }
  }
}