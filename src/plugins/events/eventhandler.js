
import _ from 'lodash';
import fs from 'fs';

import Chance from 'chance';
const chance = new Chance();

export const allEvents = {};

const loadAllEvents = () => {
  const list = fs.readdirSync(`${__dirname}/events`);
  _.each(list, basefilename => {
    allEvents[basefilename.split('.')[0]] = require(`${__dirname}/events/${basefilename}`);
  });
};

loadAllEvents();

export class EventHandler {

  static doEvent(player, eventName) {
    if(!allEvents[eventName]) return;
    const chosenEvent = allEvents[eventName][eventName];
    const affected = chosenEvent.operateOn(player);

    _.each(affected, affect => {
      if(!affect || !affect.$statistics) return;
      affect.$statistics.batchIncrement(['Character.Events', `Character.Event.${eventName}`]);
    });
  }

  static tryToDoEvent(player) {

    if(player.eventSteps > 0) {
      player.eventSteps--;
      return;
    }

    const requiredEventSteps = chance.integer({ min: 35, max: 50 });
    const modifier = player.calcLuckBonusFromValue();
    player.eventSteps = Math.max(7, requiredEventSteps - modifier);

    const events = [];
    const weights = [];

    _.each(_.keys(allEvents), evtName => {
      events.push(evtName);
      weights.push(allEvents[evtName].WEIGHT);
    });

    const chosenEventName = chance.weighted(events, weights);
    this.doEvent(player, chosenEventName);
  }
}
