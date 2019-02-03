"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Solo extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Party.Join') >= 5;
    }
    static enable(player) {
        if (!player.party)
            return;
        super.enable(player);
        player.party.playerLeave(player);
    }
}
Solo.description = 'You will never join parties.';
exports.Solo = Solo;
