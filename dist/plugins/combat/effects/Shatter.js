"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class Shatter extends effect_1.Effect {
    constructor(opts) {
        if (!opts.duration)
            opts.duration = 5;
        super(opts);
    }
    affect(target) {
        _.each(['str', 'dex', 'con'], stat => {
            this.setStat(target, stat, -this.statByPercent(target, stat, this.potency * 10));
        });
        this._emitMessage(this.target, '%player\'s defenses were shattered!');
    }
}
exports.Shatter = Shatter;
