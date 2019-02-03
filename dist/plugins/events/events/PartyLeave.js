"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
exports.WEIGHT = -1;
// Get given the opportunity to leave party
class PartyLeave extends event_1.Event {
    static operateOn(player) {
        if (event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        const otherOfSame = _.find(player.choices, choice => choice.event === 'PartyLeave');
        if (otherOfSame)
            return;
        const id = event_1.Event.chance.guid();
        const message = 'Would you like to leave your party?';
        player.addChoice({ id, message, extraData: {}, event: 'PartyLeave', choices: ['Yes', 'No'] });
    }
    static makeChoice(player, id, response) {
        if (response !== 'Yes' || !player.party)
            return;
        player.party.playerLeave(player);
    }
}
PartyLeave.WEIGHT = exports.WEIGHT;
exports.PartyLeave = PartyLeave;
