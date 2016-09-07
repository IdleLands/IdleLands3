
import _ from 'lodash';

import { StringAssets } from '../../shared/asset-loader';
import { MessageParser } from '../../plugins/events/messagecreator';

import { primus } from '../../primus/server';

import { emitter } from '../../plugins/players/_emitter';

import Chance from 'chance';
const chance = new Chance();

export class Event {

  static get chance() { return chance; }
  static operateOn() {}
  static makeChoice() {}

  static t0stats = ['dex', 'agi'];
  static t1stats = ['str', 'int', 'con'];
  static t2stats = ['luk'];

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

  static pickValidItem(player) {
    const validTargets = _.reject(player.equipment, item => item.type === 'providence');
    return _.sample(validTargets);
  }

  static pickValidItemForBless(player) {
    const validTargets = _.filter(player.equipment, item => item.type !== 'providence' && item.isUnderNormalPercent);
    return _.sample(validTargets);
  }

  static pickStat() {
    return _.sample(['str', 'con', 'dex', 'agi', 'int', 'luk']);
  }

  static emitMessage({ affected, eventText, category, extraData }) {
    emitter.emit('player:event', { affected, eventText, category, extraData });
  }

  static feedback(player, message) {
    primus.forEach(spark => {
      if(!spark.authToken || spark.authToken.playerName !== player.name) return;
      spark.write({ type: 'error', title: '', notify: message });
    });
  }
}
