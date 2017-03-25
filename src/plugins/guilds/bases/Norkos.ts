
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class Norkos extends GuildBase {

  constructor(guildName) {
    super('Norkos', guildName);
  }

  static moveInCost = 2500000;

  costs = {
    moveIn: 2500000,
    build: {
      sm: 500000,
      md: 1000000,
      lg: 2500000
    }
  };

  baseTile = SETTINGS.revGidMap.Tile;
  startLoc = [12, 13];

  buildings = {
    sm: [
      { startCoords: [15, 11], signpostLoc: [18, 12],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [9, 23], signpostLoc: [12, 22],
        tiles: [
          3, 3, 0, 3, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 3, 3, 3, 3
        ] },
      { startCoords: [18, 23], signpostLoc: [19, 22],
        tiles: [
          3, 3, 0, 3, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 0, 0, 0, 3,
          3, 3, 3, 3, 3
        ] }
    ],
    lg: [
      { startCoords: [23, 0], signpostLoc: [25, 7],
        tiles: [
          0, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 3, 3, 0, 3, 3, 0
        ] },
      { startCoords: [2, 9], signpostLoc: [9, 13],
        tiles: [
          3, 3, 3, 3, 3, 3, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 3,
          3, 0, 0, 0, 0, 0, 3,
          3, 3, 3, 3, 3, 3, 3
        ] }
    ]
  }
}