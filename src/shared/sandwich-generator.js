
import * as _ from 'lodash';

import * as Chance from 'chance';
const chance = new Chance();

import { Generator } from '../core/base/generator';
import { Equipment } from '../core/base/equipment';
import { ObjectAssets } from '../shared/asset-loader';

export class SandwichGenerator extends Generator {
  
  static generateSandwich(target) {

    const baseItem = _.sample(ObjectAssets.bread);
    const itemInst = new Equipment(baseItem);
    itemInst.type = 'sandwich';

    const meat = _.sample(ObjectAssets.meat);
    this.mergePropInto(itemInst, meat, false);
    itemInst.name = `${meat.name} on ${itemInst.name}`;

    if(chance.bool({ likelihood: 33 })) {
      const veg = _.sample(ObjectAssets.veg);
      this.mergePropInto(itemInst, veg, false);
      itemInst.name = `${veg.name} and ${itemInst.name}`;
    }

    let inches = 3;

    if(target.isPlayer) {
      if(target.gold > 10000) inches = 12;
      else                    inches = 6;
    } else {
      inches = chance.bool({ likelihood: 50 }) ? 6 : 12;
    }

    itemInst.name = `${inches}-in ${itemInst.name}`;

    return this.cleanUpItem(itemInst);
  }

  static cleanUpItem(item) {
    _.each(item, (val, attr) => {
      if(_.isNaN(val)) item[attr] = true;
    });
    return item;
  }
}