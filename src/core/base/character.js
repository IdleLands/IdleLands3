
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';
import { GameState } from '../game-state';


import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

import { Equipment } from '../base/equipment';
import { SpellManager } from '../../plugins/combat/spellmanager';
import { EffectManager } from '../../plugins/combat/effectmanager';

import { StatCalculator } from '../../shared/stat-calculator';
import { Generator } from './generator.js';

export class Character {

  init(opts) {

    _.extend(this, opts);
    if(!this.name) Logger.error('Player', new Error('No name specified.'), opts);

    if(!this._hp)      this._hp = { minimum: 0, maximum: 20, __current: 20 };
    if(!this._mp)      this._mp = { minimum: 0, maximum: 0, __current: 0 };
    if(!this._xp)      this._xp = { minimum: 0, maximum: this.levelUpXpCalc(1), __current: 0 };
    if(!this._level)   this._level = { minimum: 0, maximum: SETTINGS.maxLevel, __current: this.levelSet || 1 };
    if(!this._special) this._special = { minimum: 0, maximum: 0, __current: 0 };

    if(this._level.maximum < SETTINGS.maxLevel) {
      this._level.maximum = SETTINGS.maxLevel;
    }

    _.each(['_hp', '_mp', '_xp', '_level', '_special'], stat => {
      if(_.isNaN(this[stat].__current)) this[stat].__current = 0;
      this[stat].__proto__ = RestrictedNumber.prototype;
    });

    _.each(_.flatten(_.values(this.equipment)), item => item.__proto__ = Equipment.prototype);

    if(!this.gender)          this.gender = _.sample(['male', 'female']);
    if(!this.professionName)  this.professionName = 'Generalist';
    if(!this.equipment)       this.equipment = {};
    if(!this.statCache)       this.statCache = {};

    this.$effects = new EffectManager();

    this.$stats = new Proxy({}, {
      get: (target, name) => {
        if(_.includes(Generator.stats, name)) {
          return StatCalculator.stat(this, name);
        }

        try {
          return StatCalculator[name](this);
        } catch(e) {
          Logger.error('Character: $stats', e, { name });
        }
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
  get fullname() { return this.name; }

  get party() {
    if(!this.$partyName) return null;
    return GameState.getInstance().getParty(this.$partyName);
  }

  get itemScore() {
    return _.reduce(_.flatten(_.values(this.equipment)), (prev, cur) => {
      return prev + cur.score;
    }, 0);
  }

  get spells() {
    return SpellManager.validSpells(this);
  }

  get isPlayer() { return this.joinDate; }

  recalculateStats() {
    const hpVal = StatCalculator.hp(this);
    this._hp.maximum = this._hp.__current = hpVal + (this.hpBoost || 0);

    const mpVal = StatCalculator.mp(this);
    this._mp.maximum = this._mp.__current = mpVal + (this.mpBoost || 0);

    _.each(['str', 'dex', 'con', 'int', 'agi', 'luk', 'itemFindRange'], stat => {
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
    const tiers = [1, 2, 4, 6, 10, 20, 35, 65, 125, 175, 200, 250, 400, 450, 500];

    const postMaxTierDifference = 150;

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
    const myScore = myItem ? myItem.score : -1000;

    const checkRangeMultiplier = this.$personalities && this.$personalities.isActive('SharpEye') ? 0.65 : 0.05;
    return checkScore > (myScore * checkRangeMultiplier) && checkScore < rangeBoostMultiplier * this.liveStats.itemFindRange;
  }

  equip(item) {
    item._hasEquipped = true;
    this.equipment[item.type] = item;
    this.recalculateStats();

    if(this.$statistics) {
      this.$statistics.incrementStat('Character.Item.Equip');
    }
  }

  levelUp() {
    this._level.add(1);
    this.resetMaxXp();
    this._xp.toMinimum();
    this.recalculateStats();
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

    if(this.$statistics) {
      this.$statistics.incrementStat('Character.Item.Sell');
    }

    this.gainGold(value);
    return value;
  }
}