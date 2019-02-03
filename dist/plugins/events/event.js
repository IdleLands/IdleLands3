"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const asset_loader_1 = require("../../shared/asset-loader");
const messagecreator_1 = require("../../plugins/events/messagecreator");
const server_1 = require("../../primus/server");
const _emitter_1 = require("../../plugins/players/_emitter");
const Chance = require("chance");
const chance = new Chance();
class Event {
    static get chance() { return chance; }
    static operateOn() { }
    static makeChoice() { }
    static _parseText(message, player, extra) {
        return messagecreator_1.MessageParser.stringFormat(message, player, extra);
    }
    static eventText(eventType, player, extra) {
        return this._parseText(_.sample(asset_loader_1.StringAssets[eventType]), player, extra);
    }
    static pickValidItem(player) {
        const validTargets = _.reject(player.equipment, item => item.isNothing || _.includes(this.invalidItemTypes, item.type));
        return _.sample(validTargets);
    }
    static pickValidItemForEnchant(player) {
        const validTargets = _.filter(player.equipment, item => !item.isNothing && !_.includes(this.invalidItemTypes, item.type) && item.isNormallyEnchantable);
        return _.sample(validTargets);
    }
    static pickValidItemForBless(player) {
        const validTargets = _.filter(player.equipment, item => !item.isNothing && !_.includes(this.invalidItemTypes, item.type) && item.isUnderNormalPercent(player));
        return _.sample(validTargets);
    }
    static pickStat() {
        return _.sample(['str', 'con', 'dex', 'agi', 'int', 'luk']);
    }
    static emitMessage({ affected, eventText, category, extraData }) {
        if (!_.isArray(affected))
            affected = [affected];
        _emitter_1.emitter.emit('player:event', { affected, eventText, category, extraData });
    }
    static feedback(player, message) {
        server_1.primus.forEach((spark, next) => {
            if (!spark.authToken || spark.authToken.playerName !== player.name)
                return next();
            spark.write({ type: 'error', title: '', notify: message });
            next();
        }, () => { });
        return message;
    }
}
Event.t0stats = ['dex', 'agi'];
Event.t1stats = ['str', 'int', 'con'];
Event.t2stats = ['luk'];
Event.invalidItemTypes = ['providence', 'trinket', 'soul'];
exports.Event = Event;
