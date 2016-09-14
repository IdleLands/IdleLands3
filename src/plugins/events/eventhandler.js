
import _ from 'lodash';
import fs from 'fs';

import Chance from 'chance';
const chance = new Chance();

const allEvents = {};

const loadAllEvents = () => {
  const list = fs.readdirSync(`${__dirname}/events`);
  _.each(list, basefilename => {
    allEvents[basefilename.split('.')[0]] = require(`${__dirname}/events/${basefilename}`);
  });
};

loadAllEvents();

export class EventHandler {
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
    const chosenEvent = allEvents[chosenEventName][chosenEventName];
    const affected = chosenEvent.operateOn(player);

    _.each(affected, affect => {
      affect.$statistics.batchIncrement(['Character.Events', `Character.Event.${chosenEventName}`]);
    });
  }
}