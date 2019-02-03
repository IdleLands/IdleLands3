"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Frostbite extends effect_1.Effect {
    affect() {
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is frostbitten!`;
    }
    tick() {
        super.tick();
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = `${this.target.fullname} is frostbitten!`;
    }
}
exports.Frostbite = Frostbite;
