"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const constitute_1 = require("constitute");
const db_wrapper_1 = require("../../shared/db-wrapper");
const messages_1 = require("../../static/messages");
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
const guild_1 = require("./guild");
let GuildsDb = class GuildsDb {
    constructor(DbWrapper) {
        this.dbWrapper = DbWrapper;
    }
    getGuilds() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const guilds = db.$$collections.guilds;
            return new Promise((resolve, reject) => {
                guilds.find({}, (err, docs) => {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    try {
                        docs.toArray((err, data) => {
                            const guildObj = {};
                            _.each(data, guild => {
                                const guildCont = di_wrapper_1.constitute(guild_1.Guild);
                                guildCont.init(guild);
                                guildObj[guildCont.name] = guildCont;
                            });
                            resolve(guildObj);
                        });
                    }
                    catch (e) {
                        logger_1.Logger.error('GuildsDb:getGuilds', e);
                        reject({ e, msg: messages_1.MESSAGES.GENERIC });
                    }
                });
            });
        });
    }
    getGuild(guildName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const guilds = db.$$collections.guilds;
            return new Promise((resolve, reject) => {
                guilds.findOne({ name: guildName }, (err, doc) => {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    const guildCont = di_wrapper_1.constitute(guild_1.Guild);
                    guildCont.init(doc);
                    resolve(guildCont);
                });
            });
        });
    }
    updateAllGuildMembersToNewGuild(oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.update({ guildName: oldName }, { $set: { guildName: newName } }, { multi: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }, reject);
            });
        });
    }
    renameGuild(oldName, newName, newTag) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const guilds = db.$$collections.guilds;
            return new Promise((resolve, reject) => {
                guilds.findOneAndUpdate({ name: oldName }, { $set: { name: newName, tag: newTag } }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }, reject);
            });
        });
    }
    removePlayerFromGuild(playerName, guildName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.findOneAndUpdate({ _id: playerName, guildName }, { $set: { guildName: '', guildInvite: null } }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }, reject);
            });
        });
    }
    removeGuild(guildObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const guilds = db.$$collections.guilds;
            return new Promise((resolve, reject) => {
                guilds.remove({ name: guildObject.name }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(guildObject);
                }, reject);
            });
        });
    }
    saveGuild(guildObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const saveObject = guildObject.buildSaveObject();
            const db = yield this.dbWrapper.connectionPromise();
            const guilds = db.$$collections.guilds;
            return new Promise((resolve, reject) => {
                guilds.findOneAndUpdate({ name: saveObject.name }, saveObject, { upsert: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(guildObject);
                }, reject);
            });
        });
    }
};
GuildsDb = __decorate([
    constitute_1.Dependencies(db_wrapper_1.DbWrapper),
    __metadata("design:paramtypes", [Object])
], GuildsDb);
exports.GuildsDb = GuildsDb;
