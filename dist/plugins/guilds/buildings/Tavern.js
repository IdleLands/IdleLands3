"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
const f = {
    name: 'Barkeep',
    gid: 13,
    type: 'Guild NPC',
    properties: {}
};
class Tavern extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0, 0, 0,
            0, 44, 39, 0, 45, 47, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 44, 44, 0, 44, 0, 0,
            0, 46, f, 0, 0, 46, 0,
            0, 0, 0, 0, 0, 0, 0
        ];
    }
}
Tavern.size = 'lg';
Tavern.desc = 'Get drunk with your guildmates!';
Tavern.woodCost = (level) => level * 500;
Tavern.clayCost = (level) => level * 250;
Tavern.stoneCost = (level) => level * 1500;
Tavern.astraliumCost = (level) => level * 2500;
Tavern.goldCost = (level) => level * 350000;
exports.Tavern = Tavern;
