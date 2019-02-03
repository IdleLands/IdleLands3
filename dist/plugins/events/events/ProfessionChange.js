"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const _emitter_1 = require("../../players/_emitter");
exports.WEIGHT = -1;
// Get given the opportunity to change classes
class ProfessionChange extends event_1.Event {
    static operateOn(player, { professionName, trainerName }) {
        const otherOfSame = _.find(player.choices, choice => choice.event === 'ProfessionChange');
        if (player.professionName === professionName) {
            const message = this._parseText(`%player met with ${trainerName}, but is already a ${professionName}.`, player);
            this.emitMessage({ affected: [player], eventText: message, category: adventure_log_1.MessageCategories.PROFESSION });
            return;
        }
        if (otherOfSame) {
            const message = this._parseText(`%player met with ${trainerName}, but already has an offer from a different trainer.`, player);
            this.emitMessage({ affected: [player], eventText: message, category: adventure_log_1.MessageCategories.PROFESSION });
            return;
        }
        const id = event_1.Event.chance.guid();
        const message = `Would you like to change your profession to ${professionName}?`;
        const extraData = { professionName, trainerName };
        player.addChoice({ id, message, extraData, event: 'ProfessionChange', choices: ['Yes', 'No'] });
    }
    static makeChoice(player, id, response) {
        if (response !== 'Yes')
            return;
        const choice = _.find(player.choices, { id });
        if (player.professionName === choice.extraData.professionName)
            return;
        player.changeProfession(choice.extraData.professionName);
        _emitter_1.emitter.emit('player:changeclass', { player, choice });
    }
}
ProfessionChange.WEIGHT = exports.WEIGHT;
exports.ProfessionChange = ProfessionChange;
