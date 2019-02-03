"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const guild_building_1 = require("../guild-building");
const settings_1 = require("../../../static/settings");
class Mascot extends guild_building_1.GuildBuilding {
    init() {
        const mascotId = +settings_1.SETTINGS.revGidMap[this.getProperty('MascotID')];
        const mascotQuote = this.getProperty('Quote');
        const mascotName = this.getProperty('Name');
        const f = {
            name: mascotName || 'Mascot',
            gid: _.isNaN(mascotId) ? 26 : mascotId,
            type: 'Guild NPC',
            properties: {
                flavorText: mascotQuote
            }
        };
        this.tiles = [
            0, 0, 0,
            0, f, 0,
            0, 0, 0
        ];
    }
}
Mascot.size = 'sm';
Mascot.desc = 'This guy is purely for bragging rights!';
Mascot.properties = [
    { name: 'Name', type: 'text' },
    { name: 'Quote', type: 'text' },
    { name: 'MascotID', type: 'select', values: _.keys(settings_1.SETTINGS.revGidMap) }
];
Mascot.woodCost = (level) => level * 100;
Mascot.clayCost = (level) => level * 100;
Mascot.stoneCost = (level) => level * 100;
Mascot.astraliumCost = (level) => level * 100;
Mascot.goldCost = (level) => level * 1000000;
exports.Mascot = Mascot;
