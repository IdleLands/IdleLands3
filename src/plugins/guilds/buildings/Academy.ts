
import { GuildBuilding, Size } from '../guild-building';

const f = {
  name: 'Instructor',
  gid: 13,
  type: 'Guild NPC',
  properties: {}
};

export class Academy extends GuildBuilding {
  static size: Size = 'md';
  static desc = 'This building controls the size of your guild roster!';

  static woodCost =       (level) => level * 50;
  static clayCost =       (level) => level * 25;
  static stoneCost =      (level) => level * 50;
  static astraliumCost =  (level) => level * 10;
  static goldCost =       (level) => level * 100000;

  tiles = [
    0,  0,  0,  0,  0,
    0,  f,  0, 44,  0,
    0,  0,  0,  0,  0,
    0,  44, 0, 44,  0,
    0,  0,  0,  0,  0
  ]
}