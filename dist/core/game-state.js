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
const world_1 = require("./world/world");
const festivals_1 = require("../plugins/festivals/festivals");
const guilds_1 = require("../plugins/guilds/guilds");
const logger_1 = require("../shared/logger");
const di_wrapper_1 = require("../shared/di-wrapper");
const messages_1 = require("../static/messages");
const player_load_1 = require("../plugins/players/player.load");
const UPDATE_KEYS = ['x', 'y', 'map', 'gender', 'professionName', 'level', 'name', 'title', 'guildName'];
const EXTRA_KEYS = ['_id', 'nameEdit', 'isMuted', 'isPardoned', 'isMod', 'name', '$shard', '$currentIp', 'ascensionLevel'];
const redis_1 = require("../plugins/scaler/redis");
let GameStateInstance = null;
class GameState {
    constructor() {
        if (GameStateInstance) {
            throw new Error('Can only instantiate GameState once!');
        }
        this.players = [];
        this.playerLoad = di_wrapper_1.constitute(player_load_1.PlayerLoad);
        this.parties = {};
        this.playerTimeouts = {};
        logger_1.Logger.info('GameState', 'Creating world.');
        this.loadWorld();
        logger_1.Logger.info('GameState', 'Loading festivals.');
        this.festivalContainer = di_wrapper_1.constitute(festivals_1.Festivals);
        logger_1.Logger.info('GameState', 'Loading guilds.');
        this.guilds = di_wrapper_1.constitute(guilds_1.Guilds);
    }
    loadWorld() {
        if (this.world) {
            this.world.load();
            return;
        }
        this.world = di_wrapper_1.constitute(world_1.World);
    }
    hasGuild(guildName) {
        return this.guilds.guilds[guildName];
    }
    cancelFestivalData(festivalId) {
        this.festivalContainer.removeFestivalById(festivalId);
    }
    cancelFestival(festivalId) {
        this.cancelFestivalData(festivalId);
        redis_1.CancelFestivalRedis(festivalId);
    }
    addFestivalData(festival, insertIntoDb = true) {
        this.festivalContainer.addFestival(festival, insertIntoDb);
    }
    addFestival(festival) {
        this.addFestivalData(festival);
        redis_1.AddFestivalRedis(festival);
    }
    hasFestival(playerName) {
        return this.festivalContainer.hasFestival(playerName);
    }
    get festivals() {
        return this.festivalContainer.festivals;
    }
    _hasTimeout(playerName) {
        return this.playerTimeouts[playerName];
    }
    _setTimeout(playerName, timeoutId) {
        if (this.playerTimeouts[playerName]) {
            clearTimeout(this.playerTimeouts[playerName]);
        }
        this.playerTimeouts[playerName] = timeoutId;
    }
    _clearTimeout(playerName) {
        clearTimeout(this.playerTimeouts[playerName]);
        delete this.playerTimeouts[playerName];
    }
    getParty(partyName) {
        return this.parties[partyName];
    }
    static getInstance() {
        if (GameStateInstance) {
            return GameStateInstance;
        }
        GameStateInstance = new GameState();
        return GameStateInstance;
    }
    reAddPlayersInOrder(players) {
        this.players = _.reject(this.players, player => _.includes(_.map(players, 'name'), player.name));
        this.players.push(..._.filter(players, player => player.isPlayer));
    }
    addPlayer(playerName) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.getPlayer(playerName))
                return resolve(false);
            this.retrievePlayerFromDb(playerName)
                .then(player => {
                if (!player) {
                    return reject({ msg: messages_1.MESSAGES.NO_PLAYER });
                }
                player.choices = _.reject(player.choices, c => c.event === 'Party' || c.event === 'PartyLeave');
                this.players.push(player);
                resolve(player);
            });
        }));
    }
    delPlayer(playerName) {
        const remPlayer = _.find(this.players, { name: playerName });
        if (!remPlayer)
            return;
        this.players = _.without(this.players, remPlayer);
        remPlayer.isOnline = false;
        remPlayer.choices = _.reject(remPlayer.choices, c => c.event === 'Party' || c.event === 'PartyLeave');
        if (remPlayer.$battle) {
            remPlayer._hp.set(0);
        }
        if (remPlayer.$partyName) {
            remPlayer.party.playerLeave(remPlayer, true);
        }
        remPlayer.save();
    }
    getPlayer(playerName) {
        return _.find(this.players, { name: playerName });
    }
    getPlayers() {
        return this.players;
    }
    getPlayerNameSimple(playerName, keys) {
        return this.getPlayerSimple(this.getPlayer(playerName), keys, false);
    }
    getPlayerSimple(player, keys = UPDATE_KEYS, override = false) {
        if (!override) {
            keys = keys.concat(EXTRA_KEYS);
        }
        const obj = _.pick(player, keys);
        if (_.includes(keys, 'guildName')) {
            obj.guildTag = player.guild.tag;
            if (player.guildInvite)
                obj.guildInvite = true;
        }
        return obj;
    }
    getPlayersSimple(keys, override) {
        return _.map(this.players, p => this.getPlayerSimple(p, keys, override));
    }
    getSomePlayersSimple(playerNames, keys) {
        return _.compact(_.map(this.players, p => playerNames[p.name] ? this.getPlayerSimple(p, keys) : null));
    }
    retrievePlayerFromDb(playerName) {
        return this.playerLoad.loadPlayer(playerName);
    }
}
exports.GameState = GameState;
