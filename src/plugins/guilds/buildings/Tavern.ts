
import { GuildBuilding, Size } from '../guild-building';

const f = {
  name: 'Barkeep',
  gid: 13,
  type: 'Guild NPC',
  properties: {}
};

export class Tavern extends GuildBuilding {
  static size: Size = 'lg';
  static desc = 'Get drunk with your guildmates!';

  tiles = [
    0,  0,  0,  0,  0,  0,  0,
    0,  44, 39, 0,  45, 47, 0,
    0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,
    0,  44, 44, 0,  44, 0,  0,
    0,  46, f,  0,  0,  46, 0,
    0,  0,  0,  0,  0,  0,  0
  ]
}