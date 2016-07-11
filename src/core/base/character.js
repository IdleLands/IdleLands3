
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

import { Equipment } from '../base/equipment';

import { StatCalculator } from '../../shared/stat-calculator';

export class Character {

  init(opts) {

    _.extend(this, opts);
    if(!this.name) Logger.error('Player', new Error('No name specified.'), opts);

    if(!this._hp)      this._hp = { minimum: 0, maximum: 20, __current: 20 };
    if(!this._mp)      this._mp = { minimum: 0, maximum: 0, __current: 0 };
    if(!this._xp)      this._xp = { minimum: 0, maximum: this.levelUpXpCalc(1), __current: 0 };
    if(!this._level)   this._level = { minimum: 0, maximum: SETTINGS.maxLevel, __current: 1 };
    if(!this._special) this._special = { minimum: 0, maximum: 0, __current: 0 };

    this._level.maximum = SETTINGS.maxLevel;

    _.each(['_hp', '_mp', '_xp', '_level', '_special'], stat => {
      if(_.isNaN(this[stat].__current)) this[stat].__current = 0;
      this[stat].__proto__ = RestrictedNumber.prototype;
    });

    _.each(_.values(this.equipment), item => item.__proto__ = Equipment.prototype);

    if(!this.gender)          this.gender = _.sample(['male', 'female']);
    if(!this.professionName)  this.professionName = 'Generalist';
    if(!this.equipment)       this.equipment = {};
    if(!this.statCache)       this.statCache = {};

    this.$stats = new Proxy({}, {
      get: (target, name) => {
        if(_.includes(['str', 'con', 'dex', 'int', 'agi', 'luk', 'xp', 'gold'], name)) {
          return StatCalculator.stat(this, name);
        }

        return StatCalculator[name](this);
      }
    });

    this.changeProfession(this.professionName);
  }

  get hp() { return this._hp.__current; }
  get mp() { return this._mp.__current; }
  get xp() { return this._xp.__current; }
  get level() { return this._level.__current; }
  get special() { return this._special.__current; }
  get profession() { return this.$profession; }
  get liveStats() { return this.$stats; }
  get stats() { return this.statCache; }

  recalculateStats() {
    const hpVal = StatCalculator.hp(this);
    this._hp.maximum = this._hp.__current = hpVal;

    const mpVal = StatCalculator.mp(this);
    this._mp.maximum = this._mp.__current = mpVal;

    _.each(['str', 'dex', 'con', 'int', 'agi', 'luk'], stat => {
      this.statCache[stat] = this.liveStats[stat];
    });
  }

  changeProfession(professionName) {
    if(this.$profession) this.$profession.unload(this);
    this.professionName = professionName;
    this.$profession = require(`../professions/${professionName}`)[professionName];
    this.$profession.load(this);
    this.recalculateStats();
  }

  calcLuckBonusFromValue(value = this.liveStats.luk) {
    const tiers = [1, 2, 3, 4, 5, 6, 8, 10, 15, 35, 50, 65, 85, 100, 125, 175, 200, 250, 400, 450, 500];

    const postMaxTierDifference = 100;

    let bonus = 0;

    for(let i = 0; i < tiers.length; i++) {
      if(value >= tiers[i]) {
        bonus++;
      }
    }

    let postmax = tiers[tiers.length - 1] + postMaxTierDifference;
    if(value >= tiers[tiers.length - 1]) {
      while(value > postmax) {
        bonus++;
        postmax += postMaxTierDifference;
      }
    }

    return bonus;
  }

  canEquip(item, rangeBoostMultiplier = 1) {
    const myItem = this.equipment[item.type];
    const checkScore = item.score;
    const myScore = myItem.score;

    return checkScore > (myScore * 0.75) && checkScore < rangeBoostMultiplier * this.liveStats.itemFindRange;
  }

  equip(item) {
    this.equipment[item.type] = item;
    this.recalculateStats();

    if(this.$statistics) {
      this.$statistics.incrementStat('Character.Item.Equip');
    }
  }

  resetMaxXp() {
    this._xp.maximum = this.levelUpXpCalc(this.level);
  }

  levelUpXpCalc(level) {
    return Math.floor(100 + (400 * Math.pow(level, 1.71)));
  }

  gainGold(gold = 1) {
    this.gold += gold;
    if(this.gold < 0 || _.isNaN(this.gold)) {
      this.gold = 0;
    }
  }

  gainXp(xp = 1) {
    this._xp.add(xp);
  }

  sellItem(item) {
    const value = Math.max(1, Math.floor(item.score * this.liveStats.itemValueMultiplier));
    this.$statistics.incrementStat('Character.Item.Sell');
    this.gainGold(value);
    return value;
  }
}