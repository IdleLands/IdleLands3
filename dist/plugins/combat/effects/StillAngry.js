"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class StillAngry extends effect_1.Effect {
    affect() {
        this.stun = true;
        this.stunMessage = `${this.origin.name} is still fuming about the résumé that ${this.target.fullname} turned down!`;
    }
    tick() {
        super.tick();
        this.stun = true;
        this.stunMessage = `${this.origin.name} is still fuming about the résumé that ${this.target.fullname} turned down!`;
    }
}
exports.StillAngry = StillAngry;
