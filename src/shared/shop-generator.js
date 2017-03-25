
import { Generator } from '../core/base/generator';
import { ItemGenerator } from './item-generator';

import { Regions } from './regions';

export class ShopGenerator extends Generator {

  static generateItem(player, scoreMultiplier = 1) {
    return ItemGenerator.generateItem(null, player.calcLuckBonusFromValue() * scoreMultiplier, player.level);
  }

  static regionShop(player) {
    const shop = {
      slots: [],
      region: player.mapRegion
    };

    const region = Regions[shop.region];

    if(!region || !region.shopSlots || !region.shopQuality || !region.shopPriceMultiplier) return shop;

    const slots = region.shopSlots(player);
    const multiplier = region.shopQuality(player);
    const priceMult = region.shopPriceMultiplier(player);

    let attempts = 0;

    if(slots === 0) return shop;

    for(let i = 0; i < slots; i++) {
      let item = this.generateItem(player, multiplier);
      while(!player.canEquip(item) && attempts++ < 10) {
        item = this.generateItem(player, multiplier);
      }

      if(!player.canEquip(item)) continue;

      // price gouge the players, muhahaha
      const price = Math.round(item.score * priceMult * 7);
      item.price = price;
      shop.slots.push(item);
    }

    return shop;
  }
}