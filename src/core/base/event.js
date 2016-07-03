
import _ from 'lodash';

import { StringAssets } from '../../shared/asset-loader';
import { MessageParser } from '../../plugins/events/messagecreator';

import { emitter } from '../../plugins/players/_emitter';

import Chance from 'chance';
const chance = new Chance();

export class Event {

  static get chance() { return chance; }
  static operateOn() {}
  static makeChoice() {}

  static _parseText(message, player, extra) {
    return MessageParser.stringFormat(message, player, extra);
  }

  static eventText(eventType, player, extra) {
    return this._parseText(
      _.sample(StringAssets[eventType]),
      player,
      extra
    );
  }

  static emitMessage({ affected, eventText }) {
    emitter.emit('player:event', { affected, eventText });
  }
}
