"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
class Equipment {
    constructor(opts) {
        _.extend(this, Equipment.defaults, opts);
        this.id = chance.guid();
        this.foundAt = Date.now();
        this._baseScore = this.score;
    }
    isUnderNormalPercent(player) {
        const boost = player._$maxItemBoost();
        return (this._calcScore / this._baseScore) < (3 + boost);
    }
    get isNormallyEnchantable() {
        return this.enchantLevel < 10;
    }
    get isNothing() {
        return this.name === 'nothing';
    }
    get score() {
        if (this.isNothing)
            return 0;
        let ret = 0;
        _.each(Equipment.multipliers, (mult, attr) => {
            if (!this[attr])
                return;
            ret += this[attr] * mult;
        });
        ret = ~~ret;
        this._calcScore = ret;
        return ret;
    }
    get fullname() {
        if (this.enchantLevel > 0)
            return `+${this.enchantLevel} ${this.name}`;
        return `${this.name}`;
    }
    __calcValueBasedOnStatHash(hash) {
        let ret = 0;
        _.each(hash, (mult, attr) => {
            if (!this[attr])
                return;
            ret += Math.max(0, Math.floor(this[attr] / mult));
        });
        return Math.max(0, ~~ret);
    }
    woodValue() {
        return this.__calcValueBasedOnStatHash(Equipment.woodStats);
    }
    stoneValue() {
        return this.__calcValueBasedOnStatHash(Equipment.stoneStats);
    }
    clayValue() {
        return this.__calcValueBasedOnStatHash(Equipment.clayStats);
    }
    astraliumValue() {
        return this.__calcValueBasedOnStatHash(Equipment.astraliumStats);
    }
}
Equipment.defaults = {
    itemClass: 'basic',
    str: 0,
    dex: 0,
    con: 0,
    agi: 0,
    int: 0,
    luk: 0,
    enchantLevel: 0
};
Equipment.multipliers = {
    str: 1.5,
    dex: 1,
    agi: 1,
    con: 2.5,
    int: 2,
    luk: 5,
    enchantLevel: -125,
    xp: 60,
    hp: 0.5,
    mp: 0.2,
    hpregen: 4,
    mpregen: 2,
    crit: 100,
    prone: 400,
    venom: 500,
    poison: 350,
    shatter: 300,
    vampire: 700,
    damageReduction: 2,
    damageReductionPercent: 1000,
    gold: 0.5,
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
    glowing: 300,
    salvage: 2000
};
Equipment.woodStats = {
    str: 25,
    dex: 25,
    hp: 100,
    hpregen: 25
};
Equipment.stoneStats = {
    con: 10,
    damageReduction: 25,
    damageReductionPercent: 1
};
Equipment.clayStats = {
    int: 25,
    agi: 25,
    mp: 100,
    mpregen: 25
};
Equipment.astraliumStats = {
    luk: 10,
    xp: 1,
    enchantLevel: 1,
    crit: 1,
    prone: 1,
    venom: 1,
    poison: 1,
    shatter: 1,
    vampire: 1,
    gold: 50,
    dance: 1,
    offense: 1,
    defense: 1,
    deadeye: 1,
    lethal: 1,
    vorpal: 1,
    silver: 1,
    power: 1,
    aegis: 1,
    glowing: 1,
    salvage: 1
};
exports.Equipment = Equipment;
