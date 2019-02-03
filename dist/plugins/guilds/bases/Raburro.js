"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_base_1 = require("../guild-base");
const settings_1 = require("../../../static/settings");
class Raburro extends guild_base_1.GuildBase {
    constructor(guildName) {
        super('Raburro', guildName);
        this.costs = {
            moveIn: 1000000,
            build: {
                sm: 50000,
                md: 250000,
                lg: 100000
            }
        };
        this.baseTile = settings_1.SETTINGS.revGidMap.Gravel;
        this.startLoc = [9, 13];
        this.buildings = {
            sm: [
                { startCoords: [2, 2], signpostLoc: [5, 2],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] },
                { startCoords: [2, 7], signpostLoc: [5, 7],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] },
                { startCoords: [2, 12], signpostLoc: [5, 12],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] },
                { startCoords: [2, 17], signpostLoc: [5, 17],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] }
            ],
            md: [
                { startCoords: [8, 2], signpostLoc: [7, 4],
                    tiles: [
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0
                    ] }
            ],
            lg: [
                { startCoords: [6, 23], signpostLoc: [5, 27],
                    tiles: [
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0
                    ] },
                { startCoords: [6, 32], signpostLoc: [5, 34],
                    tiles: [
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0
                    ] }
            ]
        };
    }
}
Raburro.moveInCost = 1000000;
exports.Raburro = Raburro;
