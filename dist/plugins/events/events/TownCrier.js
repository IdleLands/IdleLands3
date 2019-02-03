"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const basetowncrier_1 = require("../basetowncrier");
exports.WEIGHT = 36;
// Spout helpful information
class TownCrier extends event_1.Event {
    static operateOn(player) {
        const messageObject = _.sample(basetowncrier_1.SystemTownCrierMessages);
        this.emitMessage({ affected: [player], eventText: messageObject.message, extraData: messageObject, category: adventure_log_1.MessageCategories.TOWNCRIER });
        return [player];
    }
}
TownCrier.WEIGHT = exports.WEIGHT;
exports.TownCrier = TownCrier;
