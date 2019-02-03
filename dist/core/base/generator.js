"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const stat_calculator_1 = require("../../shared/stat-calculator");
class Generator {
    static mergePropInto(baseItem, prop, handleName = true) {
        if (!prop)
            return;
        if (handleName) {
            if (prop.type === 'suffix') {
                baseItem.name = `${baseItem.name} of the ${prop.name}`;
            }
            else {
                baseItem.name = `${prop.name} ${baseItem.name}`;
            }
        }
        _.each(prop, (val, attr) => {
            if (!_.isNumber(val) || _.isEmpty(attr))
                return;
            if (baseItem[attr]) {
                if (_.includes(attr, 'Req')) {
                    baseItem[attr] = Math.max(baseItem[attr], prop[attr]);
                }
                else {
                    baseItem[attr] += prop[attr];
                }
            }
            else {
                baseItem[attr] = _.isNaN(prop[attr]) ? true : prop[attr];
            }
        });
        baseItem.name = _.trim(baseItem.name);
    }
}
Generator.types = ['body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'neck', 'mainhand', 'offhand'];
Generator.stats = stat_calculator_1.ALL_STATS;
exports.Generator = Generator;
