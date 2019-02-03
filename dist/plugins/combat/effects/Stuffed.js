"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class Stuffed extends effect_1.Effect {
    affect(target) {
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is stuffed!`;
        const newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
        _.each(newStats, (val, stat) => {
            this.setStat(target, stat, val);
        });
    }
    tick() {
        super.tick();
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is stuffed!`;
    }
}
exports.Stuffed = Stuffed;
