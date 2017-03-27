
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class Raburro extends GuildBase {

  constructor(guildName) {
    super('Raburro', guildName);
  }

  static moveInCost = 1000000;

  costs = {
    moveIn: 1000000,
    build: {
      sm: 50000,
      md: 250000,
      lg: 100000
    }
  };

  baseTile = SETTINGS.revGidMap.Gravel;
  startLoc = [9, 13];

  buildings = {
    sm: [
      { startCoords: [2, 2], signpostLoc: [5, 2],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [2, 7], signpostLoc: [5, 7],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [2, 12], signpostLoc: [5, 12],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [2, 17], signpostLoc: [5, 17],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [8, 2], signpostLoc: [7, 4],
        tiles: [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ] }
    ],
    lg: [
      { startCoords: [6, 23], signpostLoc: [5, 27],
        tiles: [
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0
        ] },
      { startCoords: [6, 32], signpostLoc: [5, 34],
        tiles: [
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0
        ] }
    ]
  }
}