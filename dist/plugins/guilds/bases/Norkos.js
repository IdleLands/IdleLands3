"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_base_1 = require("../guild-base");
const settings_1 = require("../../../static/settings");
class Norkos extends guild_base_1.GuildBase {
    constructor(guildName) {
        super('Norkos', guildName);
        this.costs = {
            moveIn: 2500000,
            build: {
                sm: 500000,
                md: 1000000,
                lg: 2500000
            }
        };
        this.baseTile = settings_1.SETTINGS.revGidMap.Tile;
        this.startLoc = [12, 13];
        this.buildings = {
            sm: [
                { startCoords: [15, 11], signpostLoc: [18, 12],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] }
            ],
            md: [
                { startCoords: [9, 23], signpostLoc: [12, 22],
                    tiles: [
                        3, 3, 0, 3, 3,
                        3, 0, 0, 0, 3,
                        3, 0, 0, 0, 3,
                        3, 0, 0, 0, 3,
                        3, 3, 3, 3, 3
                    ] },
                { startCoords: [18, 23], signpostLoc: [19, 22],
                    tiles: [
                        3, 3, 0, 3, 3,
                        3, 0, 0, 0, 3,
                        3, 0, 0, 0, 3,
                        3, 0, 0, 0, 3,
                        3, 3, 3, 3, 3
                    ] }
            ],
            lg: [
                { startCoords: [23, 0], signpostLoc: [25, 7],
                    tiles: [
                        0, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 3, 3, 0, 3, 3, 0
                    ] },
                { startCoords: [2, 9], signpostLoc: [9, 13],
                    tiles: [
                        3, 3, 3, 3, 3, 3, 3,
                        3, 0, 0, 0, 0, 0, 3,
                        3, 0, 0, 0, 0, 0, 3,
                        3, 0, 0, 0, 0, 0, 0,
                        3, 0, 0, 0, 0, 0, 3,
                        3, 0, 0, 0, 0, 0, 3,
                        3, 3, 3, 3, 3, 3, 3
                    ] }
            ]
        };
    }
}
Norkos.moveInCost = 2500000;
exports.Norkos = Norkos;
