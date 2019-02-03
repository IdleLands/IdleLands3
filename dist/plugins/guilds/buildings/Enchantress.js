"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
class Enchantress extends guild_building_1.GuildBuilding {
    init() {
        const mascotName = this.getProperty('Name');
        const f = {
            name: `${mascotName} the Enchantress` || 'Enchantress',
            gid: 21,
            type: 'Guild NPC',
            properties: {
                forceEvent: 'Enchant',
                isGuild: true
            }
        };
        this.tiles = [
            0, 0, 0,
            0, f, 0,
            0, 0, 0
        ];
    }
}
Enchantress.size = 'sm';
Enchantress.desc = 'This magic user is capable of wicked enchantments!';
Enchantress.astraliumCost = (level) => level * 500;
Enchantress.goldCost = (level) => level * 500000;
Enchantress.properties = [
    { name: 'Name', type: 'text' },
    { name: 'AttemptUnsafeEnchant', type: 'select', values: ['Yes', 'No'] }
];
exports.Enchantress = Enchantress;
