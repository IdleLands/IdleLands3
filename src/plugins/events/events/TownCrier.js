
import _ from 'lodash';

import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

import { SystemTownCrierMessages } from '../basetowncrier';

export const WEIGHT = 36;

// Spout helpful information
export class TownCrier extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {

    const messageObject = _.sample(SystemTownCrierMessages);

    this.emitMessage({ affected: [player], eventText: messageObject.message, extraData: messageObject, category: MessageCategories.TOWNCRIER });

    return [player];
  }
}