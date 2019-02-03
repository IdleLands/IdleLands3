"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class ScaredOfTheDark extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Movement.Descend') >= 5;
    }
}
ScaredOfTheDark.description = 'You will never go down stairs, because its dark down there.';
exports.ScaredOfTheDark = ScaredOfTheDark;
