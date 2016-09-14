
import _ from 'lodash';
import Chance from 'chance';
const chance = new Chance();

export class Equipment {
  static defaults = {
    itemClass: 'basic',
    str: 0,
    dex: 0,
    con: 0,
    agi: 0,
    int: 0,
    luk: 0,
    enchantLevel: 0
  };

  static multipliers = {
    str: 1.5,
    dex: 1,
    agi: 1,
    con: 3.5,
    int: 2,
    luk: 5,
    enchantLevel: -125,
    xp: 50,
    hp: 0.5,
    mp: 0.2,
    hpregen: 4,
    mpregen: 2,
    crit: 100,
    prone: 100,
    venom: 200,
    poison: 200,
    shatter: 300,
    vampire: 300,
    damageReduction: 25,
    sentimentality: 1,
    dance: 100,
    defense: 100,
    offense: 100,
    deadeye: 100,
    lethal: 200,
    silver: 100,
    power: 100,
    vorpal: 500,
    aegis: 100,
    glowing: 300
  };

  constructor(opts) {
    _.extend(this, Equipment.defaults, opts);
    this.id = chance.guid();
    this.foundAt = Date.now();
    this._baseScore = this.score;
  }

  get isNormallyEnchantable() {
    return this.enchantLevel < 10;
  }

  get isUnderNormalPercent() {
    return (this._calcScore/this._baseScore) < 3;
  }

  get isNothing() {
    return this.name === 'nothing';
  }

  get score() {
    let ret = 0;
    _.each(Equipment.multipliers, (mult, attr) => {
      if(!this[attr]) return;
      ret += this[attr] * mult;
    });
    ret = ~~ret;
    this._calcScore = ret;
    return ret;
  }

  get fullname() {
    if(this.enchantLevel > 0) return `+${this.enchantLevel} ${this.name}`;
    return `${this.name}`;
  }
}