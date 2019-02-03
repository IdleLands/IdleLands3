"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.migrate = (player) => {
    const choiceMigrate = _.get(player.$statistics.stats, 'Character.Choice.Choose');
    if (!_.isObject(choiceMigrate)) {
        _.set(player.$statistics.stats, 'Character.Choice.Choose', {});
    }
    const profMigrate = _.get(player.$statistics.stats, 'Character.Professions');
    if (!_.isObject(profMigrate)) {
        _.set(player.$statistics.stats, 'Character.Professions', {});
    }
    const mapMigrate = _.get(player.$statistics.stats, 'Character.Maps');
    if (!_.isObject(mapMigrate)) {
        _.set(player.$statistics.stats, 'Character.Maps', {});
    }
    const regionMigrate = _.get(player.$statistics.stats, 'Character.Regions');
    if (!_.isObject(regionMigrate)) {
        _.set(player.$statistics.stats, 'Character.Regions', {});
    }
    const combats = player.$statistics.getStat('Combats');
    if (combats > 0) {
        player.$statistics.setStat('Combat.Times', combats);
        player.$statistics.setStat('Combats', 0);
    }
    const combatSolo = player.$statistics.getStat('CombatSolo');
    if (combatSolo > 0) {
        player.$statistics.setStat('Combat.TimesSolo', combatSolo);
        player.$statistics.setStat('CombatSolo', 0);
    }
    if (player.guild && !player.guild.$noGuild && player.guildInvite) {
        player.guildInvite = null;
    }
};
