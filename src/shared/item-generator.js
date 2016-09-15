
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

  static getAllTreasure(chestName) {
    return _.map(Chests[chestName].items, itemName => {
      const item = new Equipment(Treasures[itemName]);
      item.name = itemName;
      item.itemClass = 'guardian';
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
  
  static generateItem(type, bonus = 0) {
    if(!type) {
      type = _.sample(this.types);
    }

    const baseItem = _.sample(ObjectAssets[type]);
    const itemInst = new Equipment(baseItem);

    this.addPropertiesToItem(itemInst, bonus);

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

    if(chance.integer({ min: 0, max: 85 }) <= 1+bonus) {
      this.mergePropInto(item, _.sample(ObjectAssets.suffix));
    }
  }

  static cleanUpItem(item) {
    _.each(item, (val, attr) => {
      if(_.isNaN(val)) item[attr] = true;
    });
    return item;
  }
}