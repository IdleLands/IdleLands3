"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const RestrictedNumber = require("restricted-number");
const character_1 = require("../../core/base/character");
const equipment_1 = require("../../core/base/equipment");
const settings_1 = require("../../static/settings");
const item_generator_1 = require("../../shared/item-generator");
class Pet extends character_1.Character {
    get fullname() {
        if (!this.attr) {
            return `${this.name}, the ${this.$petId}`;
        }
        return `${this.name}, the ${this.$petId} with ${this.attr}`;
    }
    init(opts) {
        opts.gender = opts.gender || _.sample(settings_1.SETTINGS.validGenders);
        opts.professionName = opts.professionName || 'Monster';
        super.init(opts);
        this.createdAt = this.createdAt || Date.now();
        this.inventory = this.inventory || [];
        if (!this.scaleLevel)
            this.scaleLevel = {
                maxLevel: 0,
                maxItemScore: 0,
                inventory: 0,
                goldStorage: 0,
                battleJoinPercent: 0,
                itemFindTimeDuration: 0,
                itemSellMultiplier: 0,
                itemFindBonus: 0,
                itemFindRangeMultiplier: 0,
                xpPerGold: 0,
                salvage: 0
            };
        if (this.scaleLevel.xpPerGold > 0)
            this.scaleLevel.xpPerGold = 0;
        if (!this.scaleLevel.salvage)
            this.scaleLevel.salvage = 0;
        this.$_scale = new Proxy({}, {
            get: (target, name) => {
                const scale = this.$scale[name];
                return scale[Math.min(this.scaleLevel[name], scale.length - 1)];
            }
        });
        if (!this.smart)
            this.smart = { self: false, sell: true, equip: true };
        if (!this.gold)
            this.gold = { minimum: 0, maximum: this.$_scale.goldStorage, __current: 0 };
        this.gold.__proto__ = RestrictedNumber.prototype;
        _.each(this.inventory, item => {
            delete item.isUnderNormalPercent;
            delete item.isNormallyEnchantable;
            delete item.isNothing;
            delete item.score;
            delete item.fullname;
            item.__proto__ = equipment_1.Equipment.prototype;
        });
        this._level.maximum = this.$_scale.maxLevel;
        this.updateSoul();
    }
    changeProfession(professionName) {
        super.changeProfession(professionName);
        this.$manager._updateSimplePetInfo(this.$petId, 'profession', professionName);
    }
    changeAttr(newAttr) {
        this.attr = newAttr;
    }
    updateSoul() {
        const base = _.cloneDeep(this.$specialStats);
        base.name = 'Pet Soul';
        base.type = 'soul';
        base.itemFindRangeMultiplier = this.$_scale.itemFindRangeMultiplier;
        base.itemValueMultiplier = this.$_scale.itemSellMultiplier;
        base.itemFindRange = this.$_scale.maxItemScore;
        const item = new equipment_1.Equipment(base);
        this.equipment.soul = [item];
    }
    levelUp() {
        if (this.level === this._level.maximum)
            return;
        super.levelUp();
        this.$manager._updateSimplePetInfo(this.$petId, 'level', this.level);
    }
    _setNextItemFind() {
        if (!this.$_scale.itemFindTimeDuration)
            return;
        this.nextItemFind = new Date(Date.now() + this.$_scale.itemFindTimeDuration * 1000);
        this.$manager.save();
    }
    updatePlayer() {
        this.$updatePlayer = true;
    }
    inventoryFull() {
        return this.inventory.length === this.$_scale.inventory;
    }
    findItem(item) {
        if (!item) {
            item = item_generator_1.ItemGenerator.generateItem(null, this.$_scale.itemFindBonus, this.level);
            if (!this.canEquipScore(item)) {
                this.sellItem(item);
                return;
            }
        }
        if (this.smart.equip && this.canEquip(item)) {
            const oldItem = this.shouldEquip(item);
            if (oldItem) {
                this.unequip(oldItem);
                this.equip(item);
                this.recalculateStats();
                this.updatePlayer();
                return;
            }
        }
        // full inventory
        if (this.inventoryFull()) {
            let sellItem = item;
            // try smart sell first
            if (this.smart.sell) {
                const compareItem = _.minBy(this.inventory, '_calcScore');
                // something in inventory is worse than the current sell item
                if (compareItem && sellItem && compareItem.score < sellItem.score) {
                    sellItem = compareItem;
                    this.addToInventory(item);
                    this.removeFromInventory(sellItem);
                }
            }
            this.sellItem(sellItem);
        }
        else {
            this.addToInventory(item);
        }
        this.updatePlayer();
    }
    salvageItem(item, doUpdate = false) {
        const salvageResult = this.$ownerRef.getSalvageValues(item, (this.$_scale.salvage / 100), this.liveStats.luk);
        this.removeFromInventory(item);
        this.$ownerRef.__updatePetActive();
        if (doUpdate) {
            this.$ownerRef.incrementSalvageStatistics(salvageResult);
        }
        return salvageResult;
    }
    sellItem(item, force = false) {
        if (!force && this.$ownerRef.hasGuild && this.smart.salvage && this.$_scale.salvage > 0) {
            this.salvageItem(item, true);
            return 0;
        }
        return super.sellItem(item);
    }
    removeFromInventory(removeItem) {
        this.inventory = _.reject(this.inventory, item => item === removeItem);
        this.save();
    }
    takeTurn() {
        if (!this.nextItemFind)
            this._setNextItemFind();
        const now = Date.now();
        if (this.nextItemFind - now <= 0) {
            this.findItem();
            this._setNextItemFind();
            this.updatePlayer();
        }
    }
    canManuallyEquip(item) {
        return _.find(this.equipment[item.type], { name: 'nothing' });
    }
    canEquipScore(item) {
        const itemRequirements = _(item).keys().filter(stat => _.includes(stat, 'Req')).value().length;
        return item.score < this.liveStats.itemFindRange && item.score > 0 && itemRequirements <= 0;
    }
    canEquip(item) {
        return this.$slots[item.type] && this.canEquipScore(item);
    }
    shouldEquip(item) {
        const compareItem = _.minBy(this.equipment[item.type], '_calcScore');
        if (!item || !compareItem)
            return false;
        return item.score > compareItem.score ? compareItem : false;
    }
    unequipAll() {
        _.each(this.equipment, (arr) => {
            _.each(arr, item => {
                this.unequip(item, true);
            });
        });
    }
    unequip(item, replace = false) {
        if (item.type === 'soul')
            return;
        this.equipment[item.type] = _.reject(this.equipment[item.type], checkItem => checkItem === item);
        if (replace) {
            this.equipment[item.type].push(this.$manager.__emptyGear({ slot: item.type }));
        }
        this.recalculateStats();
    }
    equip(item, removeANothing = false) {
        this.equipment[item.type].push(item);
        if (removeANothing) {
            const nothing = _.find(this.equipment[item.type], { name: 'nothing' });
            if (nothing) {
                this.unequip(nothing);
            }
        }
        this.recalculateStats();
    }
    addToInventory(item) {
        this.inventory.push(item);
        this.inventory = _.reverse(_.sortBy(this.inventory, 'score'));
        this.save();
    }
    canGainXp() {
        return this.level < this.$ownerRef.level && this.level <= this._level.maximum;
    }
    gainXp(xp) {
        if (_.isNaN(xp) || !this.canGainXp())
            return 0;
        super.gainXp(xp);
        if (this._xp.atMaximum())
            this.levelUp();
        return xp;
    }
    gainGold(gold) {
        if (_.isNaN(gold))
            return 0;
        this.gold.add(gold);
        this.checkSelfSmartUpgrades();
        return gold;
    }
    checkSelfSmartUpgrades() {
        if (!this.smart.self)
            return;
        _.each(_.keys(this.scaleLevel), attr => {
            if (this.scaleLevel[attr] === this.$scale[attr].length - 1)
                return;
            const cost = this.$scaleCost[attr][this.scaleLevel[attr] + 1];
            if (cost > this.gold.getValue())
                return;
            this.gold.sub(cost);
            this.scaleLevel[attr]++;
            this.doUpgrade(attr);
        });
    }
    _doLevelUpgrade() {
        this._level.maximum = this.$_scale.maxLevel;
        this.levelUp();
    }
    doUpgrade(attr) {
        switch (attr) {
            case 'goldStorage': return this.gold.maximum = this.$_scale.goldStorage;
            case 'maxLevel': return this._doLevelUpgrade();
            case 'itemFindTimeDuration': return this._setNextItemFind();
            case 'itemFindRangeMultiplier': return this.updateSoul();
            case 'itemSellMultiplier': return this.updateSoul();
            case 'maxItemScore': return this.updateSoul();
        }
    }
    buildTransmitObject() {
        const base = _.omitBy(this, (val, key) => _.startsWith(key, '$') || _.isNotWritable(this, key));
        base.$petId = this.$petId;
        base.$scale = this.$scale;
        base.$scaleCost = this.$scaleCost;
        base.$slots = this.$slots;
        base.ownerEdit = this.$ownerRef.nameEdit;
        return base;
    }
    buildSaveObject() {
        return _.omitBy(this, (val, key) => _.startsWith(key, '$') || _.isNotWritable(this, key));
    }
    save() {
        this.$manager.save();
    }
}
exports.Pet = Pet;
