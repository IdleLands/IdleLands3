"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const NRP = require("node-redis-pubsub");
const nodeCleanup = require("node-cleanup");
const game_state_1 = require("../../core/game-state");
const playerlist_updater_1 = require("../../shared/playerlist-updater");
const sendmessage_1 = require("../chat/sendmessage");
const commands_1 = require("../gm/commands");
const server_1 = require("../../primus/server");
const emitter_watchers_1 = require("../../core/emitter-watchers");
const logger_1 = require("../../shared/logger");
const redisUrl = process.env.REDIS_URL;
const INSTANCE = _.isNaN(+process.env.INSTANCE_NUMBER) ? 0 : +process.env.INSTANCE_NUMBER;
const redisInstance = redisUrl ? new NRP({
    url: redisUrl
}) : null;
const _emit = (event, data = {}) => {
    if (!redisInstance)
        return;
    data._instance = INSTANCE;
    redisInstance.emit(event, data);
};
nodeCleanup(() => {
    _emit('server:forcekill');
    setTimeout(() => {
        process.exit(0);
    }, 1000);
    return false;
});
let otherPlayers = [];
if (redisInstance) {
    logger_1.Logger.info('Redis', `Am instance ${INSTANCE}`);
    redisInstance.on('server:forcekill', ({ _instance }) => {
        otherPlayers = _.reject(otherPlayers, p => p.$shard === _instance);
    });
    redisInstance.on('player:forcelogout', ({ playerName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', `Redis ${INSTANCE} acting on forcelogout from ${_instance}`, playerName);
        server_1.primus.delPlayer(playerName);
        emitter_watchers_1.emitter.emit('player:logout', { playerName });
        playerlist_updater_1.PlayerLogoutData(playerName);
        otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
    });
    redisInstance.on('player:logout', ({ playerName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', `Redis ${INSTANCE} acting on logout from ${_instance}`, playerName);
        playerlist_updater_1.PlayerLogoutData(playerName);
        otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
    });
    redisInstance.on('player:login', ({ playerName, data, _instance }) => {
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', `Redis ${INSTANCE} acting on login from ${_instance}`, playerName);
        playerlist_updater_1.PlayerLoginData(playerName, data);
        otherPlayers.push(data);
    });
    redisInstance.on('player:update', ({ data, _instance }) => {
        if (INSTANCE === _instance)
            return;
        playerlist_updater_1.PlayerUpdateAllData(data);
        _.merge(_.find(otherPlayers, { name: data.name }), data);
    });
    redisInstance.on('global:move', ({ data, _instance }) => {
        if (INSTANCE === _instance)
            return;
        playerlist_updater_1.SomePlayersPostMoveData(data);
    });
    redisInstance.on('chat:send', ({ message, isExternal, _instance }) => {
        if (INSTANCE === _instance && !isExternal)
            return;
        sendmessage_1.sendMessage(message, isExternal);
    });
    redisInstance.on('festival:add', ({ festival }) => {
        game_state_1.GameState.getInstance().addFestivalData(festival, false);
    });
    redisInstance.on('festival:cancel', ({ festivalId }) => {
        game_state_1.GameState.getInstance().cancelFestivalData(festivalId);
    });
    redisInstance.on('gm:teleport', ({ playerName, opts }) => {
        commands_1.GMCommands.teleport(playerName, opts, false);
    });
    redisInstance.on('gm:togglemod', ({ playerName }) => {
        commands_1.GMCommands.toggleMod(playerName, false);
    });
    redisInstance.on('gm:toggleachievement', ({ playerName, achievement }) => {
        commands_1.GMCommands.toggleAchievement(playerName, achievement, false);
    });
    redisInstance.on('gm:setlevel', ({ playerName, level }) => {
        commands_1.GMCommands.setLevel(playerName, level, false);
    });
    redisInstance.on('gm:giveitem', ({ playerName, item }) => {
        commands_1.GMCommands.giveItem(playerName, item, false);
    });
    redisInstance.on('gm:giveevent', ({ playerName, event }) => {
        commands_1.GMCommands.giveEvent(playerName, event, false);
    });
    redisInstance.on('gm:givegold', ({ playerName, gold }) => {
        commands_1.GMCommands.giveGold(playerName, gold, false);
    });
    redisInstance.on('gm:giveilp', ({ playerName, ilp }) => {
        commands_1.GMCommands.giveILP(playerName, ilp, false);
    });
    redisInstance.on('gm:setstat', ({ playerName, stat, value }) => {
        commands_1.GMCommands.setStat(playerName, stat, value, false);
    });
    redisInstance.on('gm:ban', ({ playerName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        commands_1.GMCommands.ban(playerName, false);
    });
    redisInstance.on('gm:mute', ({ playerName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        commands_1.GMCommands.mute(playerName, false);
    });
    redisInstance.on('gm:pardon', ({ playerName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        commands_1.GMCommands.pardon(playerName, false);
    });
    redisInstance.on('guild:reload', ({ guildName, notify, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds._loadGuild(guildName, notify);
    });
    redisInstance.on('guild:kick', ({ guildName, kickName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).kickMemberName(kickName, false);
    });
    redisInstance.on('guild:join', ({ guildName, joinName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).memberJoinName(joinName, false, false);
    });
    redisInstance.on('guild:leave', ({ guildName, leaveName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).memberLeaveName(leaveName, false);
    });
    redisInstance.on('guild:invite', ({ guildName, byName, invName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).inviteMemberName(byName, invName, false);
    });
    redisInstance.on('guild:disband', ({ guildName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).disband();
    });
    redisInstance.on('guild:renameretag', ({ guildName, newName, newTag, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds._renameRetag(guildName, newName, newTag);
    });
    redisInstance.on('guild:buildbuilding', ({ guildName, buildingName, slot, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).buildBuilding(buildingName, slot, false);
    });
    redisInstance.on('guild:upgradebuilding', ({ guildName, buildingName, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).upgradeBuilding(buildingName, false);
    });
    redisInstance.on('guild:movebase', ({ guildName, newBase, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).moveBases(newBase, false);
    });
    redisInstance.on('guild:updateprop', ({ guildName, buildingName, propName, propValue, _instance }) => {
        if (INSTANCE === _instance)
            return;
        game_state_1.GameState.getInstance().guilds.getGuild(guildName).updateProperty(buildingName, propName, propValue, false);
    });
}
exports.GetRedisPlayers = () => {
    return otherPlayers;
};
exports.PlayerForceLogout = (playerName) => {
    logger_1.Logger.silly('Redis', `Redis ${INSTANCE} emitting forcelogout`, playerName);
    _emit('player:forcelogout', { playerName });
};
exports.PlayerLogoutRedis = (playerName) => {
    logger_1.Logger.silly('Redis', `Redis ${INSTANCE} emitting logout`, playerName);
    _emit('player:logout', { playerName });
};
exports.PlayerLoginRedis = (playerName, data) => {
    logger_1.Logger.silly('Redis', `Redis ${INSTANCE} emitting login`, playerName);
    _emit('player:login', { playerName, data });
};
exports.PlayerUpdateAllRedis = (data) => {
    _emit('player:update', { data });
};
exports.SomePlayersPostMoveRedis = (data) => {
    _emit('global:move', { data });
};
exports.SendChatMessage = (message, isExternal) => {
    if (!redisInstance) {
        if (isExternal) {
            sendmessage_1.sendMessage(message, isExternal);
        }
        return;
    }
    _emit('chat:send', { message, isExternal });
};
exports.AddFestivalRedis = (festival) => {
    _emit('festival:add', { festival });
};
exports.CancelFestivalRedis = (festivalId) => {
    _emit('festival:cancel', { festivalId });
};
exports.TeleportRedis = (playerName, opts) => {
    _emit('gm:teleport', { playerName, opts });
};
exports.ToggleModRedis = (playerName) => {
    _emit('gm:togglemod', { playerName });
};
exports.ToggleAchievementRedis = (playerName, achievement) => {
    _emit('gm:toggleachievement', { playerName, achievement });
};
exports.SetLevelRedis = (playerName, level) => {
    _emit('gm:setlevel', { playerName, level });
};
exports.GiveItemRedis = (playerName, item) => {
    _emit('gm:giveitem', { playerName, item });
};
exports.GiveEventRedis = (playerName, event) => {
    _emit('gm:giveevent', { playerName, event });
};
exports.GiveGoldRedis = (playerName, gold) => {
    _emit('gm:givegold', { playerName, gold });
};
exports.GiveILPRedis = (playerName, ilp) => {
    _emit('gm:giveilp', { playerName, ilp });
};
exports.SetStatRedis = (playerName, stat, value) => {
    _emit('gm:setstat', { playerName, stat, value });
};
exports.BanRedis = (playerName) => {
    _emit('gm:ban', { playerName });
};
exports.MuteRedis = (playerName) => {
    _emit('gm:mute', { playerName });
};
exports.PardonRedis = (playerName) => {
    _emit('gm:pardon', { playerName });
};
exports.GuildReloadRedis = (guildName, notify) => {
    _emit('guild:reload', { guildName, notify });
};
exports.GuildKickRedis = (guildName, kickName) => {
    _emit('guild:kick', { guildName, kickName });
};
exports.GuildJoinRedis = (guildName, joinName) => {
    _emit('guild:join', { guildName, joinName });
};
exports.GuildLeaveRedis = (guildName, leaveName) => {
    _emit('guild:leave', { guildName, leaveName });
};
exports.GuildInviteRedis = (guildName, byName, invName) => {
    _emit('guild:invite', { guildName, byName, invName });
};
exports.GuildDisbandRedis = (guildName) => {
    _emit('guild:disband', { guildName });
};
exports.GuildRenameRetagRedis = (guildName, newName, newTag) => {
    _emit('guild:renameretag', { guildName, newName, newTag });
};
exports.GuildBuildBuildingRedis = (guildName, buildingName, slot) => {
    _emit('guild:buildbuilding', { guildName, buildingName, slot });
};
exports.GuildUpgradeBuildingRedis = (guildName, buildingName) => {
    _emit('guild:upgradebuilding', { guildName, buildingName });
};
exports.GuildMoveBaseRedis = (guildName, newBase) => {
    _emit('guild:movebase', { guildName, newBase });
};
exports.GuildUpdateBuildingPropertyRedis = (guildName, buildingName, propName, propValue) => {
    _emit('guild:updateprop', { guildName, buildingName, propName, propValue });
};
