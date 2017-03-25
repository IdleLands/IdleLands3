
import { GuildBuilding, Size } from '../guild-building';


export class GuildHall extends GuildBuilding {
  static size: Size = 'lg';
  static desc = 'This building allows you to upgrade your other buildings more!';

  static woodCost =       (level) => level * 20;
  static clayCost =       (level) => level * 30;
  static stoneCost =      (level) => level * 15;
  static astraliumCost =  (level) => level * 20;
  static goldCost =       (level) => level * 50000;

  tiles = [
    0,  0,  0,  0,  0,  0,  0,
    0,  49, 49, 49, 49, 49, 0,
    0,  49, 49, 49, 49, 49, 0,
    0,  49, 49, 49, 49, 49, 0,
    0,  49, 49, 49, 49, 49, 0,
    0,  49, 49, 49, 49, 49, 0,
    0,  0,  0,  0,  0,  0,  0
  ]
}