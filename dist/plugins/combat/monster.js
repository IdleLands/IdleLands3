"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const character_1 = require("../../core/base/character");
class Monster extends character_1.Character {
    init(opts) {
        opts.levelSet = opts.level;
        delete opts.level;
        opts.hpBoost = opts.hp;
        delete opts.hp;
        opts.mpBoost = opts.mp;
        delete opts.mp;
        this.gold = Math.round(Math.random() * 10000);
        super.init(opts);
    }
}
exports.Monster = Monster;
