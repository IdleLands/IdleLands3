
import { GuildBuilding, Size } from '../guild-building';

export class Enchantress extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'Upgrade this magic user to get better enchanting capabilities!';

  static properties = [
    { name: 'Name', type: 'text' },
    { name: 'AttemptEnchant', type: 'select', values: ['Yes', 'No'] }
  ];

  init() {
    const mascotName = this.getProperty('Name');

    const f = {
      name: mascotName || 'Enchantress',
      gid: 21,
      type: 'Guild NPC',
      properties: {
        forceEvent: 'enchant',
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