"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class RelentlessAssault extends effect_1.Effect {
    tick() {
        super.tick();
        this.target.$battle.doAttack(this.target, 'Attack');
        this.target.$battle.doAttack(this.target, 'Attack');
        this.target._special.sub(25);
        if (this.target._special.atMinimum())
            this.duration = 0;
    }
}
exports.RelentlessAssault = RelentlessAssault;
