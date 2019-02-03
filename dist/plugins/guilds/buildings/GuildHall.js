"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
class GuildHall extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0, 0, 0,
            0, 49, 49, 49, 49, 49, 0,
            0, 49, 49, 49, 49, 49, 0,
            0, 49, 49, 49, 49, 49, 0,
            0, 49, 49, 49, 49, 49, 0,
            0, 49, 49, 49, 49, 49, 0,
            0, 0, 0, 0, 0, 0, 0
        ];
    }
}
GuildHall.size = 'lg';
GuildHall.desc = 'This building allows you to upgrade your other buildings more!';
GuildHall.woodCost = (level) => level * 20;
GuildHall.clayCost = (level) => level * 30;
GuildHall.stoneCost = (level) => level * 15;
GuildHall.astraliumCost = (level) => level * 20;
GuildHall.goldCost = (level) => level * 50000;
exports.GuildHall = GuildHall;
