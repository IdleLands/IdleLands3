"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Mapceptional extends achievement_1.Achievement {
    static achievementData(player) {
        const allMaps = player.$statistics.getStat('Character.Maps');
        const validMaps = [
            { name: 'Norkos Secret -1', rewards: { con: 20 } },
            { name: 'Dark Tower +1', rewards: { con: 25 } },
            { name: 'Hall of Heroes', rewards: { con: 100 } },
            { name: 'Norkos Dungeon -11', rewards: { con: 100 } },
            { name: 'Fate Lake', rewards: { con: 500 } },
            { name: 'Fate Pools -2', rewards: { con: 50 } },
            { name: 'The Astral Plane', rewards: { con: 1000 } },
            { name: 'The Elemental Plane -3', rewards: { con: 750 } },
            { name: 'Merchant\'s Guild', rewards: { con: 250 } },
            { name: 'Cabran Falls', rewards: { con: 250 } },
            { name: 'North Pole', rewards: { con: 500 } },
            { name: 'Dungeon of Love -1', rewards: { con: 500 } }
        ];
        return _.compact(_.map(validMaps, mapData => {
            if (!allMaps[mapData.name])
                return;
            mapData.tier = 1;
            mapData.type = achievement_1.AchievementTypes.EXPLORE;
            mapData.desc = `Gain +${mapData.rewards.con} CON for visiting ${mapData.name}.`;
            mapData.name = `Mapceptional: ${mapData.name}`;
            mapData.rewards = [_.extend({ type: 'stats' }, mapData.rewards)];
            return mapData;
        }));
    }
}
exports.Mapceptional = Mapceptional;
