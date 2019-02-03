"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DrunkenStupor extends effect_1.Effect {
    affect() {
        this.stun = this.target.$drunk.gtePercent(50) && effect_1.Effect.chance.bool({ likelihood: 75 });
        this.stunMessage = `${this.target.fullname} falls into a drunken stupor!`;
    }
    tick() {
        super.tick();
        this.target.$drunk.sub(25);
        this.stun = this.target.$drunk.gtePercent(50) && effect_1.Effect.chance.bool({ likelihood: 75 });
        this.stunMessage = `${this.target.fullname} is too drunk to act!`;
    }
    unaffect() {
        super.unaffect();
        this.target.$drunk.toMinimum();
    }
}
exports.DrunkenStupor = DrunkenStupor;
