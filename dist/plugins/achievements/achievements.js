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
Object.defineProperty(exports, "__esModule", { value: true });
const constitute_1 = require("constitute");
const _ = require("lodash");
const AllAchievements = require("./achievements/_all");
const logger_1 = require("../../shared/logger");
const settings_1 = require("../../static/settings");
const PREMIUM_TITLES = [
    'Donator',
    'Contributor'
];
const PREMIUM_TIERS = {
    Donator: 1,
    Contributor: 2
};
let Achievements = class Achievements {
    constructor(container) {
        const AchievementsDb = require('./achievements.db').AchievementsDb;
        try {
            container.schedulePostConstructor((achievementsDb) => {
                this.achievementsDb = achievementsDb;
            }, [AchievementsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Achievements', e);
        }
    }
    // clear current variables and set new
    init(opts) {
        this._id = undefined;
        this.achievements = undefined;
        _.extend(this, opts);
        if (!this.achievements)
            this.achievements = {};
        if (!this.uniqueAchievements) {
            this.save();
        }
    }
    premiumTier() {
        const tiers = _.intersection(PREMIUM_TITLES, this.titles());
        if (tiers.length === 0)
            return 0;
        return PREMIUM_TIERS[_.maxBy(tiers, tier => PREMIUM_TIERS[tier])];
    }
    genders() {
        return _(this.achievements)
            .values()
            .map(achi => achi.rewards)
            .flattenDeep()
            .compact()
            .filter(reward => reward.type === 'gender')
            .map(reward => reward.gender)
            .value();
    }
    petAttributes() {
        return _(this.achievements)
            .values()
            .map(achi => achi.rewards)
            .flattenDeep()
            .compact()
            .filter(reward => reward.type === 'petattr')
            .map(reward => reward.petattr)
            .value().concat(settings_1.SETTINGS.validPetAttributes);
    }
    petClasses() {
        return _(this.achievements)
            .values()
            .map(achi => achi.rewards)
            .flattenDeep()
            .compact()
            .filter(reward => reward.type === 'petclass')
            .map(reward => reward.petclass)
            .value().concat(['Monster']);
    }
    titles() {
        return _(this.achievements)
            .values()
            .map(achi => achi.rewards)
            .flattenDeep()
            .compact()
            .filter(reward => reward.type === 'title')
            .map(reward => reward.title)
            .value();
    }
    getDeathMessageForTitle(title) {
        const titleReward = _(this.achievements)
            .values()
            .map(achi => achi.rewards)
            .flattenDeep()
            .compact()
            .filter(reward => reward.type === 'title')
            .filter(reward => reward.title === title)
            .value()[0];
        if (titleReward)
            return titleReward.deathMessage;
        return '';
    }
    tiers() {
        return _(this.achievements)
            .values()
            .flattenDeep()
            .map('tier')
            .sum();
    }
    _allAchievements(player) {
        return _(AllAchievements)
            .values()
            .map(ach => {
            return ach.achievementData(player) || [];
        })
            .flattenDeep()
            .compact()
            .value();
    }
    addAchievement(achievement) {
        this.achievements[achievement.name] = achievement;
    }
    hasAchievement(achievement) {
        return this.achievements && this.achievements[achievement];
    }
    hasAchievementAtTier(achievement, tier) {
        return this.hasAchievement(achievement) && this.achievements[achievement].tier >= tier;
    }
    checkAchievements(player) {
        try {
            const earned = this._allAchievements(player);
            const mine = this.achievements;
            const newAchievements = [];
            _.each(earned, ach => {
                if (mine[ach.name] && mine[ach.name].tier >= ach.tier)
                    return;
                newAchievements.push(ach);
            });
            // always update the achievement data just in case
            this.achievements = {};
            _.each(earned, ach => {
                this.addAchievement(ach);
            });
            this.save();
            if (newAchievements.length > 0) {
                player.recalculateStats();
            }
            logger_1.Logger.silly('Achievement', 'Done');
            return newAchievements;
        }
        catch (e) {
            logger_1.Logger.error('wat', e);
        }
    }
    uniqueAchievementCount() {
        return _.size(this.achievements);
    }
    save() {
        this.uniqueAchievements = this.uniqueAchievementCount();
        this.totalAchievementTiers = this.tiers();
        this.totalTitles = this.titles().length;
        this.achievementsDb.saveAchievements(this);
    }
};
Achievements = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Achievements);
exports.Achievements = Achievements;
