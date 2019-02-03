"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Intimidate extends effect_1.Effect {
    affect() {
        this.setStat(this.target, 'aegis', -this.potency);
        this._emitMessage(this.target, '%casterName is getting up in %player\'s face!');
    }
    tick() {
        this._emitMessage(this.target, '%casterName is getting up in %player\'s face!');
    }
}
exports.Intimidate = Intimidate;
