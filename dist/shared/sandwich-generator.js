"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
const generator_1 = require("../core/base/generator");
const equipment_1 = require("../core/base/equipment");
const asset_loader_1 = require("../shared/asset-loader");
class SandwichGenerator extends generator_1.Generator {
    static generateSandwich(target) {
        const baseItem = _.sample(asset_loader_1.ObjectAssets.bread);
        const itemInst = new equipment_1.Equipment(baseItem);
        itemInst.type = 'sandwich';
        const meat = _.sample(asset_loader_1.ObjectAssets.meat);
        this.mergePropInto(itemInst, meat, false);
        itemInst.name = `${meat.name} on ${itemInst.name}`;
        if (chance.bool({ likelihood: 33 })) {
            const veg = _.sample(asset_loader_1.ObjectAssets.veg);
            this.mergePropInto(itemInst, veg, false);
            itemInst.name = `${veg.name} and ${itemInst.name}`;
        }
        let inches = 3;
        if (target.isPlayer) {
            if (target.gold > 10000)
                inches = 12;
            else
                inches = 6;
        }
        else {
            inches = chance.bool({ likelihood: 50 }) ? 6 : 12;
        }
        itemInst.name = `${inches}-in ${itemInst.name}`;
        return this.cleanUpItem(itemInst);
    }
    static cleanUpItem(item) {
        _.each(item, (val, attr) => {
            if (_.isNaN(val))
                item[attr] = true;
        });
        return item;
    }
}
exports.SandwichGenerator = SandwichGenerator;
