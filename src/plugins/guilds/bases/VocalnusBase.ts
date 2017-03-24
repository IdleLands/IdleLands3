
import { GuildBase } from '../guild-base';

import { SETTINGS } from '../../../static/settings';

export class VocalnusBase extends GuildBase {

  constructor(guildName) {
    super('Vocalnus', guildName);
  }

  costs = {
    moveIn: 50000,
    build: {
      sm: 15000,
      md: 35000,
      lg: 75000
    }
  };

  baseTile = SETTINGS.revGidMap.Tile;
  startLoc = [16, 7];

  buildings = {
    sm: [
      { startCoords: [22, 28], signpostLoc: [21, 8],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] },
      { startCoords: [18, 20], signpostLoc: [17, 22],
        tiles: [
          0, 0, 0,
          0, 0, 0,
          0, 0, 0
        ] }
    ],
    md: [
      { startCoords: [6, 21], signpostLoc: [11, 24],
        tiles: [
          50, 0,  50, 50, 50,
          50, 0,  0,  0,  50,
          50, 0,  0,  0,  0,
          0,  0,  0,  0,  50,
          50, 0,  50, 50, 50
        ] }
    ],
    lg: [
      { startCoords: [6, 6], signpostLoc: [13, 8],
        tiles: [
          50, 50, 50, 0,  50, 50, 50,
          50, 0,  0,  0,  0,  0,  0,
          0,  0,  0,  0,  0,  0,  50,
          50, 0,  0,  0,  0,  0,  0,
          50, 0,  0,  0,  0,  0,  0,
          50, 0,  0,  0,  0,  0,  50,
          0,  50, 50, 50, 0,  50, 50
        ] }
    ]
  }
}