"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
class GuildShop extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0,
            0, 44, 49, 44, 0,
            0, 49, 49, 49, 0,
            0, 44, 49, 44, 0,
            0, 0, 0, 0, 0
        ];
    }
}
GuildShop.size = 'md';
GuildShop.desc = 'This building lets you buy items from your guild hall!';
GuildShop.woodCost = (level) => level * 200;
GuildShop.clayCost = (level) => level * 125;
GuildShop.stoneCost = (level) => level * 250;
GuildShop.astraliumCost = (level) => level * 100;
GuildShop.goldCost = (level) => level * 500000;
exports.GuildShop = GuildShop;
