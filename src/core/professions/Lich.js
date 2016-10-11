
import _ from 'lodash';

import { Profession } from '../base/profession';

export class Lich extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel + 25;

  static baseMpPerInt = 15;

  static baseConPerLevel = 5;
  static baseDexPerLevel = 0;
  static baseAgiPerLevel = 0;
  static baseStrPerLevel = 7;
  static baseIntPerLevel = 7;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.02
  }

  static setupSpecial(target) {
    const numProfessions = Math.floor(target.level / 50) + 1;
    target.$secondaryProfessions = _.sampleSize(['Bard', 'Cleric', 'Fighter', 'Generalist', 'Mage', 'SandwichArtist'], numProfessions);
    target._special.name = 'Phylactic Energy';
    target._special.maximum = Math.floor(target.level / 25) + 1;
    target._special.toMaximum();
  }

  static resetSpecial(target) {
    super.resetSpecial(target);
    delete target.$secondaryProfessions;
  }

  static _eventSelfKilled(target) {
    if(target._special.atMinimum()) return;
    target.$effects.clear();
    target.$battle._emitMessage(`${target.fullname} sprang back to life via the magic of Phylactery!`);
    target._special.sub(1);
    target._hp.toMaximum();
  }
}