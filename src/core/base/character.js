
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';

export class Character {

  constructor(opts) {

    _.extend(this, opts);
    if(!this.name) Logger.error('Player', new Error('No name specified.'), opts);

    if(!this._hp)      this._hp = { minimum: 0, maximum: 20, __current: 20 };
    if(!this._mp)      this._mp = { minimum: 0, maximum: 0, __current: 0 };
    if(!this._xp)      this._xp = { minimum: 0, maximum: this.levelUpXpCalc(1), __current: 0 };
    if(!this._level)   this._level = { minimum: 0, maximum: SETTINGS.maxLevel, __current: 1 };
    if(!this._special) this._special = { minimum: 0, maximum: 0, __current: 0 };

    _.each(['_hp', '_mp', '_xp', '_level', '_special'], stat => {
      if(_.isNaN(this[stat].__current)) this[stat].__current = 0;
      this[stat].__proto__ = RestrictedNumber.prototype;
    });

    if(!this.gender)   this.gender = _.sample(['male', 'female']);
    if(!this.professionName) this.professionName = 'Generalist';
    this.changeProfession(this.professionName);
  }

  get hp() { return this._hp.__current; }
  get mp() { return this._mp.__current; }
  get xp() { return this._xp.__current; }
  get level() { return this._level.__current; }
  get special() { return this._special.__current; }
  get profession() { return this.$profession; }

  changeProfession(professionName) {
    this.$profession = require(`../professions/${professionName}`)[professionName];
    this.$profession.load(this);
  }

  getFullName() {
    if(this.title) return `${this.name}, the ${this.title}`;
    return this.name;
  }
  resetMaxXp() {
    this._xp.maximum = this.levelUpXpCalc(this.level);
  }

  levelUpXpCalc(level) {
    return Math.floor(100 + (400 * Math.pow(level, 1.71)));
  }
}