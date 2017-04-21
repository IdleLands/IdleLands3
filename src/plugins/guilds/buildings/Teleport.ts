
import { GuildBuilding, Size } from '../guild-building';

export class Teleport extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'This teleport can go places!';

  static woodCost =       (level) => level * 10;
  static clayCost =       (level) => level * 10;
  static stoneCost =      (level) => level * 10;
  static astraliumCost =  (level) => level * 50;
  static goldCost =       (level) => level * 1000;

  static properties = [
    { name: 'TeleportLocation', type: 'select', values: ['norkos', 'frigri', 'maeles', 'vocalnus'] }
  ];

  init() {
    let teleLoc = this.getProperty('TeleportLocation');

    if(!teleLoc) teleLoc = 'norkos';

    const f = {
      name: `Guild Teleport`,
      gid: 30,
      type: 'Teleport',
      properties: {
        toLoc: teleLoc,
        movementType: 'teleport'
      }
    };

    this.tiles = [
      0,  0,  0,
      0,  f,  0,
      0,  0,  0
    ];
  }
}