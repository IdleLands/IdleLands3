
import * as _ from 'lodash';

import { GameState } from '../../core/game-state';

import { Dependencies, Container } from 'constitute';
import { Logger } from '../../shared/logger';
import { SETTINGS } from '../../static/settings';

import { perks } from './perks';

@Dependencies(Container)
export class Premium {
  constructor(container) {
    const PremiumDb = require('./premium.db').PremiumDb;
    try {
      container.schedulePostConstructor((premiumDb) => {
        this.premiumDb = premiumDb;
      }, [PremiumDb]);
    } catch (e) {
      Logger.error('Premium', e);
    }
  }

  init(opts) {
    this._id = undefined;
    this.ilp = undefined;
    this.oneTimeItemsPurchased = undefined;
    this.donatorFirstTimeBonus = undefined;
    this.consumables = undefined;

    _.extend(this, opts);

    if(!_.isNumber(this.ilp)) {
      this.ilp = 0;
    }

    if(!this.consumables) this.consumables = {};
  }

  get buyable() {
    return perks;
  }

  get genders() {
    return _(this.oneTimeItemsPurchased)
      .values()
      .filter(buy => buy.gender)
      .map('gender')
      .value();
  }

  canBuyIlp(player, ilp) {
    if(_.isNaN(ilp) || ilp <= 0) return false;
    return player.gold >= ilp * SETTINGS.ilpConversionRate;
  }

  buyIlp(player, ilp) {
    player.gold -= ilp * SETTINGS.ilpConversionRate;
    player.save();

    this.addIlp(ilp);

    player._updatePremium();
  }

  hasBought(item) {
    return this.oneTimeItemsPurchased[item.name];
  }

  getOneTimeUpgrade(item) {
    if(!this.oneTimeItemsPurchased) this.oneTimeItemsPurchased = {};
    this.oneTimeItemsPurchased[item.name] = item.oneTimeData;
  }

  cantBuy(player, item) {
    if(this.ilp < item.cost) return 'You do not have enough ILP to buy that.';
    if(this.hasBought(item)) return 'You have already bought that upgrade.';
    if(GameState.getInstance().hasFestival(player.name) && item.festivalData) return 'You already have an ongoing festival.';
  }

  buy(player, item) {
    if(item.festivalData) {
      GameState.getInstance().addFestival({
        name: `${player.name}'s ${item.name}`,
        message: `${player.name} bought the ${item.name} festival!`,
        startedBy: player.name,
        hourDuration: item.festivalDuration,
        bonuses: item.festivalData
      });
    }

    if(item.teleportData) {
      player.$playerMovement._doTeleport(player, item.teleportData);
    }

    if(item.oneTimeData) {
      this.getOneTimeUpgrade(item);
      player._updateGenders();
    }

    if(item.consumableKey) {
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
    if(this.donatorFirstTimeBonus) return;
    if(!player.$achievements.hasAchievement('Donator')) return;

    this.donatorFirstTimeBonus = true;
    this.addIlp(1000);
    player._updatePremium();
  }

  addIlp(ilp) {
    if(!this.ilp || !_.isNumber(this.ilp)) this.ilp = 0;
    this.ilp += ilp;
    this.save();
  }

  save() {
    this.premiumDb.savePremium(this);
  }
}
