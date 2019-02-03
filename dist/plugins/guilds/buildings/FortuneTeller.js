"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_building_1 = require("../guild-building");
class FortuneTeller extends guild_building_1.GuildBuilding {
    init() {
        const mascotName = this.getProperty('Name');
        const f = {
            name: `${mascotName} the Fortune Teller` || 'Fortune Teller',
            gid: 23,
            type: 'Guild NPC',
            properties: {
                forceEvent: 'Providence',
                isGuild: true
            }
        };
        this.tiles = [
            0, 0, 0,
            0, f, 0,
            0, 0, 0
        ];
    }
}
FortuneTeller.size = 'sm';
FortuneTeller.desc = 'This crystal ball user can give you better providences!';
FortuneTeller.astraliumCost = (level) => level * 1000;
FortuneTeller.goldCost = (level) => level * 1000000;
FortuneTeller.properties = [
    { name: 'Name', type: 'text' }
];
exports.FortuneTeller = FortuneTeller;
