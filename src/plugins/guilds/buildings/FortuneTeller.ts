
import { GuildBuilding, Size } from '../guild-building';

export class FortuneTeller extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'This crystal ball user can give you better providences!';

  static astraliumCost =  (level) => level * 5000;
  static goldCost =       (level) => level * 1000000;

  static properties = [
    { name: 'Name', type: 'text' }
  ];

  init() {
    const mascotName = this.getProperty('Name');

    const f = {
      name: `${mascotName} the Fortune Teller` || 'Fortune Teller',
      gid: 23,
      type: 'Guild NPC',
      properties: {
        forceEvent: 'providence',
        isGuild: true
      }
    };

    this.tiles = [
      0,  0,  0,
      0,  f,  0,
      0,  0,  0
    ];
  }
}