"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DoS extends effect_1.Effect {
    affect() {
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is dropping packets!`;
    }
    tick() {
        super.tick();
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is dropping packets!`;
    }
}
exports.DoS = DoS;
