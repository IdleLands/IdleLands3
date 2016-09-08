
import _ from 'lodash';
import { Event } from '../event';

import { Equipment } from '../../../core/base/equipment';
import { MessageCategories } from '../../../shared/adventure-log';
import { StringGenerator } from '../../../shared/string-generator';

import { SETTINGS } from '../../../static/settings';

export const WEIGHT = -1;

// Get the gift of the divine
export class Providence extends Event {

  static generateProvidenceItem(multiplier = 1, t0shift = 0, t1shift = 0, t2shift = 0) {
    const baseItem = {
      type: 'providence',
      itemClass: 'basic',
      name: StringGenerator.providence()
    };

    _.each(Event.t0stats, stat => {
      if(Event.chance.bool({ likelihood: 30 })) return;
      baseItem[stat] = Event.chance.integer({
        min: Math.min(-15, (-150 + t0shift)*multiplier),
        max: (150 + t0shift) * multiplier
      });
    });

    _.each(Event.t1stats, stat => {
      if(Event.chance.bool({ likelihood: 40 })) return;
      baseItem[stat] = Event.chance.integer({
        min: Math.min(-10, (-100 + t1shift)*multiplier),
        max: (100 + t1shift) * multiplier
      });
    });

    _.each(Event.t2stats, stat => {
      if(Event.chance.bool({ likelihood: 50 })) return;
      baseItem[stat] = Event.chance.integer({
        min: Math.min(-10, (-75 + t2shift)*multiplier),
        max: (75 + t2shift) * multiplier
      });
    });

    return new Equipment(baseItem);
  }

  static probabilities = {
    xp: 60,
    level: 15,
    gender: 80,
    gold: 50,
    profession: 10,
    clearProvidence: 20,
    newProvidence: 75,
    personality: 50,
    title: 75
  };

  static _genders = SETTINGS.validGenders;
  static _professions = (player) => {
    return _.keys(player.$statistics.getStat('Character.Professions')) || ['Generalist'];
  };

  static doBasicProvidencing(player, provData) {
    let message = '';

    const { xp, level, gender, profession, gold } = provData;

    if(xp && player.level < 100 && Event.chance.bool({ likelihood: this.probabilities.xp })) {
      player._xp.add(xp);
      message = `${message} ${xp > 0 ? 'Gained' : 'Lost'} ${Math.abs(xp)} xp!`;

    } else if(level && player.level < 100 && Event.chance.bool({ likelihood: this.probabilities.level })) {
      player._level.add(level);
      player.resetMaxXp();
      message = `${message} ${level > 0 ? 'Gained' : 'Lost'} ${Math.abs(level)} levels!`;
    }

    if(player.gender !== gender && Event.chance.bool({ likelihood: this.probabilities.gender })) {
      player.gender = gender;
      message = `${message} Gender is now ${gender}!`;
    }

    if(gold && Event.chance.bool({ likelihood: this.probabilities.gold })) {
      player.gold += gold;
      message = `${message} ${gold > 0 ? 'Gained' : 'Lost'} ${Math.abs(gold)} gold!`;
    }

    if(profession !== player.professionName && Event.chance.bool({ likelihood: this.probabilities.profession })) {
      player.changeProfession(profession);
      message = `${message} Profession is now ${profession}!`;
    }

    if(Event.chance.bool({ likelihood: this.probabilities.personality })) {
      _.each(player.$personalities.earnedPersonalities, ({ name }) => {
        if(Event.chance.bool({ likelihood: 50 }))  return;
        player.$personalities.togglePersonality(player, name);
      });
      message = `${message} Personality shift!`;
    }

    if(Event.chance.bool({ likelihood: this.probabilities.title })) {
      player.changeTitle(_.sample(player.$achievements.titles()));
      message = `${message} Title change!`;
    }

    return message;
  }

  static fatePoolProvidence(player, baseMessage) {
    const providenceData = {
      xp: Event.chance.integer({ min: -player._xp.maximum, max: player._xp.maximum }),
      level: Event.chance.integer({ min: -3, max: 2 }),
      gender: _.sample(this._genders),
      profession: _.sample(this._professions(player)) || 'Generalist',
      gold: Event.chance.integer({ min: -Math.min(30000, player.gold), max: 20000 })
    };

    baseMessage = `${baseMessage} ${this.doBasicProvidencing(player, providenceData).trim()}`;

    if(player.equipment.providence && Event.chance.bool({ likelihood: this.probabilities.clearProvidence })) {
      player.equipment.providence = null;
      delete player.equipment.providence;

      baseMessage = `${baseMessage} Providence cleared!`;

    } else if(!player.equipment.providence && Event.chance.bool({ likelihood: this.probabilities.newProvidence })) {
      player.equipment.providence = this.generateProvidenceItem();
    }

    player.recalculateStats();
    this.emitMessage({ affected: [player], eventText: baseMessage, category: MessageCategories.EXPLORE });
  }

  static operateOn(player) {
    const eventText = this.eventText('providence', player);
    this.fatePoolProvidence(player, eventText);
    player.$statistics.batchIncrement(['Character.Events', 'Character.Event.Providence']);
  }

}

