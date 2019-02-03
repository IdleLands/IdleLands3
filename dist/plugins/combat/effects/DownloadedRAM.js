"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class DownloadedRAM extends effect_1.Effect {
    affect(target) {
        _.each(['str', 'dex', 'agi'], stat => {
            this.setStat(target, stat, this.statByPercent(target, stat, this.potency));
        });
        this.setStat(target, 'int', -this.statByPercent(target, 'int', this.potency));
    }
}
exports.DownloadedRAM = DownloadedRAM;
