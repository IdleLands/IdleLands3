
import { GuildBuilding, Size } from '../guild-building';


export class GuildHall extends GuildBuilding {
  static size: Size = 'lg';
  static desc = 'Upgrade this building to make your other buildings more upgradeable!';

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