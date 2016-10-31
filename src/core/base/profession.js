
import _ from 'lodash';

export class Profession {
  static baseHpPerLevel = 270;
  static baseHpPerCon = 30;
  static baseHpPerInt = 0;
  static baseHpPerDex = 0;
  static baseHpPerStr = 0;
  static baseHpPerAgi = 0;
  static baseHpPerLuk = 0;

  static baseMpPerLevel = 0;
  static baseMpPerInt = 0;
  static baseMpPerCon = 0;
  static baseMpPerDex = 0;
  static baseMpPerStr = 0;
  static baseMpPerAgi = 0;
  static baseMpPerLuk = 0;

  static baseConPerLevel = 3;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 3;
  static baseLukPerLevel = 0;

  static classStats = {};

  static load() {}
  static unload() {}

  static handleEvent(target, event, args) {
    _.each(args.battle.allPlayers, player => {
      let func = '';
      if(player === target) {
        func = `_eventSelf${event}`;
      } else if(player.party === target.party) {
        func = `_eventAlly${event}`;
      } else {
        func = `_eventEnemy${event}`;
      }

      if(target.$profession[func]) {
        target.$profession[func](target, args);
      }

      if(target[func]) {
        target[func](target, args);
      }
    });
  }

  static setupSpecial() {}
  static resetSpecial(target) {
    target._special.name = '';
    target._special.maximum = target.minimum = target.__current = 0;
  }
}