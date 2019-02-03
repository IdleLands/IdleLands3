"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_base_1 = require("../guild-base");
const settings_1 = require("../../../static/settings");
class Vocalnus extends guild_base_1.GuildBase {
    constructor(guildName) {
        super('Vocalnus', guildName);
        this.costs = {
            moveIn: 50000,
            build: {
                sm: 15000,
                md: 35000,
                lg: 75000
            }
        };
        this.baseTile = settings_1.SETTINGS.revGidMap.Tile;
        this.startLoc = [16, 7];
        this.buildings = {
            sm: [
                { startCoords: [22, 28], signpostLoc: [21, 8],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] },
                { startCoords: [18, 20], signpostLoc: [17, 22],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] }
            ],
            md: [
                { startCoords: [6, 21], signpostLoc: [11, 24],
                    tiles: [
                        50, 0, 50, 50, 50,
                        50, 0, 0, 0, 50,
                        50, 0, 0, 0, 0,
                        0, 0, 0, 0, 50,
                        50, 0, 50, 50, 50
                    ] }
            ],
            lg: [
                { startCoords: [6, 6], signpostLoc: [13, 8],
                    tiles: [
                        50, 50, 50, 0, 50, 50, 50,
                        50, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 50,
                        50, 0, 0, 0, 0, 0, 0,
                        50, 0, 0, 0, 0, 0, 0,
                        50, 0, 0, 0, 0, 0, 50,
                        0, 50, 50, 50, 0, 50, 50
                    ] }
            ]
        };
    }
}
Vocalnus.moveInCost = 50000;
exports.Vocalnus = Vocalnus;
