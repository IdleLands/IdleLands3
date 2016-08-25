
import { MessageParser } from '../../plugins/events/messagecreator';
import { Logger } from '../../shared/logger';

export class Effect {

  constructor({ target, duration, potency }) {
    this.target = target;
    this.potency = potency;
    this.duration = duration;

    if(duration <= 0 || potency <= 0) {
      Logger.error('Effect', new Error('Bad duration or potency given for effect.'), { name: this.constructor.name, duration, potency });
    }
  }

  _emitMessage(player, message, extraData = {}) {
    return MessageParser.stringFormat(message, player, extraData);
  }

  statByPercent(player, stat, percent) {
    return Math.round(player.liveStats[stat] * percent/100);
  }

  tick() {
    this.duration--;
  }

  affect() {}

  unaffect() {}

}