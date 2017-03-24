
import * as _ from 'lodash';

import { Map } from '../../core/world/map';

import { SETTINGS } from '../../static/settings';

export class GuildBase extends Map {

  constructor(name, guildName) {
    super(`${__dirname}/../../../assets/maps/guildhall-maps/${name}.json`, `${guildName} Guild Base`);
    this.path = `guilds/${guildName}`;
  }

  dimensions: { sm: 3, md: 5, lg: 7 };

  baseTile = SETTINGS.revGidMap.Tile;
  startLoc = [10, 10];

  costs = {
    moveIn: 0,
    build: {
      sm: 0,
      md: 0,
      lg: 0
    }
  };

  $instances = {
    sm: [],
    md: [],
    lg: []
  };

  buildings = {
    sm: [],
    md: [],
    lg: []
  };

  buildBuilding(building, size, slot, instance) {
    const { startCoords, signpostLoc, tiles } = this.buildings[size][slot];

    const tileIndexes = [];
    const tileCoords = [];

    const dimensions = this.dimensions[size];
    const mapWidth = this.map.width;
  }

  buildTransmitObject() {
    return _.omit(this, key => _.includes(key, '$'));
  }
}
