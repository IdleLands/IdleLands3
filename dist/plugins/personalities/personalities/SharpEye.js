"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class SharpEye extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Item.Equip') >= 25;
    }
}
SharpEye.description = 'You can more easily discern valuable equipment.';
exports.SharpEye = SharpEye;
