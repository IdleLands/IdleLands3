
import { GuildBuilding, Size } from '../guild-building';

export class GuildShop extends GuildBuilding {
  static size: Size = 'md';
  static desc = 'This building lets you buy items from your guild hall!';

  static woodCost =       (level) => level * 200;
  static clayCost =       (level) => level * 125;
  static stoneCost =      (level) => level * 250;
  static astraliumCost =  (level) => level * 100;
  static goldCost =       (level) => level * 500000;

  tiles = [
    0,  0,  0,  0,  0,
    0,  44, 49, 44, 0,
    0,  49, 49, 49, 0,
    0,  44, 49, 44, 0,
    0,  0,  0,  0,  0
  ]
}