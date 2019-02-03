"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Delver extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Movement.Ascend') >= 5;
    }
}
Delver.description = 'You will never go up stairs, because the thrill of adventure is too great.';
exports.Delver = Delver;
