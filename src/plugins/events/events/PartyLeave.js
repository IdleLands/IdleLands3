
import _ from 'lodash';
import { Event } from '../event';

export const WEIGHT = -1;

// Get given the opportunity to leave party
export class PartyLeave extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {
    const otherOfSame = _.find(player.choices, choice => choice.event === 'PartyLeave');
    if(otherOfSame) return;
    const id = Event.chance.guid();
    const message = 'Would you like to leave your party?';

    player.addChoice({ id, message, extraData: {}, event: 'PartyLeave', choices: ['Yes', 'No'] });
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes' || !player.party) return;
    player.party.playerLeave(player);
  }
}

