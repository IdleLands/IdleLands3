
import * as _ from 'lodash';

import { Guild } from './guild';

export type Size = 'sm' | 'md' | 'lg';

export class GuildBuilding {
  static size: Size = 'sm';
  static desc: string;

  static properties: Array<{ name: string, type: string, values?: string[] }> = [];

  static woodCost = (level) => 0;
  static clayCost = (level) => 0;
  static stoneCost = (level) => 0;
  static astraliumCost = (level) => 0;
  static goldCost = (level) => 0;

  static levelupCost(level) {
    return {
      wood: this.woodCost(level),
      clay: this.clayCost(level),
      stone: this.stoneCost(level),
      astralium: this.astraliumCost(level),
      gold: this.goldCost(level)
    };
  };

  tiles: any[] = [];
  $guild: Guild;

  _propertyName(name: string) {
    return `${this.constructor.name}-${name}`;
  }

  getProperty(name: string) {
    return _.get(this.$guild.buildings.properties, this._propertyName(name), null);
  }

  setProperty(name: string, value) {
    _.set(this.$guild.buildings.properties, this._propertyName(name), value);
  }

  constructor(guild) {
    this.$guild = guild;
    this.init();
  }

  init() {}
}