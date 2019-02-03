"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const stat_calculator_1 = require("../../shared/stat-calculator");
const Chance = require("chance");
const chance = new Chance();
exports.allEvents = {};
const loadAllEvents = () => {
    const list = fs.readdirSync(`${__dirname}/events`);
    _.each(list, basefilename => {
        exports.allEvents[basefilename.split('.')[0]] = require(`${__dirname}/events/${basefilename}`);
    });
};
loadAllEvents();
class EventHandler {
    static doEvent(player, eventName) {
        if (!exports.allEvents[eventName])
            return;
        const chosenEvent = exports.allEvents[eventName][eventName];
        const affected = chosenEvent.operateOn(player);
        _.each(affected, affect => {
            if (!affect || !affect.$statistics)
                return;
            affect.$statistics.batchIncrement(['Character.Events', `Character.Event.${eventName}`]);
        });
    }
    static tryToDoEvent(player) {
        if (player.eventSteps > 0) {
            player.eventSteps--;
            return;
        }
        const requiredEventSteps = chance.integer({ min: 35, max: 50 });
        const modifier = player.calcLuckBonusFromValue();
        player.eventSteps = Math.max(7, requiredEventSteps - modifier);
        const events = [];
        const weights = [];
        _.each(_.keys(exports.allEvents), evtName => {
            const weight = exports.allEvents[evtName].WEIGHT;
            if (isNaN(weight))
                return;
            const modWeight = stat_calculator_1.StatCalculator.stat(player, `${evtName}Chance`, weight);
            if (modWeight <= 0)
                return;
            events.push(evtName);
            weights.push(modWeight);
        });
        const chosenEventName = chance.weighted(events, weights);
        this.doEvent(player, chosenEventName);
    }
}
exports.EventHandler = EventHandler;
