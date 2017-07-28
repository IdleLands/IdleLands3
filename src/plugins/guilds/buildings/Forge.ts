
import { GuildBuilding, Size } from '../guild-building';

const f = {
  name: 'Smith',
  gid: 13,
  type: 'Guild NPC',
  properties: {}
};

export class Forge extends GuildBuilding {
  static size: Size = 'lg';
  static desc = 'This forge lets you craft items using your resources!';

  static woodCost =       (level) => level * 2000;
  static clayCost =       (level) => level * 2000;
  static stoneCost =      (level) => level * 2000;
  static astraliumCost =  (level) => level * 5000;
  static goldCost =       (level) => level * 50000;

  tiles = [
    0,  0,  0,  0,  0,  0,  0,
    0,  41, 40, 0,  41, 24, 0,
    0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,
    0,  41, 41, 0,  40, 0,  0,
    0,  40, f,  0,  0,  40, 0,
    0,  0,  0,  0,  0,  0,  0
  ]
}
