
import _ from 'lodash';

import { ALL_STATS } from '../../shared/stat-calculator';

export class Generator {
  static types = ['body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'neck', 'mainhand', 'offhand'];
  static stats = ALL_STATS;

  static mergePropInto(baseItem, prop, handleName = true) {
    if(!prop) return;

    if(handleName) {
      if(prop.type === 'suffix') {
        baseItem.name = `${baseItem.name} of the ${prop.name}`;
      } else {
        baseItem.name = `${prop.name} ${baseItem.name}`;
      }
    }

    _.each(prop, (val, attr) => {
      if(!_.isNumber(val) || _.isEmpty(attr)) return;

      if(baseItem[attr]) {
        baseItem[attr] += prop[attr];

      } else {
        baseItem[attr] = _.isNaN(prop[attr]) ? true : prop[attr];
      }

    });

    baseItem.name = _.trim(baseItem.name);
  }
}