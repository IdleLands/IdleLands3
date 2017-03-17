
import { Event } from '../event';
import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 72;

// Lose 25-2000 Gold
export class GoldForsake extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {

    let value = Event.chance.integer({ min: 10, max: 500 * player.level });
    if(Event.chance.bool({ likelihood: 5 })) {
      const maxGoldLost = Math.max(1000, Math.round(player.gold * 0.03));
      const baseGold = Math.floor(Event.chance.integer({ min: 25, max: maxGoldLost }));
      value = baseGold;
    }

    const goldModCheck = player._calcModGold(-value);

    const goldMod = Math.min(player.gold, Math.max(Math.abs(goldModCheck), Math.abs(value)));
    const eventText = this.eventText('forsakeGold', player, { gold: goldMod });

    this.emitMessage({ affected: [player], eventText: `${eventText} [-${goldMod.toLocaleString()} gold]`, category: MessageCategories.GOLD });

    return [player];
  }
}