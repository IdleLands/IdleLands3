
import _ from 'lodash';

import Chance from 'chance';
const chance = new Chance();

import { Generator } from '../core/base/generator';
import { Equipment } from '../core/base/equipment';
import { ObjectAssets } from '../shared/asset-loader';

import Chests from '../../assets/maps/content/chests.json';
import Treasures from '../../assets/maps/content/treasure.json';

export class ItemGenerator extends Generator {
  
  static newPlayerEquipment() {
    const itemNames = {
      body:     ['Tattered Shirt', 'Spray Tan', 'Temporary Tattoos', 'Hero\'s Tunic', 'Grandma\'s Sweater'],
      feet:     ['Cardboard Shoes', 'Wheelie Shoes', 'Sandals With Built-in Socks'],
      finger:   ['Twisted Wire', 'Candy Ring', 'Hero Academy Graduation Ring'],
      hands:    ['Pixelated Gloves', 'Winter Gloves', 'Mittens'],
      head:     ['Miniature Top Hat', 'Fruit Hat', 'Beanie', 'Sunglasses'],
      legs:     ['Leaf', 'Cargo Shorts', 'Comfy Shorts'],
      neck:     ['Old Brooch', 'Candy Necklace', 'Keyboard Cat Tie'],
      mainhand: ['Empty and Broken Ale Bottle', 'Father\'s Sword', 'Butter Knife', 'Hero\'s Axe', 'Chocolate Drumstick', 'Aged Toothbrush'],
      offhand:  ['Chunk of Rust', 'Shaking Fist', 'Upside-down Map', 'Sticker Book', 'Stolen Dagger'],
      charm:    ['Ancient Bracelet', 'Family Photo', 'Third Place Bowling Trophy', 'Love Letter']
    };

    const r = () => chance.integer({ min: -2, max: 3 });

    const equipment = [];

    _.each(_.keys(itemNames), key => {
      const item = new Equipment({
        type: key,
        itemClass: 'newbie',
        name: _.sample(itemNames[key]),
        str: r(), con: r(), dex: r(), int: r(), agi: r(), luk: r()
      });
      equipment.push(item);
    });

    return equipment;
  }

  static getAllTreasure(chestName, player) {
    return _.map(Chests[chestName].items, itemName => {
      const item = new Equipment(Treasures[itemName]);
      item.name = itemName;
      item.itemClass = 'guardian';
      this.tryToVectorize(item, player.level);
      return item;
    });
  }
  
  static getItemClass(item) {
    let itemClass = 'basic';
    if(item.name.toLowerCase() !== item.name)         itemClass = 'pro';
    if(_.includes(item.name.toLowerCase(), 'idle')
    || _.includes(item.name.toLowerCase(), 'idling')) itemClass = 'idle';
    if(item.score > 7500)                             itemClass = 'godly';

    return itemClass;
  }
  
  static generateItem(type, bonus = 0, genLevel = 0) {
    if(!type) {
      type = _.sample(this.types);
    }

    const baseItem = _.sample(ObjectAssets[type]);
    const itemInst = new Equipment(baseItem);

    this.addPropertiesToItem(itemInst, bonus);
    this.tryToVectorize(itemInst, genLevel);

    itemInst._baseScore = itemInst.score;
    itemInst.type = type;
    itemInst.itemClass = this.getItemClass(itemInst);
    itemInst.score;
    return this.cleanUpItem(itemInst);
  }

  static addPropertiesToItem(item, bonus = 0) {
    if(chance.integer({ min: 0, max: 3 }) === 0) {
      this.mergePropInto(item, _.sample(ObjectAssets.prefix));

      let iter = 1;
      const seti = () => chance.integer({ min: 0, max: Math.pow(15, iter) });
      let i = seti();
      while(i < 1 + bonus) {
        this.mergePropInto(item, _.sample(ObjectAssets.prefix));
        iter++;
        i = seti();
      }
    }

    if(chance.integer({ min: 0, max: 100 }) === 0) {
      this.mergePropInto(item, _.sample(ObjectAssets['prefix-special']));
    }

    if(chance.integer({ min: 0, max: 85 }) <= 1+bonus) {
      this.mergePropInto(item, _.sample(ObjectAssets.suffix));
    }
  }

  static tryToVectorize(item, level) {
    if(!item.vector && (level <= 100 || chance.bool({ likelihood: 95 }))) return;

    const funcs = [
      { name: 'linear',           modify: (stat) => stat + stat },
      { name: 'scalar',           modify: (stat) => stat * stat },
      { name: 'vector',           modify: (stat) => Math.round(stat + Math.sqrt(stat)) },
      { name: 'parabolic',        modify: (stat) => stat * chance.bool() ? -2 : 2 },
      { name: 'quadratic',        modify: (stat) => Math.round(stat * Math.log(stat)) },
      { name: 'exponential',      modify: (stat) => Math.round(stat * Math.sqrt(stat)) },

      { name: 'leve-linear',      modify: (stat) => stat + level },
      { name: 'leve-scalar',      modify: (stat) => stat * level },
      { name: 'leve-vector',      modify: (stat) => Math.round(stat + Math.sqrt(level)) },
      { name: 'leve-quadratic',   modify: (stat) => Math.round(stat * Math.log(level)) },
      { name: 'leve-exponential', modify: (stat) => Math.round(stat * Math.sqrt(level)) }
    ];

    const weights = [
      6,
      3,
      5,
      2,
      4,
      1,
      6,
      3,
      5,
      4,
      1
    ];

    const func = chance.weighted(funcs, weights);

    const validKeys = _(item)
      .omitBy((val, prop) => {
        return _.includes(['enchantLevel', 'foundAt', '_calcScore', '_baseScore', 'vector'], prop)
            || val === 0
            || _.isString(item[prop]);
      })
      .keys()
      .value();

    const numKeys = item.vector ? Math.min(validKeys.length, item.vector) : chance.integer({ min: 1, max: validKeys.length });
    const chosenKeys = _.sampleSize(validKeys, numKeys);

    _.each(chosenKeys, key => {
      item[key] = func.modify(item[key]);
    });

    item.name = `${func.name} ${item.name}`;
  }

  static cleanUpItem(item) {
    _.each(item, (val, attr) => {
      if(_.isNaN(val)) item[attr] = true;
    });
    return item;
  }
}