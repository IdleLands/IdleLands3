
import _ from 'lodash';
import { Event } from '../event';

import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 1500;
const MIN_GOLD = 5000;

// Get the opportunity to buy an item
export class Gambling extends Event {
  static WEIGHT = WEIGHT;

  static operateOn(player) {

    if(player.gold < MIN_GOLD) return;
    const cost = this.chance.integer({ min: MIN_GOLD, max: player.gold / 4 });

    const id = Event.chance.guid();
    const multiplier = this.chance.floating({ fixed: 2, min: 1, max: 2 });
    const odds = this.chance.integer({ min: 10, max: 60 });

    const message = `Would you like to gamble ${cost.toLocaleString()} gold at a ${multiplier}x rate with ${odds}% chance to win?`;
    const extraData = { multiplier, cost, odds };

    player.addChoice({ id, message, extraData, event: 'Gambling', choices: ['Yes', 'No', 'Double Down'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response === 'No') return;

    const choice = _.find(player.choices, { id });
    let { cost, multiplier, odds } = choice.extraData;

    if(response === 'Double Down') {
      cost *= 2;
      multiplier *= 2;
      odds /= 2;
    }

    if(player.gold < cost) return false;

    let message = '';

    if(this.chance.bool({ likelihood: odds })) {
      const winnings = Math.round(cost * multiplier);
      player.gainGold(winnings, false);
      player.$statistics.incrementStat('Character.Gold.Gamble.Win', winnings);
      message = `%player got lucky and bet ${cost} gold against the odds of ${odds}%. %She came out ahead with ${winnings.toLocaleString()} gold!`;
    } else {
      player.gainGold(-cost, false);
      player.$statistics.incrementStat('Character.Gold.Gamble.Lose', cost);
      message = `%player felt lucky and bet ${cost} gold against the odds of ${odds}%. %She lost it all at the table.`;
    }

    message = this._parseText(message, player);

    this.emitMessage({ affected: [player], eventText: message, category: MessageCategories.GOLD });
  }

  static feedback(player) {
    Event.feedback(player, 'You do not have enough gold!');
  }
}

