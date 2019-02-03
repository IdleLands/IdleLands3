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
const constitute_1 = require("constitute");
const db_wrapper_1 = require("../../shared/db-wrapper");
const messages_1 = require("../../static/messages");
let PlayerDb = class PlayerDb {
    constructor(dbWrapper) {
        this.dbWrapper = dbWrapper;
    }
    getPlayer(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.find(opts).limit(1).next((err, doc) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    if (!doc) {
                        return reject({ err, msg: messages_1.MESSAGES.NO_PLAYER });
                    }
                    resolve(doc);
                }));
            });
        });
    }
    getOffenses(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.find({ allIps: ip, isMuted: true }).limit(1).next((err, doc) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    resolve(doc);
                }));
            });
        });
    }
    createPlayer(playerObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.insertOne(playerObject, (err) => {
                    if (err)
                        return reject(err);
                    resolve(playerObject);
                });
            });
        });
    }
    savePlayer(playerObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const savePlayerObject = playerObject.buildSaveObject();
            const db = yield this.dbWrapper.connectionPromise();
            const players = db.$$collections.players;
            return new Promise((resolve, reject) => {
                players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(playerObject);
                }, reject);
            });
        });
    }
};
PlayerDb = __decorate([
    constitute_1.Dependencies(db_wrapper_1.DbWrapper),
    __metadata("design:paramtypes", [Object])
], PlayerDb);
exports.PlayerDb = PlayerDb;
