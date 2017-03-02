
import * as _ from 'lodash';

import { GameState } from '../../core/game-state';

import { Dependencies, Container } from 'constitute';
import { Logger } from '../../shared/logger';

import { perks } from './perks';

const CONVERSION_RATE = 20000;

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

    _.extend(this, opts);

    if(!_.isNumber(this.ilp)) {
      this.ilp = 0;
    }
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

  get ILP_CONVERSION_RATE() {
    return CONVERSION_RATE;
  }

  canBuyIlp(player, ilp) {
    if(_.isNaN(ilp) || ilp <= 0) return false;
    return player.gold >= ilp * this.ILP_CONVERSION_RATE;
  }

  buyIlp(player, ilp) {
    player.gold -= ilp * this.ILP_CONVERSION_RATE;
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

    if(item.oneTimeData) {
      this.getOneTimeUpgrade(item);
      player._updateGenders();
    }

    this.addIlp(-item.cost);
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
    if(!this.ilp) this.ilp = 0;
    this.ilp += ilp;
    this.save();
  }

  save() {
    this.premiumDb.savePremium(this);
  }
}
