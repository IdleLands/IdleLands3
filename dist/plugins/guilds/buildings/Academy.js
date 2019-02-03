"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
const f = {
    name: 'Instructor',
    gid: 13,
    type: 'Guild NPC',
    properties: {}
};
class Academy extends guild_building_1.GuildBuilding {
    constructor() {
        super(...arguments);
        this.tiles = [
            0, 0, 0, 0, 0,
            0, f, 0, 44, 0,
            0, 0, 0, 0, 0,
            0, 44, 0, 44, 0,
            0, 0, 0, 0, 0
        ];
    }
}
Academy.size = 'md';
Academy.desc = 'This building controls the size of your guild roster!';
Academy.woodCost = (level) => level * 50;
Academy.clayCost = (level) => level * 25;
Academy.stoneCost = (level) => level * 50;
Academy.astraliumCost = (level) => level * 10;
Academy.goldCost = (level) => level * 100000;
exports.Academy = Academy;
