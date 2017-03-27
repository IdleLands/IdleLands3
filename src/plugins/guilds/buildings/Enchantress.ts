
import { GuildBuilding, Size } from '../guild-building';

export class Enchantress extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'This magic user is capable of wicked enchantments!';

  static astraliumCost =  (level) => level * 500;
  static goldCost =       (level) => level * 500000;

  static properties = [
    { name: 'Name', type: 'text' },
    { name: 'AttemptUnsafeEnchant', type: 'select', values: ['Yes', 'No'] }
  ];

  init() {
    const mascotName = this.getProperty('Name');

    const f = {
      name: `${mascotName} the Enchantress` || 'Enchantress',
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