"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Drunk extends personality_1.Personality {
    static hasEarned(player) {
        return player.level >= 18;
    }
}
Drunk.description = 'You stumble around randomly like a drunk.';
exports.Drunk = Drunk;
