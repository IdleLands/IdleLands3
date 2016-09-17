
import _ from 'lodash';
import RestrictedNumber from 'restricted-number';

import { Character } from '../../core/base/character';
import { Equipment } from '../../core/base/equipment';

import { SETTINGS } from '../../static/settings';

import { ItemGenerator } from '../../shared/item-generator';

export class Pet extends Character {

  get fullname() {
    return `${this.name}, the ${this.$petId} with ${this.attr}`;
  }

  init(opts) {

    opts.gender = opts.gender || _.sample(SETTINGS.validGenders);
    opts.professionName = opts.professionName || 'Monster';

    super.init(opts);

    this.createdAt = this.createdAt || Date.now();
    this.inventory = this.inventory || [];

    if(!this.scaleLevel) this.scaleLevel = {
      maxLevel: 0,
      maxItemScore: 0,
      inventory: 0,
      goldStorage: 0,
      battleJoinPercent: 0,
      itemFindTimeDuration: 0,
      itemSellMultiplier: 0,
      itemFindBonus: 0,
      itemFindRangeMultiplier: 0,
      xpPerGold: 0
    };

    this.$_scale = new Proxy({}, {
      get: (target, name) => {
        const scale = this.$scale[name];
        return scale[Math.min(this.scaleLevel[name], scale.length-1)];
      }
    });

    if(!this.smart) this.smart = { self: false, sell: true, equip: true };
    if(!this.gold)  this.gold = { minimum: 0, maximum: this.$_scale.goldStorage, __current: 0 };

    this.gold.__proto__ = RestrictedNumber.prototype;

    _.each(this.inventory, item => item.__proto__ = Equipment.prototype);

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

    const item = new Equipment(base);
    this.equipment.soul = [item];
  }

  levelUp() {
    if(this.level === this._level.maximum) return;
    super.levelUp();
    this.$manager._updateSimplePetInfo(this.$petId, 'level', this.level);
  }

  _setNextItemFind() {
    if(!this.$_scale.itemFindTimeDuration) return;
    this.nextItemFind = new Date(Date.now() + this.$_scale.itemFindTimeDuration * 1000);
    this.$manager.save();
  }

  updatePlayer() {
    this.$updatePlayer = true;
  }

  inventoryFull() {
    return this.inventory.length === this.$_scale.inventory;
  }

  findItem() {
    const item = ItemGenerator.generateItem(null, this.$_scale.itemFindBonus);

    if(!this.canEquipScore(item)) {
      this.sellItem(item);
      return;
    }

    if(this.smart.equip && this.canEquip(item)) {
      const oldItem = this.shouldEquip(item);
      if(oldItem) {
        this.unequip(oldItem);
        this.equip(item);
        this.recalculateStats();
        this.updatePlayer();
        return;
      }
    }

    // full inventory
    if(this.inventoryFull()) {
      let sellItem = item;

      // try smart sell first
      if(this.smart.sell) {
        const compareItem = _.minBy(this.inventory, '_calcScore');

        // something in inventory is worse than the current sell item
        if(compareItem.score < sellItem.score) {
          sellItem = compareItem;
          this.addToInventory(item);
          this.removeFromInventory(sellItem);
        }
      }

      this.sellItem(sellItem);

    } else {

      this.addToInventory(item);
    }

    this.updatePlayer();

  }

  removeFromInventory(removeItem) {
    this.inventory = _.reject(this.inventory, item => item === removeItem);
  }

  takeTurn() {
    if(!this.nextItemFind) this._setNextItemFind();

    const now = Date.now();

    if(this.nextItemFind - now <= 0) {
      this.findItem();
      this._setNextItemFind();
    }
  }

  canManuallyEquip(item) {
    return _.find(this.equipment[item.type], { name: 'nothing' });
  }

  canEquipScore(item) {
    return item.score < this.liveStats.itemFindRange;
  }

  canEquip(item) {
    return this.$slots[item.type] && this.canEquipScore(item);
  }

  shouldEquip(item) {
    const compareItem = _.minBy(this.equipment[item.type], '_calcScore');
    return item.score > compareItem.score ? compareItem : false;
  }

  unequip(item, replace = false) {
    this.equipment[item.type] = _.reject(this.equipment[item.type], checkItem => checkItem === item);
    if(replace) {
      this.equipment[item.type].push(this.$manager.__emptyGear({ slot: item.type }));
    }

    this.recalculateStats();
  }

  equip(item, removeANothing = false) {
    this.equipment[item.type].push(item);

    if(removeANothing) {
      const nothing = _.find(this.equipment[item.type], { name: 'nothing' });
      if(nothing) {
        this.unequip(nothing);
      }
    }

    this.recalculateStats();
  }

  addToInventory(item) {
    this.inventory.push(item);
    this.inventory = _.sortBy(this.inventory, 'score');
  }

  canGainXp() {
    return this.level < this.$ownerRef.level;
  }

  gainXp(xp) {
    if(_.isNaN(xp) || !this.canGainXp()) return;
    super.gainXp(xp);

    if(this._xp.atMaximum()) this.levelUp();
  }

  gainGold(gold) {
    if(_.isNaN(gold)) return;
    this.gold.add(gold);

    this.checkSelfSmartUpgrades();
  }

  checkSelfSmartUpgrades() {
    if(!this.smart.self) return;

    _.each(_.keys(this.scaleLevel), attr => {
      if(this.scaleLevel[attr] === this.$scale[attr].length - 1) return;
      const cost = this.$scaleCost[attr][this.scaleLevel[attr]+1];
      if(cost > this.gold.getValue()) return;

      this.gold.sub(cost);
      this.scaleLevel[attr]++;
      this.doUpgrade(attr);
    });
  }

  doUpgrade(attr) {
    switch(attr) {
      case 'goldStorage':             return this.gold.maximum = this.$_scale.goldStorage;
      case 'maxLevel':                return this._level.maximum = this.$_scale.maxLevel;
      case 'itemFindTimeDuration':    return this._setNextItemFind();
      case 'itemFindRangeMultiplier': return this.updateSoul();
      case 'itemSellMultiplier':      return this.updateSoul();
      case 'maxItemScore':            return this.updateSoul();
    }
  }

  buildTransmitObject() {
    const base = _.omitBy(this, (val, key) => _.startsWith(key, '$'));
    base.$petId = this.$petId;
    base.$scale = this.$scale;
    base.$scaleCost = this.$scaleCost;
    base.$slots = this.$slots;
    return base;
  }

  buildSaveObject() {
    return _.omitBy(this, (val, key) => _.startsWith(key, '$'));
  }

}
