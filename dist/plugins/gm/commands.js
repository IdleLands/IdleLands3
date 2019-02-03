"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventhandler_1 = require("../events/eventhandler");
const FindItem_1 = require("../events/events/FindItem");
const game_state_1 = require("../../core/game-state");
const _emitter_1 = require("../../plugins/players/_emitter");
const playerlist_updater_1 = require("../../shared/playerlist-updater");
const redis_1 = require("../scaler/redis");
class GMCommands {
    static ban(playerName, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.BanRedis(playerName);
        player.isBanned = true;
        player._saveSelf();
        _emitter_1.emitter.emit('player:logout', { playerName: player.name });
    }
    static mute(playerName, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.MuteRedis(playerName);
        player.isMuted = !player.isMuted;
        if (player.isMuted && player.isPardoned)
            player.isPardoned = false;
        player._saveSelf();
        playerlist_updater_1.PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
    }
    static pardon(playerName, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.PardonRedis(playerName);
        player.isPardoned = !player.isPardoned;
        if (player.isPardoned && player.isMuted)
            player.isMuted = false;
        playerlist_updater_1.PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
    }
    static teleport(playerName, { map, x, y, toLoc }, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.TeleportRedis(playerName, { map, x, y, toLoc });
        player.$playerMovement._doTeleport(player, { map, x, y, toLoc });
    }
    static toggleMod(playerName, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.ToggleModRedis(playerName);
        player.isMod = !player.isMod;
        player._saveSelf();
    }
    static toggleAchievement(playerName, achievement, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.ToggleAchievementRedis(playerName, achievement);
        player.permanentAchievements = player.permanentAchievements || {};
        player.permanentAchievements[achievement] = !player.permanentAchievements[achievement];
        player._checkAchievements();
        player._save();
    }
    static setLevel(playerName, level, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.SetLevelRedis(playerName, level);
        player._level.set(level - 1);
        player.levelUp();
    }
    static giveEvent(playerName, event, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveItemRedis(playerName, event);
        eventhandler_1.EventHandler.doEvent(player, event);
    }
    static giveItem(playerName, item, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveEventRedis(playerName, item);
        FindItem_1.FindItem.operateOn(player, null, item);
    }
    static giveGold(playerName, gold, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveGoldRedis(playerName, gold);
        player.gold += gold;
    }
    static giveILP(playerName, ilp, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveILPRedis(playerName, ilp);
        player.$premium.addIlp(ilp);
        player._updatePremium();
    }
    static setStat(playerName, stat, value, propagate = true) {
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.SetStatRedis(playerName, stat, value);
        player.$statistics.setStat(stat, value);
        player.$statistics.save();
        player._updateStatistics();
    }
    static createFestival(festival) {
        game_state_1.GameState.getInstance().addFestival(festival);
    }
    static cancelFestival(festivalId) {
        game_state_1.GameState.getInstance().cancelFestival(festivalId);
    }
}
exports.GMCommands = GMCommands;
