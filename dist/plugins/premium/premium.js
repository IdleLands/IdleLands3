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
const _ = require("lodash");
const game_state_1 = require("../../core/game-state");
const constitute_1 = require("constitute");
const logger_1 = require("../../shared/logger");
const settings_1 = require("../../static/settings");
const perks_1 = require("./perks");
let Premium = class Premium {
    constructor(container) {
        const PremiumDb = require('./premium.db').PremiumDb;
        try {
            container.schedulePostConstructor((premiumDb) => {
                this.premiumDb = premiumDb;
            }, [PremiumDb]);
        }
        catch (e) {
            logger_1.Logger.error('Premium', e);
        }
    }
    init(opts) {
        this._id = undefined;
        this.ilp = undefined;
        this.oneTimeItemsPurchased = undefined;
        this.donatorFirstTimeBonus = undefined;
        this.consumables = undefined;
        _.extend(this, opts);
        if (!_.isNumber(this.ilp)) {
            this.ilp = 0;
        }
        if (!this.consumables)
            this.consumables = {};
    }
    get buyable() {
        return perks_1.perks;
    }
    get genders() {
        return _(this.oneTimeItemsPurchased)
            .values()
            .filter(buy => buy.gender)
            .map('gender')
            .value();
    }
    canBuyIlp(player, ilp) {
        if (_.isNaN(ilp) || ilp <= 0)
            return false;
        return player.gold >= ilp * settings_1.SETTINGS.ilpConversionRate;
    }
    buyIlp(player, ilp) {
        player.gold -= ilp * settings_1.SETTINGS.ilpConversionRate;
        player.save();
        this.addIlp(ilp);
        player._updatePremium();
    }
    hasBought(item) {
        return this.oneTimeItemsPurchased[item.name];
    }
    getOneTimeUpgrade(item) {
        if (!this.oneTimeItemsPurchased)
            this.oneTimeItemsPurchased = {};
        this.oneTimeItemsPurchased[item.name] = item.oneTimeData;
    }
    cantBuy(player, item) {
        if (this.ilp < item.cost)
            return 'You do not have enough ILP to buy that.';
        if (this.hasBought(item))
            return 'You have already bought that upgrade.';
        if (item.requireAchievement && !player.$achievements.hasAchievement(item.requireAchievement))
            return `You need the ${item.requireAchievement} achievement to buy that!`;
        if (game_state_1.GameState.getInstance().hasFestival(player.name) && item.festivalData)
            return 'You already have an ongoing festival.';
    }
    buy(player, item) {
        if (item.festivalData) {
            game_state_1.GameState.getInstance().addFestival({
                name: `${player.name}'s ${item.name}`,
                message: `${player.name} bought the ${item.name} festival!`,
                startedBy: player.name,
                hourDuration: item.festivalDuration,
                bonuses: item.festivalData
            });
        }
        if (item.teleportData) {
            player.$playerMovement._doTeleport(player, item.teleportData);
        }
        if (item.oneTimeData) {
            this.getOneTimeUpgrade(item);
            player._updateGenders();
        }
        if (item.consumableKey) {
            this.addConsumable(item.consumableKey);
        }
        this.addIlp(-item.cost);
        player._updatePremium();
        this.save();
    }
    addConsumable(consumableKey) {
        this.consumables[consumableKey] = this.consumables[consumableKey] || 0;
        this.consumables[consumableKey]++;
    }
    canConsume(consumableKey) {
        return this.consumables[consumableKey] > 0;
    }
    consume(player, consumableKey) {
        this.consumables[consumableKey]--;
        player._updatePremium();
        this.save();
    }
    checkDonatorFirstTimeBonus(player) {
        if (this.donatorFirstTimeBonus)
            return;
        if (!player.$achievements.hasAchievement('Donator'))
            return;
        this.donatorFirstTimeBonus = true;
        this.addIlp(1000);
        player._updatePremium();
    }
    addIlp(ilp) {
        if (!this.ilp || !_.isNumber(this.ilp))
            this.ilp = 0;
        this.ilp += ilp;
        this.save();
    }
    save() {
        this.premiumDb.savePremium(this);
    }
};
Premium = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Premium);
exports.Premium = Premium;
