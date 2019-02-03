"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Camping extends personality_1.Personality {
    static hasEarned(player) {
        const hoursPlayed = Math.abs(player.joinDate - Date.now()) / 36e5;
        return hoursPlayed > 24 * 7;
    }
    static enable(player) {
        if (!player.party)
            return;
        super.enable(player);
        player.party.playerLeave(player);
    }
}
Camping.description = 'You will not move or have any events affect you.';
exports.Camping = Camping;
