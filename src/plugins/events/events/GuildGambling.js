
import * as _ from 'lodash';
import { Event } from '../event';

import { MessageCategories } from '../../../shared/adventure-log';
import { XPForsake } from './XPForsake';
import { GoldForsake } from './GoldForsake';

export const WEIGHT = 0;
const MIN_GOLD = 5000;
const INCOME_PERCENT = 10;

// Get the opportunity to gamble away your gold
export class GuildGambling extends Event {
  static WEIGHT = 0;

  static operateOn(player) {
    if(!player.hasGuild) return;

    const tavernLevel = player.guild.buildings.levels.Tavern || 0;
    if(tavernLevel === 0) return;

    const MOD_INCOME_PERCENT = INCOME_PERCENT + Math.floor(tavernLevel / 5);

    if(player.gold < MIN_GOLD * MOD_INCOME_PERCENT) return;
    const cost = this.chance.integer({ min: MIN_GOLD, max: player.gold / MOD_INCOME_PERCENT });

    const multiplierMin = Math.max(0.5, 0.5 + (0.1 * Math.floor(tavernLevel/3)));
    const multiplierMax = Math.max(1, 1 + (0.1 * Math.floor(tavernLevel/5)));

    const oddsMin = Math.max(20, 5 + (0.5 * Math.floor(tavernLevel/2)));
    const oddsMax = Math.max(75, 30 + (0.5 * Math.floor(tavernLevel/7)));

    const id = Event.chance.guid();
    const multiplier = this.chance.floating({ fixed: 2, min: multiplierMin, max: multiplierMax });
    const odds = this.chance.integer({ min: oddsMin, max: oddsMax });

    const message = `Would you like to gamble ${cost.toLocaleString()} gold at a ${multiplier}x rate with ${odds}% chance to win?`;
    const extraData = { multiplier, cost, odds };

    player.addChoice({ id, message, extraData, event: 'Gambling', choices: ['Yes', 'No', 'Double Down', 'Cheat'] });

    return [player];
  }

  static makeChoice(player, id, response) {
    if(response === 'No') return;
    if(!player.hasGuild) return;

    const tavernLevel = player.guild.buildings.levels.Tavern || 0;
    if(tavernLevel === 0) return;

    const choice = _.find(player.choices, { id });
    let { cost, multiplier, odds } = choice.extraData;

    const isDoubleDown = response === 'Double Down';
    if(isDoubleDown) {
      cost *= 2;
      multiplier *= 2;
      odds /= 2;
    }

    const isCheat = response === 'Cheat';
    const getCaughtChance = Math.max(15, 50 - (tavernLevel/5));

    if(Event.chance.bool({ likelihood: getCaughtChance })) {
      let cheatMessage = '%player got caught cheating and lost some XP and Gold as a punishment!';
      cheatMessage = this._parseText(cheatMessage, player);
      this.emitMessage({ affected: [player], eventText: cheatMessage, category: MessageCategories.GOLD });
      player.$statistics.incrementStat('Character.Gamble.CheatFail');

      XPForsake.operateOn(player, '%player got caught cheating and lost %xp xp!');
      GoldForsake.operateOn(player, '%player got caught cheating and lost %gold gold!');
      return;
    }

    if(isCheat) {
      odds += 10;
      player.$statistics.incrementStat('Character.Gamble.CheatSuccess');
    }

    if(player.gold < cost || _.isNaN(cost) || cost < 0) return Event.feedback(player, 'You do not have enough gold!');

    if(isDoubleDown) {
      player.$statistics.incrementStat('Character.Gamble.DoubleDown');
    }

    let message = '';

    if(Event.chance.bool({ likelihood: odds })) {
      const winnings = Math.round(cost * multiplier);
      player.gainGold(winnings, false);
      player.$statistics.incrementStat('Character.Gold.Gamble.Win', winnings);
      player.$statistics.incrementStat('Character.Gamble.WinTimes');
      if(isDoubleDown) {
        player.$statistics.incrementStat('Character.Gamble.WinTimesDoubleDown');
      }
      message = `%player got lucky and bet ${cost.toLocaleString()} gold against the odds of ${odds}%${isDoubleDown ? ' (Double Down)': ''}. %She came out ahead with ${winnings.toLocaleString()} gold!`;
    } else {
      player.gainGold(-cost, false);
      player.$statistics.incrementStat('Character.Gold.Gamble.Lose', cost);
      player.$statistics.incrementStat('Character.Gamble.LoseTimes');
      if(isDoubleDown) {
        player.$statistics.incrementStat('Character.Gamble.LoseTimesDoubleDown');
      }
      message = `%player felt lucky and bet ${cost.toLocaleString()} gold against the odds of ${odds}${isDoubleDown ? ' (Double Down)': ''}%. %She lost it all at the table.`;
    }

    message = this._parseText(message, player);

    this.emitMessage({ affected: [player], eventText: message, category: MessageCategories.GOLD });
  }
}

