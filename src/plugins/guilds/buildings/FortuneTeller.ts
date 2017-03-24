
import { GuildBuilding, Size } from '../guild-building';

export class FortuneTeller extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'Upgrade this crystal ball user to get better providences!';

  static properties = [
    { name: 'Name', type: 'text' }
  ];

  init() {
    const mascotName = this.getProperty('Name');

    const f = {
      name: mascotName || 'Fortune Teller',
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