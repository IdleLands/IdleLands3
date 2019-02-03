"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Wolfmaster extends achievement_1.Achievement {
    static achievementData(player) {
        const titles = player.$achievements.titles();
        // there are 6 wolf titles
        const baseValue = 6;
        const ownedTitles = _.filter(titles, title => _.includes(title, 'Wolf'));
        if (ownedTitles.length < baseValue)
            return [];
        return [{
                tier: 1,
                name: 'Wolfmaster',
                desc: 'Gain a title for getting all of the wolf titles.',
                type: achievement_1.AchievementTypes.EVENT,
                rewards: [{
                        type: 'title',
                        title: 'Big Bad Wolf',
                        deathMessage: '%player went from alpha to beta, just like that.'
                    }]
            }];
    }
}
exports.Wolfmaster = Wolfmaster;
