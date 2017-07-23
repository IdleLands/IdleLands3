
import * as _ from 'lodash';
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';
import { emitter } from '../../players/_emitter';

export const WEIGHT = -1;

// Get given the opportunity to change classes
export class ProfessionChange extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player, { professionName, trainerName }) {
    const otherOfSame = _.find(player.choices, choice => choice.event === 'ProfessionChange');
    if(player.professionName === professionName) {
      const message = this._parseText(`%player met with ${trainerName}, but is already a ${professionName}.`, player);
      this.emitMessage({ affected: [player], eventText: message, category: MessageCategories.PROFESSION });
      return;
    }

    if(otherOfSame) {
      const message = this._parseText(`%player met with ${trainerName}, but already has an offer from a different trainer.`, player);
      this.emitMessage({ affected: [player], eventText: message, category: MessageCategories.PROFESSION });
      return;
    }
    const id = Event.chance.guid();
    const message = `Would you like to change your profession to ${professionName}?`;
    const extraData = { professionName, trainerName };

    player.addChoice({ id, message, extraData, event: 'ProfessionChange', choices: ['Yes', 'No'] });
  }

  static makeChoice(player, id, response) {
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });
    if(player.professionName === choice.extraData.professionName) return;
    player.changeProfession(choice.extraData.professionName);
    emitter.emit('player:changeclass', { player, choice });
  }
}

