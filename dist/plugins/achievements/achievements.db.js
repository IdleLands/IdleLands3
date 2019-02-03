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
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
const achievements_1 = require("./achievements");
let AchievementsDb = class AchievementsDb {
    constructor(DbWrapper) {
        this.dbWrapper = DbWrapper;
    }
    getAchievements(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const achievements = db.$$collections.achievements;
            return new Promise((resolve, reject) => {
                achievements.find({ _id: id }).limit(1).next((err, doc) => {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    try {
                        const achievements = di_wrapper_1.constitute(achievements_1.Achievements);
                        achievements.init(doc);
                        resolve(achievements);
                    }
                    catch (e) {
                        logger_1.Logger.error('AchievementsDb:getAchievements', e);
                        reject({ e, msg: messages_1.MESSAGES.GENERIC });
                    }
                });
            });
        });
    }
    saveAchievements(achievementsObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const achievements = db.$$collections.achievements;
            return new Promise((resolve) => {
                achievements.updateOne({ _id: achievementsObject._id }, { $set: {
                        achievements: achievementsObject.achievements,
                        uniqueAchievements: achievementsObject.uniqueAchievements,
                        totalAchievementTiers: achievementsObject.totalAchievementTiers,
                        totalTitles: achievementsObject.totalTitles
                    } }, { upsert: true }, (err) => {
                    if (err) {
                        // FIXME somehow this periodically throws 'duplicate key error'
                        return; // reject(err);
                    }
                    resolve(achievements);
                });
            });
        });
    }
};
AchievementsDb = __decorate([
    constitute_1.Dependencies(db_wrapper_1.DbWrapper),
    __metadata("design:paramtypes", [Object])
], AchievementsDb);
exports.AchievementsDb = AchievementsDb;
