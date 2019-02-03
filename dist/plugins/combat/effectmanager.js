"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class EffectManager {
    constructor() {
        this.effects = [];
    }
    hasEffect(effectName) {
        return _.some(this.effects, effect => effect.constructor.name === effectName);
    }
    clear() {
        _.each(this.effects, effect => effect.duration = 0);
        this.effects = [];
    }
    add(effect) {
        this.effects.push(effect);
    }
    remove(effect) {
        this.effects = _.without(this.effects, effect);
    }
    tick() {
        _.each(this.effects, effect => {
            if (effect.duration <= 0 || effect.target.hp === 0)
                return;
            effect.tick();
            if (effect.duration <= 0) {
                effect.unaffect();
                this.remove(effect);
            }
        });
    }
}
exports.EffectManager = EffectManager;
