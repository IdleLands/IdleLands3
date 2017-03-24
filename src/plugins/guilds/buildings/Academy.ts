
import { GuildBuilding, Size } from '../guild-building';

const f = {
  name: 'Instructor',
  gid: 13,
  type: 'Guild NPC',
  properties: {}
};

export class Academy extends GuildBuilding {
  static size: Size = 'md';
  static desc = 'Upgrade this building to make your roster size go up!';

  tiles = [
    0,  0,  0,  0,  0,
    0,  f,  0, 44,  0,
    0,  0,  0,  0,  0,
    0,  44, 0, 44,  0,
    0,  0,  0,  0,  0
  ]
}