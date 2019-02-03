"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
class Teleport extends guild_building_1.GuildBuilding {
    init() {
        let teleLoc = this.getProperty('TeleportLocation');
        if (!teleLoc)
            teleLoc = 'norkos';
        const f = {
            name: 'Guild Teleport',
            gid: 30,
            type: 'Teleport',
            properties: {
                toLoc: teleLoc,
                movementType: 'teleport'
            }
        };
        this.tiles = [
            0, 0, 0,
            0, f, 0,
            0, 0, 0
        ];
    }
}
Teleport.size = 'sm';
Teleport.desc = 'This teleport can go places!';
Teleport.woodCost = (level) => level * 10;
Teleport.clayCost = (level) => level * 10;
Teleport.stoneCost = (level) => level * 10;
Teleport.astraliumCost = (level) => level * 50;
Teleport.goldCost = (level) => level * 1000;
Teleport.properties = [
    { name: 'TeleportLocation', type: 'select', values: ['norkos', 'frigri', 'maeles', 'vocalnus'] }
];
exports.Teleport = Teleport;
