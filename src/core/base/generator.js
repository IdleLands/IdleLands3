
import _ from 'lodash';

export class Generator {
  static types = ['body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'neck', 'mainhand', 'offhand'];

  static mergePropInto(baseItem, prop) {
    if(!prop) return;

    if(prop.type === 'suffix') {
      baseItem.name = `${baseItem.name} of the ${prop.name}`;
    } else {
      baseItem.name = `${prop.name} ${baseItem.name}`;
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