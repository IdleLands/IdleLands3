"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
exports.WEIGHT = 6;
const MIN_GOLD = 5000;
const INCOME_PERCENT = 10;
// Get the opportunity to gamble away your gold
class Gambling extends event_1.Event {
    static operateOn(player) {
        if (player.gold < MIN_GOLD * INCOME_PERCENT)
            return;
        const cost = this.chance.integer({ min: MIN_GOLD, max: player.gold / INCOME_PERCENT });
        const id = event_1.Event.chance.guid();
        const multiplier = this.chance.floating({ fixed: 2, min: 1.3, max: 2 });
        const odds = this.chance.integer({ min: 10, max: 50 });
        const message = `Would you like to gamble ${cost.toLocaleString()} gold at a ${multiplier}x rate with ${odds}% chance to win?`;
        const extraData = { multiplier, cost, odds };
        player.addChoice({ id, message, extraData, event: 'Gambling', choices: ['Yes', 'No', 'Double Down'] });
        return [player];
    }
    static makeChoice(player, id, response) {
        if (response === 'No')
            return;
        const choice = _.find(player.choices, { id });
        let { cost, multiplier, odds } = choice.extraData;
        const isDoubleDown = response === 'Double Down';
        if (isDoubleDown) {
            cost *= 2;
            multiplier *= 2;
            odds /= 2;
        }
        if (player.gold < cost || _.isNaN(cost) || cost < 0)
            return event_1.Event.feedback(player, 'You do not have enough gold!');
        player.gainGold(-cost, false);
        if (isDoubleDown) {
            player.$statistics.incrementStat('Character.Gamble.DoubleDown');
        }
        let message = '';
        if (event_1.Event.chance.bool({ likelihood: odds })) {
            const winnings = Math.round(cost * multiplier);
            player.gainGold(winnings, false);
            player.$statistics.incrementStat('Character.Gold.Gamble.Win', winnings);
            player.$statistics.incrementStat('Character.Gamble.WinTimes');
            if (isDoubleDown) {
                player.$statistics.incrementStat('Character.Gamble.WinTimesDoubleDown');
            }
            message = `%player got lucky and bet ${cost.toLocaleString()} gold against the odds of ${odds}%${isDoubleDown ? ' (Double Down)' : ''}. %She came out ahead with ${winnings.toLocaleString()} gold!`;
        }
        else {
            player.$statistics.incrementStat('Character.Gold.Gamble.Lose', cost);
            player.$statistics.incrementStat('Character.Gamble.LoseTimes');
            if (isDoubleDown) {
                player.$statistics.incrementStat('Character.Gamble.LoseTimesDoubleDown');
            }
            message = `%player felt lucky and bet ${cost.toLocaleString()} gold against the odds of ${odds}${isDoubleDown ? ' (Double Down)' : ''}%. %She lost it all at the table.`;
        }
        message = this._parseText(message, player);
        this.emitMessage({ affected: [player], eventText: message, category: adventure_log_1.MessageCategories.GOLD });
    }
}
Gambling.WEIGHT = exports.WEIGHT;
exports.Gambling = Gambling;
