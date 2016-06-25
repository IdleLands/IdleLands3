
import { Player } from './player';

import { getPlayer } from './player.db';

import { Statistics } from '../statistics/statistics';
import { getStatistics, saveStatistics } from '../statistics/statistics.db';

export const loadPlayer = async (playerName) => {

  const playerObj = await getPlayer({ name: playerName });
  const player = new Player(playerObj);

  if(!player.statisticsLink) {
    const statisticsObj = new Statistics({ _id: player.name, stats: {} });
    const newStatistics = await saveStatistics(statisticsObj);
    player.statisticsLink = newStatistics._id;
    player.$statistics = statisticsObj;
  } else {
    player.$statistics = await getStatistics(player.name);
  }

  return player;
};