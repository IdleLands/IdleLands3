
import * as _ from 'lodash';
import * as RestrictedNumber from 'restricted-number';
import { GameState } from '../game-state';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

import { Equipment } from '../base/equipment';
import { SpellManager } from '../../plugins/combat/spellmanager';
import { EffectManager } from '../../plugins/combat/effectmanager';

import { StatCalculator, ALL_STATS } from '../../shared/stat-calculator';
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

    if(this._xp.__current > this._xp.maximum) {
      this._xp.__current = this._xp.maximum;
    }

    _.each(['_hp', '_mp', '_xp', '_level', '_special'], stat => {
      if(_.isNaN(this[stat].__current)) this[stat].__current = 0;
      this[stat].__proto__ = RestrictedNumber.prototype;
    });

    _.each(_.compact(_.flatten(_.values(this.equipment))), item => {
      delete item.isUnderNormalPercent;
      delete item.isNormallyEnchantable;
      delete item.isNothing;
      delete item.score;
      delete item.fullname;

      item.__proto__ = Equipment.prototype;
    });

    if(!this.gender)          this.gender = _.sample(['male', 'female']);
    if(!this.professionName)  this.professionName = 'Generalist';
    if(!this.equipment)       this.equipment = {};
    if(!this.statCache)       this.statCache = {};

    this.$effects = new EffectManager();

    this.$stats = new Proxy({}, {
      get: (target, name) => {
        if(_.includes(Generator.stats, name) && !_.includes(['gold', 'xp'], name)) {
          return StatCalculator.stat(this, name);
        }

        if(!StatCalculator[name]) return null;

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

  randomDeathMessage() {
    return _.sample([
      '%player watched %hisher innards become outards.',
      '%player vanished into thin air.',
      '%player has died.',
      '%player isn\'t pining for the fjords!',
      '%player has passed on.',
      '%player has gone to meet their maker.',
      '%player\'s a stiff!',
      'Bereft of life, %player can finally rest in pieces.',
      '%player\'s metabolic processes are now history!',
      '%player kicked the bucket, and the bucket kicked back!'
    ]);
  }

  get deathMessage() {
    return this._deathMessage;
  }

  get party() {
    if(!this.$partyName) return null;
    return GameState.getInstance().getParty(this.$partyName);
  }

  get itemScore() {
    return _.reduce(_.flatten(_.values(this.equipment)), (prev, cur) => {
      return prev + cur.score;
    }, 0);
  }

  get score() {
    return this.itemScore;
  }

  get spells() {
    return SpellManager.validSpells(this);
  }

  get isPlayer() { return this.joinDate; }

  recalculateStats(otherStats = ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier'])) {
    _.each(otherStats, stat => {
      const val = this.liveStats[stat];
      if(_.includes(['xp', 'gold'], stat)) return;
      this.statCache[stat] = val;
    });

    const hpVal = StatCalculator.hp(this);
    this._hp.maximum = this._hp.__current = hpVal + (this.hpBoost || 0);

    const mpVal = StatCalculator.mp(this);
    this._mp.maximum = this._mp.__current = mpVal + (this.mpBoost || 0);
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

  canEquip(item, rangeBoostMultiplier = 1, useCheckRangeMultiplier = true) {
    const myItem = this.equipment[item.type];
    const checkScore = item.score;
    const myScore = myItem ? myItem.score : -1000;
    const itemFindRange = rangeBoostMultiplier * this.liveStats.itemFindRange;

    let checkRangeMultiplier = this.$personalities && this.$personalities.isActive('SharpEye') ? 0.65 : 0.05;
    if(!useCheckRangeMultiplier) {
      checkRangeMultiplier = 0;
    }
    return checkScore > 0 && checkScore > (myScore * checkRangeMultiplier) && checkScore <= itemFindRange;
  }

  equip(item) {
    item._wasEquipped = true;
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
    let xp = Math.floor(100 + (400 * Math.pow(level, 1.71)));

    if(level > 200) {
      const modifier = level - 200;
      xp += (xp * (modifier / 100));

      if(level >= this._level.maximum - SETTINGS.ascensionLevelBoost) {
        const levelsTilMax = this._level.maximum - level;
        const multiplier = SETTINGS.ascensionXpCurve * (SETTINGS.ascensionLevelBoost - levelsTilMax);

        xp += (xp * (multiplier / 100));
      }
    }

    return Math.floor(xp);
  }

  gainGold(gold = 1) {
    this.gold += gold;
    if(this.gold < 0 || _.isNaN(this.gold)) {
      this.gold = 0;
    }
    return gold;
  }

  gainXp(xp = 1) {
    this._xp.add(xp);
    return xp;
  }

  sellItem(item) {
    const value = Math.max(1, Math.floor(item.score * this.liveStats.itemValueMultiplier));
    const maxValue = this.liveStats.itemFindRange * 10;

    if(this.$statistics) {
      this.$statistics.incrementStat('Character.Item.Sell');
    }

    const gold = this.gainGold(value);
    return Math.min(maxValue, gold);
  }
}
