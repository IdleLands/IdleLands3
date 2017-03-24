
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class Homlet extends GuildBase {

  constructor(guildName) {
    super('Homlet', guildName);
  }

  static moveInCost = 1000000;

  costs = {
    moveIn: 1000000,
    build: {
      sm: 100000,
      md: 250000,
      lg: 500000
    }
  };

  baseTile = SETTINGS.revGidMap.Gravel;
  startLoc = [9, 13];

  buildings = {
    sm: [
      { startCoords: [2, 13], signpostLoc: [5, 13],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [20, 18], signpostLoc: [19, 18],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [2, 22], signpostLoc: [3, 21],
        tiles: [
          17, 17, 0, 17,  17,
          17, 0,  0,  0,  17,
          17, 0,  0,  0,  17,
          17, 0,  0,  0,  17,
          17, 17, 17, 17, 17
        ] },
      { startCoords: [10, 22], signpostLoc: [11, 21],
        tiles: [
          17, 17, 0, 17,  17,
          17, 0,  0,  0,  17,
          17, 0,  0,  0,  17,
          17, 0,  0,  0,  17,
          17, 17, 17, 17, 17
        ] }
    ],
    lg: [
      { startCoords: [0, 0], signpostLoc: [7, 2],
        tiles: [
          0,  0,  0,  0,  0,  0,  0,
          0,  0,  0,  0,  0,  0,  17,
          0,  0,  0,  0,  0,  0,  17,
          0,  0,  0,  0,  0,  0,  0,
          0,  0,  0,  0,  0,  0,  17,
          0,  0,  0,  0,  0,  0,  17,
          0,  17, 17, 17, 17, 17, 17
        ] },
      { startCoords: [10, 0], signpostLoc: [9, 2],
        tiles: [
          0,  0,  0,  0,  0,  0,  0,
          17, 0,  0,  0,  0,  0,  17,
          17, 0,  0,  0,  0,  0,  17,
          0,  0,  0,  0,  0,  0,  17,
          17, 0,  0,  0,  0,  0,  17,
          17, 0,  0,  0,  0,  0,  17,
          17, 17, 17, 17, 17, 17, 17
        ] }
    ]
  }
}