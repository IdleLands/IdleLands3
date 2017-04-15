
import { SETTINGS } from '../../../static/settings';

import { GuildBuilding, Size } from '../guild-building';

export class GardenSmall extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'This garden buffs you with rare boosts!';

  static woodCost =       (level) => level * 100000;
  static clayCost =       (level) => level * 100000;
  static stoneCost =      (level) => level * 100000;
  static astraliumCost =  (level) => level * 500000;
  static goldCost =       (level) => level * 100000000;

  static properties = [
    { name: 'StatBoost1', type: 'select', values: ['prone', 'poison', 'venom', 'shatter', 'vampire'] }
  ];

  static baseTile = SETTINGS.revGidMap.Grass;

  tiles = [
    0,  0,  0,
    0,  37, 0,
    0,  0,  0
  ]
}

export class GardenMedium extends GuildBuilding {
  static size: Size = 'md';
  static desc = 'This garden buffs your basic stats!';

  static woodCost =       (level) => level * 10000;
  static clayCost =       (level) => level * 10000;
  static stoneCost =      (level) => level * 10000;
  static astraliumCost =  (level) => level * 50000;
  static goldCost =       (level) => level * 5000000;

  static properties = [
    { name: 'StatBoost1', type: 'select', values: ['str', 'con', 'dex', 'agi', 'int', 'luk'] },
    { name: 'StatBoost2', type: 'select', values: ['gold', 'xp', 'itemFindRangeMultiplier'] }
  ];

  static baseTile = SETTINGS.revGidMap.Grass;

  tiles = [
    0,  0,  0,  0,  0,
    0,  16, 16, 83, 0,
    0,  55, 16, 55, 0,
    0,  16, 55, 16, 0,
    0,  0,  0,  0,  0
  ]
}

export class GardenLarge extends GuildBuilding {
  static size: Size = 'lg';
  static desc = 'This garden buffs your combat stats!';

  static woodCost =       (level) => level * 25000;
  static clayCost =       (level) => level * 25000;
  static stoneCost =      (level) => level * 25000;
  static astraliumCost =  (level) => level * 100000;
  static goldCost =       (level) => level * 2500000;

  static properties = [
    { name: 'StatBoost1', type: 'select', values: ['aegis', 'dance', 'deadeye', 'lethal', 'power', 'silver'] },
    { name: 'StatBoost2', type: 'select', values: ['crit', 'offense', 'defense', 'glowing'] },
    { name: 'StatBoost3', type: 'select', values: ['hp', 'hpregen', 'mp', 'mpregen', 'damageReduction', 'salvage'] }
  ];

  static baseTile = SETTINGS.revGidMap.Grass;

  tiles = [
    0,  0,  0,  0,  0,  0,  0,
    0,  16, 83, 83, 56, 0,  0,
    0,  0,  0,  55, 0,  16, 0,
    0,  0,  16, 0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,
    0,  55, 83, 37, 0,  46, 0,
    0,  0,  0,  0,  0,  0,  0
  ]
}