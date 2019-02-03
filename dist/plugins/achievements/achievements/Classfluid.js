"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Classfluid extends achievement_1.Achievement {
    static achievementData(player) {
        const allProfessionsBeen = player.$statistics.getStat('Character.Professions');
        const allProfessions = [
            'Archer', 'Barbarian', 'Bard', 'Bitomancer', 'Cleric', 'Fighter', 'Generalist', 'Jester',
            'Mage', 'MagicalMonster', 'Monster', 'Necromancer', 'Pirate', 'Rogue', 'SandwichArtist'
        ];
        let tier = 0;
        while (++tier) {
            if (!_.every(allProfessions, prof => allProfessionsBeen[prof] >= tier))
                break;
        }
        tier--;
        if (tier === 0)
            return [];
        return [{
                tier,
                name: 'Classfluid',
                desc: `+${3 * tier}% STR/CON/DEX/INT/AGI/LUK and +${tier * 100} max item score for being each basic profession ${tier} times.`,
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{
                        type: 'title',
                        title: 'Fluidic',
                        deathMessage: '%player was so fluid that they evaporated.'
                    }, {
                        type: 'petattr',
                        petattr: 'a drop of water'
                    }, {
                        type: 'stats',
                        agi: (player, baseValue) => baseValue * 0.03 * tier,
                        agiDisplay: `+${tier * 3}%`,
                        str: (player, baseValue) => baseValue * 0.03 * tier,
                        strDisplay: `+${tier * 3}%`,
                        dex: (player, baseValue) => baseValue * 0.03 * tier,
                        dexDisplay: `+${tier * 3}%`,
                        con: (player, baseValue) => baseValue * 0.03 * tier,
                        conDisplay: `+${tier * 3}%`,
                        int: (player, baseValue) => baseValue * 0.03 * tier,
                        intDisplay: `+${tier * 3}%`,
                        luk: (player, baseValue) => baseValue * 0.03 * tier,
                        lukDisplay: `+${tier * 3}%`,
                        itemFindRange: tier * 100
                    }]
            }];
    }
}
exports.Classfluid = Classfluid;
