"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Spells = require("./spells/_all");
class SpellManager {
    static validSpells(player) {
        return _(Spells)
            .values()
            .filter(spellData => {
            return _.filter(spellData.tiers, tier => {
                return (tier.profession === player.professionName
                    || (player.$secondaryProfessions && _.includes(player.$secondaryProfessions, tier.profession)))
                    && tier.level <= player.level;
            }).length > 0;
        })
            .value();
    }
}
exports.SpellManager = SpellManager;
