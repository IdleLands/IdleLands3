"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Coward extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Combat.Lose') >= 25;
    }
}
Coward.disableOnActivate = ['Bloodthirsty'];
Coward.description = 'Your cowardice allows you to avoid combat more often.';
exports.Coward = Coward;
