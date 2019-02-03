"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Gullible extends personality_1.Personality {
    static hasEarned() {
        const date = new Date();
        return date.getUTCMonth() + 1 === 4 && date.getUTCDate() === 1;
    }
}
Gullible.disableOnActivate = [
    'Affirmer', 'Bloodthirsty', 'Camping', 'Coward', 'Delver',
    'Denier', 'Drunk', 'Explorer', 'FeelingLucky', 'Greedy',
    'Gullible', 'Indecisive', 'ScaredOfTheDark', 'Seeker',
    'Sharpeye', 'Solo', 'Swapper', 'TreasureHunter'
];
Gullible.description = 'Become the best form of yourself.';
Gullible.stats = {};
exports.Gullible = Gullible;
