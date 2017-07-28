
import * as _ from 'lodash';
import { Event } from '../event';

import { Equipment } from '../../../core/base/equipment';
import { MessageCategories } from '../../../shared/adventure-log';
import { ItemGenerator } from '../../../shared/item-generator';

export const WEIGHT = 0;

// Get the opportunity to gamble away your gold
export class GuildForge extends Event {
  static WEIGHT = 0;

  static generateItem(player, forgeLevel) {
    const baseItem = ItemGenerator.chooseBaseItem();
  }

  static operateOn(player) {
    if(!player.hasGuild) return;

    const forgeLevel = player.guild.buildings.levels.Forge || 0;
    if(forgeLevel === 0) return;

    const { item, astraliumCost, clayCost, stoneCost, woodCost } = this.generateItem(player, forgeLevel);

    if(!player.canEquip(item)) return;

    const message = `Would you like to forge ${item.name} for ${woodCost.toLocaleString()} wood, ${stoneCost.toLocaleString()} stone, ${clayCost.toLocaleString()} clay, and ${astraliumCost.toLocaleString()} astralium?`;
    const extraData = { item };

    player.addChoice({ id, message, extraData, event: 'GuildForge', choices: ['Yes', 'No'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    const choice = _.find(player.choices, { id });
    const item = new Equipment(choice.extraData.item);

    if(response === 'No') return;

    const oldItem = player.equipment[item.type];
    if(oldItem) {
      this.disposeOfItem(player, oldItem, true);
    }
    player.equip(item);
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.ITEM });

    // TODO spawn a finditem event with the generated item
  }

}

