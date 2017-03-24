
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class Maeles extends GuildBase {

  constructor(guildName) {
    super('Maeles', guildName);
  }

  static moveInCost = 5000000;

  costs = {
    moveIn: 5000000,
    build: {
      sm: 300000,
      md: 450000,
      lg: 700000
    }
  };

  baseTile = SETTINGS.revGidMap.Tile;
  startLoc = [10, 16];

  buildings = {
    sm: [
      { startCoords: [30, 11], signpostLoc: [29, 11],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [30, 16], signpostLoc: [29, 16],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [30, 21], signpostLoc: [29, 21],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [5, 3], signpostLoc: [6, 8],
        tiles: [
          3, 3, 3, 3, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 3, 0, 3, 3
        ] },
      { startCoords: [5, 27], signpostLoc: [6, 26],
        tiles: [
          3, 3, 0, 3, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 3, 3, 3, 3
        ] }
    ],
    lg: [
      { startCoords: [14, 2], signpostLoc: [16, 9],
        tiles: [
          3, 3, 3, 3, 3, 3, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 3, 3, 0, 3, 3, 3
        ] },
      { startCoords: [18, 14], signpostLoc: [17, 17],
        tiles: [
          3, 3, 3, 0, 3, 3, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 3, 3, 0, 3, 3, 3
        ] },
      { startCoords: [14, 26], signpostLoc: [16, 25],
        tiles: [
          3, 3, 3, 0, 3, 3, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 3, 3, 3, 3, 3, 3
        ] }
    ]
  }
}