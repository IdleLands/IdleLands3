"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Classfizzy extends achievement_1.Achievement {
    static achievementData(player) {
        const allProfessionsBeen = player.$statistics.getStat('Character.Professions');
        const allProfessions = [
            'Beatomancer', 'Clockborg', 'Druid', 'Fencer', 'Lich', 'Trickster'
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
                name: 'Classfizzy',
                desc: `+${2 * tier}% STR/CON/DEX/INT/AGI/LUK and +${tier * 50} max item score for being each advanced profession ${tier} times.`,
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{
                        type: 'title',
                        title: 'Fizzy',
                        deathMessage: '%player was so fizzy that they solidified.'
                    }, {
                        type: 'petattr',
                        petattr: 'a ball of gas'
                    }, {
                        type: 'stats',
                        agi: (player, baseValue) => baseValue * 0.02 * tier,
                        agiDisplay: `+${tier * 2}%`,
                        str: (player, baseValue) => baseValue * 0.02 * tier,
                        strDisplay: `+${tier * 2}%`,
                        dex: (player, baseValue) => baseValue * 0.02 * tier,
                        dexDisplay: `+${tier * 2}%`,
                        con: (player, baseValue) => baseValue * 0.02 * tier,
                        conDisplay: `+${tier * 2}%`,
                        int: (player, baseValue) => baseValue * 0.02 * tier,
                        intDisplay: `+${tier * 2}%`,
                        luk: (player, baseValue) => baseValue * 0.02 * tier,
                        lukDisplay: `+${tier * 2}%`,
                        itemFindRange: tier * 50
                    }]
            }];
    }
}
exports.Classfizzy = Classfizzy;
