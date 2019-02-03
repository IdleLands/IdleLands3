"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../../static/settings");
const guild_building_1 = require("../guild-building");
class GardenSmall extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0,
            0, 37, 0,
            0, 0, 0
        ];
    }
}
GardenSmall.size = 'sm';
GardenSmall.desc = 'This garden buffs you with rare boosts!';
GardenSmall.woodCost = (level) => level * 100000;
GardenSmall.clayCost = (level) => level * 100000;
GardenSmall.stoneCost = (level) => level * 100000;
GardenSmall.astraliumCost = (level) => level * 500000;
GardenSmall.goldCost = (level) => level * 100000000;
GardenSmall.properties = [
    { name: 'StatBoost1', type: 'select', values: ['prone', 'poison', 'venom', 'shatter', 'vampire'] }
];
GardenSmall.baseTile = settings_1.SETTINGS.revGidMap.Grass;
exports.GardenSmall = GardenSmall;
class GardenMedium extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0,
            0, 16, 16, 83, 0,
            0, 55, 16, 55, 0,
            0, 16, 55, 16, 0,
            0, 0, 0, 0, 0
        ];
    }
}
GardenMedium.size = 'md';
GardenMedium.desc = 'This garden buffs your basic stats!';
GardenMedium.woodCost = (level) => level * 10000;
GardenMedium.clayCost = (level) => level * 10000;
GardenMedium.stoneCost = (level) => level * 10000;
GardenMedium.astraliumCost = (level) => level * 50000;
GardenMedium.goldCost = (level) => level * 5000000;
GardenMedium.properties = [
    { name: 'StatBoost1', type: 'select', values: ['str', 'con', 'dex', 'agi', 'int', 'luk'] },
    { name: 'StatBoost2', type: 'select', values: ['gold', 'xp', 'itemFindRangeMultiplier', 'salvage'] }
];
GardenMedium.baseTile = settings_1.SETTINGS.revGidMap.Grass;
exports.GardenMedium = GardenMedium;
class GardenLarge extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0, 0, 0,
            0, 16, 83, 83, 56, 0, 0,
            0, 0, 0, 55, 0, 16, 0,
            0, 0, 16, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 55, 83, 37, 0, 46, 0,
            0, 0, 0, 0, 0, 0, 0
        ];
    }
}
GardenLarge.size = 'lg';
GardenLarge.desc = 'This garden buffs your combat stats!';
GardenLarge.woodCost = (level) => level * 25000;
GardenLarge.clayCost = (level) => level * 25000;
GardenLarge.stoneCost = (level) => level * 25000;
GardenLarge.astraliumCost = (level) => level * 100000;
GardenLarge.goldCost = (level) => level * 2500000;
GardenLarge.properties = [
    { name: 'StatBoost1', type: 'select', values: ['aegis', 'dance', 'deadeye', 'lethal', 'power', 'silver'] },
    { name: 'StatBoost2', type: 'select', values: ['crit', 'offense', 'defense', 'glowing'] },
    { name: 'StatBoost3', type: 'select', values: ['hp', 'hpregen', 'mp', 'mpregen', 'damageReduction'] }
];
GardenLarge.baseTile = settings_1.SETTINGS.revGidMap.Grass;
exports.GardenLarge = GardenLarge;
