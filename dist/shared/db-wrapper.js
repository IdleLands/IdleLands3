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
const mongodb_1 = require("mongodb");
const logger_1 = require("./logger");
const connectionString = process.env.MONGODB_URI;
const mongoTag = `Mongo:${process.send ? 'Worker' : 'Core'}`;
const playerIndexes = [
    { gold: -1 },
    { 'statCache.luk': -1 },
    { allIps: 1, isMuted: 1 },
    { isOnline: 1 }
];
const statisticIndexes = [
    { 'stats.Character.Steps': -1 },
    { 'stats.Combat.Receive.Damage': -1 },
    { 'stats.Combat.Win': -1 },
    { 'stats.Combat.Kills.Player': -1 },
    { 'stats.Combat.Give.Damage': -1 },
    { 'stats.Character.Events': -1 },
    { 'stats.Character.Event.Providence': -1 },
    { 'stats.Combat.Kills.Monster': -1 },
    { 'stats.Character.Movement.Party': -1 },
    { 'stats.Character.Movement.Camping': -1 },
    { 'stats.Character.Movement.Drunk': -1 },
    { 'stats.Character.Terrains.Acid': -1 },
    { 'stats.Combat.Give.Overkill': -1 },
    { 'stats.Character.Movement.Solo': -1 },
    { 'stats.Character.Ascension.Gold': -1 },
    { 'stats.Character.Ascension.ItemScore': -1 },
    { 'stats.Character.Ascension.CollectiblesFound': -1 }
];
const achievementIndexes = [
    { uniqueAchievements: -1 },
    { totalTitles: -1 }
];
const collectibleIndexes = [
    { uniqueCollectibles: -1 }
];
const petIndexes = [
    { activePetId: 1 }
];
const guildIndexes = [
    { name: 1 }
];
let globalPromise;
class DbWrapper {
    static get promise() {
        return globalPromise;
    }
    connectionPromise() {
        if (globalPromise) {
            return globalPromise;
        }
        globalPromise = new Promise((resolve, reject) => {
            logger_1.Logger.info(mongoTag, 'Connecting to database...');
            mongodb_1.MongoClient.connect(connectionString, {
                native_parser: true,
                poolSize: 10,
                autoReconnect: true,
                keepAlive: 1,
                connectTimeoutMS: 120000,
                socketTimeoutMS: 120000
            }, (err, db) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    logger_1.Logger.error('DB:Init', err);
                    return reject(err);
                }
                db.on('close', () => {
                    try {
                        db.open();
                        logger_1.Logger.info('DB:Close', 'Attempted reopen.');
                    }
                    catch (e) {
                        logger_1.Logger.error('DB:Close', e);
                    }
                });
                db.on('error', e => {
                    logger_1.Logger.error('DB:Err', e);
                });
                db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
                db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);
                if (_.isUndefined(process.env.INSTANCE_NUMBER) || process.env.INSTANCE_NUMBER == 0) {
                    db.collection('players').updateMany({}, { $set: { isOnline: false } });
                }
                db.collection('battles').createIndex({ happenedAt: 1 }, { expireAfterSeconds: 450 }, _.noop);
                db.collection('guilds').createIndex({ name: 1 }, { unique: true }, _.noop);
                db.collection('guilds').createIndex({ tag: 1 }, { unique: true }, _.noop);
                _.each(playerIndexes, index => db.collection('players').createIndex(index, _.noop));
                _.each(statisticIndexes, index => db.collection('statistics').createIndex(index, _.noop));
                _.each(achievementIndexes, index => db.collection('achievements').createIndex(index, _.noop));
                _.each(collectibleIndexes, index => db.collection('collectibles').createIndex(index, _.noop));
                _.each(petIndexes, index => db.collection('pets').createIndex(index, _.noop));
                _.each(guildIndexes, index => db.collection('guilds').createIndex(index, _.noop));
                logger_1.Logger.info(mongoTag, 'Connected!');
                db.$$collections = {
                    achievements: db.collection('achievements'),
                    battles: db.collection('battles'),
                    collectibles: db.collection('collectibles'),
                    personalities: db.collection('personalities'),
                    pets: db.collection('pets'),
                    players: db.collection('players'),
                    statistics: db.collection('statistics'),
                    festivals: db.collection('festivals'),
                    premiums: db.collection('premiums'),
                    guilds: db.collection('guilds')
                };
                resolve(db);
            }));
        });
        return globalPromise;
    }
}
exports.DbWrapper = DbWrapper;
