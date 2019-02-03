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
const player_1 = require("./player");
const player_db_1 = require("./player.db");
const statistics_1 = require("../statistics/statistics");
const statistics_db_1 = require("../statistics/statistics.db");
const achievements_1 = require("../achievements/achievements");
const achievements_db_1 = require("../achievements/achievements.db");
const personalities_1 = require("../personalities/personalities");
const personalities_db_1 = require("../personalities/personalities.db");
const collectibles_1 = require("../collectibles/collectibles");
const collectibles_db_1 = require("../collectibles/collectibles.db");
const pets_1 = require("../pets/pets");
const pets_db_1 = require("../pets/pets.db");
const premium_1 = require("../premium/premium");
const premium_db_1 = require("../premium/premium.db");
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
let PlayerLoad = class PlayerLoad {
    constructor(playerDb, statisticsDb, achievementsDb, personalitiesDb, collectiblesDb, petsDb, premiumDb) {
        this.playerDb = playerDb;
        this.statisticsDb = statisticsDb;
        this.achievementsDb = achievementsDb;
        this.personalitiesDb = personalitiesDb;
        this.collectiblesDb = collectiblesDb;
        this.petsDb = petsDb;
        this.premiumDb = premiumDb;
    }
    loadPremium(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.premiumLink) {
                const premObj = di_wrapper_1.constitute(premium_1.Premium);
                premObj.init({ _id: player.name, ilp: 0, oneTimeItemsPurchased: {}, purchaseHistory: [] });
                yield this.premiumDb.savePremium(premObj);
                player.premiumLink = player.name;
                player.$premium = premObj;
            }
            else {
                player.$premium = yield this.premiumDb.getPremium(player.name);
            }
        });
    }
    loadPets(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.petsLink) {
                const petsObj = di_wrapper_1.constitute(pets_1.Pets);
                petsObj.init({ _id: player.name, activePetId: '', earnedPets: [], earnedPetData: {} });
                yield this.petsDb.savePets(petsObj);
                player.petsLink = player.name;
                player.$pets = petsObj;
            }
            else {
                player.$pets = yield this.petsDb.getPets(player.name);
            }
        });
    }
    loadStatistics(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.statisticsLink) {
                const statisticsObj = di_wrapper_1.constitute(statistics_1.Statistics);
                statisticsObj.init({ _id: player.name, stats: {} });
                yield this.statisticsDb.saveStatistics(statisticsObj);
                player.statisticsLink = player.name;
                player.$statistics = statisticsObj;
            }
            else {
                player.$statistics = yield this.statisticsDb.getStatistics(player.name);
            }
        });
    }
    loadAchievements(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.achievementsLink) {
                const achievementsObj = di_wrapper_1.constitute(achievements_1.Achievements);
                achievementsObj.init({ _id: player.name, achievements: {}, uniqueAchievements: 0 });
                yield this.achievementsDb.saveAchievements(achievementsObj);
                player.achievementsLink = player.name;
                player.achievementsLink = player.name;
                player.$achievements = achievementsObj;
            }
            else {
                player.$achievements = yield this.achievementsDb.getAchievements(player.name);
            }
        });
    }
    loadPersonalities(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.personalitiesLink) {
                const personalitiesObj = di_wrapper_1.constitute(personalities_1.Personalities);
                personalitiesObj.init({ _id: player.name, activePersonalities: {}, earnedPersonalities: [] });
                yield this.personalitiesDb.savePersonalities(personalitiesObj);
                player.personalitiesLink = player.name;
                player.$personalities = personalitiesObj;
            }
            else {
                player.$personalities = yield this.personalitiesDb.getPersonalities(player.name);
            }
        });
    }
    loadCollectibles(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!player.collectiblesLink) {
                const collectiblesObj = di_wrapper_1.constitute(collectibles_1.Collectibles);
                collectiblesObj.init({ _id: player.name, collectibles: {}, uniqueCollectibles: 0 });
                yield this.collectiblesDb.saveCollectibles(collectiblesObj);
                player.collectiblesLink = player.name;
                player.$collectibles = collectiblesObj;
            }
            else {
                player.$collectibles = yield this.collectiblesDb.getCollectibles(player.name);
            }
        });
    }
    loadPlayer(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerObj = yield this.playerDb.getPlayer({ _id: playerId });
            try {
                const player = di_wrapper_1.constitute(player_1.Player);
                player.init(playerObj);
                yield Promise.all([
                    this.loadStatistics(player),
                    this.loadAchievements(player),
                    this.loadPersonalities(player),
                    this.loadCollectibles(player),
                    this.loadPets(player),
                    this.loadPremium(player)
                ]);
                player.$personalities.checkPersonalities(player);
                player.$pets.restorePetData(player);
                player.$pets.checkPets(player);
                player.$premium.checkDonatorFirstTimeBonus(player);
                if (player.hasGuild) {
                    player.guild.verifyPlayer(player);
                }
                player.isOnline = true;
                player.recalculateStats();
                return player;
            }
            catch (e) {
                logger_1.Logger.error('PlayerLoad:loadPlayer', e);
                throw (e);
            }
        });
    }
};
PlayerLoad = __decorate([
    constitute_1.Dependencies(player_db_1.PlayerDb, statistics_db_1.StatisticsDb, achievements_db_1.AchievementsDb, personalities_db_1.PersonalitiesDb, collectibles_db_1.CollectiblesDb, pets_db_1.PetsDb, premium_db_1.PremiumDb),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], PlayerLoad);
exports.PlayerLoad = PlayerLoad;
