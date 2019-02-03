"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const adventure_log_1 = require("../shared/adventure-log");
const game_state_1 = require("./game-state");
const _emitter_1 = require("../plugins/players/_emitter");
const player_migration_1 = require("../plugins/players/player.migration");
const player_handleip_1 = require("../plugins/players/player.handleip");
const playerlist_updater_1 = require("../shared/playerlist-updater");
const messagecreator_1 = require("../plugins/events/messagecreator");
const logger_1 = require("../shared/logger");
const updateGuildLastSeen = (player, online) => {
    if (!player.guild || player.guild.$noGuild)
        return;
    player.guild.updateLastSeen(player, online);
};
_emitter_1.emitter.on('error', e => {
    logger_1.Logger.error('PlayerEmitter', e);
});
_emitter_1.emitter.on('player:semilogin', ({ playerName, fromIp }) => {
    const player = game_state_1.GameState.getInstance().getPlayer(playerName);
    player_handleip_1.handleIp(player, fromIp);
    player.quickLogin();
    player.update();
    player.$shard = process.env.INSTANCE_NUMBER;
    playerlist_updater_1.AllPlayers(playerName);
});
_emitter_1.emitter.on('player:login', ({ playerName, fromIp }) => __awaiter(this, void 0, void 0, function* () {
    const player = yield game_state_1.GameState.getInstance().addPlayer(playerName);
    if (!player)
        return;
    player_migration_1.migrate(player);
    player_handleip_1.handleIp(player, fromIp);
    player.$shard = process.env.INSTANCE_NUMBER;
    player.update();
    player.$statistics.incrementStat('Game.Logins');
    playerlist_updater_1.AllPlayers(playerName);
    playerlist_updater_1.PlayerLogin(playerName);
    updateGuildLastSeen(player, true);
    if (player.$statistics.getStat('Game.Logins') === 1) {
        player.$statistics.incrementStat(`Character.Professions.${player.professionName}`);
        adventure_log_1.AdventureLog({
            text: messagecreator_1.MessageParser.stringFormat('Welcome to Idliathlia, the world of IdleLands! Check out our new player information guide on the wiki and enjoy your stay!'),
            type: adventure_log_1.MessageTypes.SINGLE,
            targets: [playerName],
            extraData: { link: 'https://github.com/IdleLands/IdleLands/wiki/New-Player-Information' },
            category: adventure_log_1.MessageCategories.META
        });
    }
}));
_emitter_1.emitter.on('player:register', ({ playerName, fromIp }) => __awaiter(this, void 0, void 0, function* () {
    const player = yield game_state_1.GameState.getInstance().addPlayer(playerName);
    if (!player)
        return;
    player_handleip_1.handleIp(player, fromIp);
    player.update();
    player.$statistics.incrementStat('Game.Logins');
    player.$statistics.incrementStat(`Character.Professions.${player.professionName}`);
    player.$shard = process.env.INSTANCE_NUMBER;
    playerlist_updater_1.AllPlayers(playerName);
    playerlist_updater_1.PlayerLogin(playerName);
}));
_emitter_1.emitter.on('player:logout', ({ playerName }) => {
    const player = game_state_1.GameState.getInstance().getPlayer(playerName);
    if (player) {
        updateGuildLastSeen(player, false);
    }
    playerlist_updater_1.PlayerLogout(playerName);
    game_state_1.GameState.getInstance().delPlayer(playerName);
});
_emitter_1.emitter.on('player:levelup', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['level']);
    player.tryUpdateGuild();
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat(`%player has reached experience level ${player.level}!`, player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.LEVELUP,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:changeguildstatus', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['guildName']);
    player.update();
});
_emitter_1.emitter.on('player:changelevel', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['level']);
    player.update();
    player.tryUpdateGuild();
});
_emitter_1.emitter.on('player:changegender', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['gender']);
    player.update();
});
_emitter_1.emitter.on('player:changetitle', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['title']);
    player.update();
    player.tryUpdateGuild();
});
_emitter_1.emitter.on('player:changename', ({ player }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['name', 'nameEdit']);
    player.update();
});
_emitter_1.emitter.on('player:achieve', ({ player, achievements }) => {
    player.recalculateStats();
    player.$updateAchievements = true;
    _.each(achievements, achievement => {
        adventure_log_1.AdventureLog({
            text: messagecreator_1.MessageParser.stringFormat(`%player has achieved ${achievement.name}${achievement.tier > 1 ? ` tier ${achievement.tier}` : ''}!`, player),
            type: adventure_log_1.MessageTypes.SINGLE,
            category: adventure_log_1.MessageCategories.ACHIEVEMENT,
            targets: [player.name],
            targetsDisplay: [player.fullname]
        });
    });
});
_emitter_1.emitter.on('player:collectible', ({ player, collectible }) => {
    const extraData = {
        collectible: collectible.name
    };
    player.$updateCollectibles = true;
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat(`%player stumbled across a rare, shiny, and collectible %collectible in ${player.map} - ${player.mapRegion}!`, player, extraData),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.EXPLORE,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:changeclass', ({ player, choice }) => {
    player.$statistics.incrementStat(`Character.Professions.${choice.extraData.professionName}`);
    playerlist_updater_1.PlayerUpdateAll(player.name, ['professionName']);
    player.tryUpdateGuild();
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat(`%player has met with ${choice.extraData.trainerName} and became a ${choice.extraData.professionName}!`, player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.PROFESSION,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:transfer', ({ player, dest }) => {
    playerlist_updater_1.PlayerUpdateAll(player.name, ['name', 'map']);
    let message = '';
    switch (dest.movementType) {
        case 'ascend':
            message = `%player has ascended to ${dest.destName}.`;
            break;
        case 'descend':
            message = `%player has descended to ${dest.destName}.`;
            break;
        case 'fall':
            message = `%player has fallen to ${dest.destName} from ${dest.fromName}.`;
            break;
        case 'teleport':
            message = `%player has been teleported to ${dest.destName} from ${dest.fromName}.`;
            break;
    }
    if (dest.customMessage) {
        message = dest.customMessage.split('%playerName').join(player.fullname).split('%destName').join(dest.destName);
    }
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat(message, player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.EXPLORE,
        targets: [player.name],
        targetsDisplay: [player.fullname],
        map: player.map,
        x: player.x,
        y: player.y
    });
});
_emitter_1.emitter.on('player:event', ({ affected, category, eventText, extraData }) => {
    adventure_log_1.AdventureLog({
        text: eventText,
        extraData,
        type: adventure_log_1.MessageTypes.SINGLE,
        category,
        targets: _.map(affected, 'name'),
        targetsDisplay: _.map(affected, 'fullname')
    });
});
