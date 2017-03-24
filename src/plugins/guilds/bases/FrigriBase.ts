
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class FrigriBase extends GuildBase {

  constructor(guildName) {
    super('Frigri', guildName);
  }

  costs = {
    moveIn: 15000000,
    build: {
      sm: 1000000,
      md: 2500000,
      lg: 7500000
    }
  };

  baseTile = SETTINGS.revGidMap.Tile;
  startLoc = [1, 11];

  buildings = {
    sm: [
      { startCoords: [6, 6], signpostLoc: [5, 5],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [26, 26], signpostLoc: [29, 29],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [15, 5], signpostLoc: [20, 4],
        tiles: [
          3, 0, 0, 3, 3,
          0, 0, 0, 0, 3,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          3, 0, 0, 0, 3
        ] },
      { startCoords: [5, 15], signpostLoc: [4, 20],
        tiles: [
          3, 0, 0, 0, 3,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          3, 0, 0, 0, 0,
          3, 3, 0, 0, 3
        ] },
      { startCoords: [25, 15], signpostLoc: [24, 14],
        tiles: [
          3, 3, 0, 0, 3,
          3, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          3, 0, 0, 0, 3
        ] },
      { startCoords: [15, 25], signpostLoc: [20, 30],
        tiles: [
          3, 0, 0, 0, 3,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 3,
          3, 0, 0, 3, 3
        ] }
    ],
    lg: [
      { startCoords: [24, 4], signpostLoc: [23, 3],
        tiles: [
          3, 0, 0, 0, 0, 3, 3,
          0, 0, 0, 0, 0, 0, 3,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 3, 0, 0, 0, 0, 3
        ] },
      { startCoords: [14, 14], signpostLoc: [21, 13],
        tiles: [
          3, 3, 0, 0, 0, 3, 3,
          3, 0, 0, 0, 0, 0, 3,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 3,
          3, 3, 0, 0, 0, 3, 3
        ] },
      { startCoords: [4, 24], signpostLoc: [3, 23],
        tiles: [
          3, 0, 0, 0, 0, 3, 3,
          0, 0, 0, 0, 0, 0, 3,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 3, 0, 0, 0, 0, 3
        ] }
    ]
  }
}