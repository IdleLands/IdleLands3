
// TODO: https://github.com/IdleLands/IdleLandsOld/blob/e460f87751ddfe370f8e99b46d4838af5688b93b/src/system/handlers/MessageCreator.coffee

import _ from 'lodash';

import Chance from 'chance';
const chance = new Chance();

import { GameState } from '../../core/game-state';
import { StringAssets } from '../../shared/asset-loader';

import { Logger } from '../../shared/logger';

class AllDomains {

  static dict(props) {
    const { funct } = props[0];
    let normalizedFunct = funct.toLowerCase();
    let isPlural = false;
    
    if(normalizedFunct === 'nouns') {
      isPlural = true;
      normalizedFunct = 'noun';
    }

    const canLowercase = !_.includes(['deity'], normalizedFunct);
    let chosenItem = _.sample(StringAssets[normalizedFunct]);
    if(canLowercase) {
      chosenItem = normalizedFunct === funct ? chosenItem.toLowerCase() : _.capitalize(chosenItem);
    }

    if(normalizedFunct === 'noun' && !isPlural) {
      chosenItem = chosenItem.substring(0, chosenItem.length - 1); // supposedly, all nouns are plural
    }

    return chosenItem;
  }
  
  static placeholder() {
    return this.dict([{ funct: 'placeholder' }]);
  }
  
  static chance({ funct, args }) {
    if(!chance[funct]) return this.placeholder();
    chance[funct](args);
  }
  
  static combat() {
    return this.placeholder();
  }

  static random(props, cache) {
    const { funct, args } = props[0];
    return AssetDomainHandler[funct](args, props, cache);
  }
}

class AssetDomainHandler {
  static town() {
    return _.sample(_.filter(GameState.getInstance().world.uniqueRegions, r => _.includes(r, 'Town')));
  }
  static class() {
    return _.sample(StringAssets.class);
  }
  static player() {
    return _.sample(GameState.getInstance().players).name;
  }
  static map() {
    return _.sample(_.keys(GameState.getInstance().world.maps));
  }
  static pet() {
    return AllDomains.placeholder();
  }
  static activePet() {
    return AllDomains.placeholder();
  }
  static guild() {
    return AllDomains.placeholder();
  }
  static item() {
    return AllDomains.placeholder();
  }
  static monster() {
    return AllDomains.placeholder();
  }
  static ingredient() {
    return AllDomains.placeholder();
  }
  static party() {
    return AllDomains.placeholder();
  }
}

class PlayerOwnedDomainHandler {
  static pet() {
    return AllDomains.placeholder();
  }
  static guild() {
    return AllDomains.placeholder();
  }
  static guildMember() {
    return AllDomains.placeholder();
  }
}

class EventVariableCache {
  constructor() {
    this.cache = {};
  }

  get(domain, funct, num) {
    if(_.isNaN(num)) throw new Error('Cache:get num cannot be NaN');
    return _.get(this.cache, `${domain}.${funct}.${num}`);
  }

  set(domain, funct, num, val) {
    if(_.isNaN(num)) throw new Error('Cache:set num cannot be NaN');
    _.set(this.cache, `${domain}.${funct}.${num}`, val);
  }
}

// TODO https://github.com/IdleLands/IdleLandsOld/blob/e460f87751ddfe370f8e99b46d4838af5688b93b/src/system/handlers/MessageCreator.coffee#L247
class EventVariableManager {

  static transformVarProps(props, cache) {
    const { domain, funct, cacheNum } = props[0];

    let retVal = null;

    try {
      const prevCacheData = cache.get(domain, funct, cacheNum);
      if(prevCacheData && funct !== 'party') return prevCacheData;
      retVal = AllDomains[domain](props, cache);
      if(funct !== 'party') cache.set(domain, funct, cacheNum, retVal);
    } catch(e) {
      Logger.error('EventVariableManager', e, { props, cache });
    }

    return retVal;
  }

  static getVarProps(string) {
    const terms = string.split(' ');
    const varProps = [];
    _.each(terms, term => {
      const [props, cacheNum] = term.split('#');
      const [domain, funct] = props.split(':', 2);
      const args = props.substring(1 + funct.length + props.indexOf(funct)).trim().split('\'').join('"');
      try {
        varProps.push({
          domain,
          funct,
          cacheNum: cacheNum ? +cacheNum : 0,
          args: args ? JSON.parse(args) : null
        });
      } catch(e) {
        Logger.error('MessageCreator', e, { string });
      }
    });

    return varProps;
  }

  static handleVariables(string) {
    return string.replace(/\$([a-zA-Z\:#0-9 {}_,']+)\$/g, (match, p1) => {
      const cache = new EventVariableCache();
      let string = this.getVarProps(p1);
      string = this.transformVarProps(string, cache);
      return string;
    });
  }
}

export class MessageParser {
  static genderPronoun(gender, replace) {
    switch(replace) {
      case '%hisher': {
        switch(gender) {
          case 'male':    return 'his';
          case 'female':  return 'her';
          default:        return 'their';
        }
      }
      case '%hishers': {
        switch(gender) {
          case 'male':    return 'his';
          case 'female':  return 'hers';
          default:        return 'theirs';
        }
      }
      case '%himher': {
        switch(gender) {
          case 'male':    return 'him';
          case 'female':  return 'her';
          default:        return 'them';
        }
      }
      case '%she':
      case '%heshe': {
        switch(gender) {
          case 'male':    return 'he';
          case 'female':  return 'she';
          default:        return 'they';
        }
      }
    }
  }

  static stringFormat(string, player, extra = {}) {
    string = _.trim(string);

    _.each(_.keys(extra), key => {
      string = string.split(`%${key}`).join(extra[key]);
    });

    string = EventVariableManager.handleVariables(string);

    const splitJoins = [
      { split: '%player',       join: () => player.getFullName() },
      { split: '%pet',          join: () => PlayerOwnedDomainHandler.pet(player) },
      { split: '%guildMember',  join: () => PlayerOwnedDomainHandler.guildMember(player) },
      { split: '%guild',        join: () => PlayerOwnedDomainHandler.guild(player) }
    ];

    _.each(['hishers', 'hisher', 'himher', 'she', 'heshe'], pronoun => {
      splitJoins.push({
        split: `%${pronoun}`,
        join: () => this.genderPronoun(player.gender, `%${pronoun}`)
      });
      splitJoins.push({
        split: `%${_.capitalize(pronoun)}`,
        join: () => _.capitalize(this.genderPronoun(player.gender, `%${pronoun}`))
      });
    });

    _.each(splitJoins, sj => {
      if(!_.includes(string, sj.split)) return;
      string = string.split(sj.split).join(sj.join());
    });

    return string;

  }
}