"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Achievement {
    static achievementData() { }
    static log(base, number) {
        return Math.log(number) / Math.log(base);
    }
}
exports.Achievement = Achievement;
exports.AchievementTypes = {
    PROGRESS: 'Progress',
    EXPLORE: 'Explore',
    COMBAT: 'Combat',
    SPECIAL: 'Special',
    EVENT: 'Event',
    PET: 'Pet'
};
