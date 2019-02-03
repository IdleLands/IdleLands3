"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_base_1 = require("../guild-base");
const settings_1 = require("../../../static/settings");
class Homlet extends guild_base_1.GuildBase {
    constructor(guildName) {
        super('Homlet', guildName);
        this.costs = {
            moveIn: 1000000,
            build: {
                sm: 100000,
                md: 250000,
                lg: 500000
            }
        };
        this.baseTile = settings_1.SETTINGS.revGidMap.Gravel;
        this.startLoc = [9, 13];
        this.buildings = {
            sm: [
                { startCoords: [2, 13], signpostLoc: [5, 13],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] },
                { startCoords: [20, 18], signpostLoc: [19, 18],
                    tiles: [
                        0, 0, 0,
                        0, 0, 0,
                        0, 0, 0
                    ] }
            ],
            md: [
                { startCoords: [2, 22], signpostLoc: [3, 21],
                    tiles: [
                        17, 17, 0, 17, 17,
                        17, 0, 0, 0, 17,
                        17, 0, 0, 0, 17,
                        17, 0, 0, 0, 17,
                        17, 17, 17, 17, 17
                    ] },
                { startCoords: [10, 22], signpostLoc: [11, 21],
                    tiles: [
                        17, 17, 0, 17, 17,
                        17, 0, 0, 0, 17,
                        17, 0, 0, 0, 17,
                        17, 0, 0, 0, 17,
                        17, 17, 17, 17, 17
                    ] }
            ],
            lg: [
                { startCoords: [0, 0], signpostLoc: [7, 2],
                    tiles: [
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 17,
                        0, 0, 0, 0, 0, 0, 17,
                        0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 17,
                        0, 0, 0, 0, 0, 0, 17,
                        0, 17, 17, 17, 17, 17, 17
                    ] },
                { startCoords: [10, 0], signpostLoc: [9, 2],
                    tiles: [
                        0, 0, 0, 0, 0, 0, 0,
                        17, 0, 0, 0, 0, 0, 17,
                        17, 0, 0, 0, 0, 0, 17,
                        0, 0, 0, 0, 0, 0, 17,
                        17, 0, 0, 0, 0, 0, 17,
                        17, 0, 0, 0, 0, 0, 17,
                        17, 17, 17, 17, 17, 17, 17
                    ] }
            ]
        };
    }
}
Homlet.moveInCost = 1000000;
exports.Homlet = Homlet;
