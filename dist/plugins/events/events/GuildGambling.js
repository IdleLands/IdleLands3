"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const XPForsake_1 = require("./XPForsake");
const GoldForsake_1 = require("./GoldForsake");
exports.WEIGHT = 0;
const MIN_GOLD = 5000;
const INCOME_PERCENT = 10;
// Get the opportunity to gamble away your gold
class GuildGambling extends event_1.Event {
    static operateOn(player) {
        if (!player.hasGuild)
            return;
        const tavernLevel = player.guild.buildings.levels.Tavern || 0;
        if (tavernLevel === 0)
            return;
        const MOD_INCOME_PERCENT = INCOME_PERCENT + Math.floor(tavernLevel / 5);
        const MAX_GOLD = Math.min(player.gold / MOD_INCOME_PERCENT, tavernLevel * 200000);
        if (player.gold < MIN_GOLD * MOD_INCOME_PERCENT)
            return;
        const cost = this.chance.integer({ min: MIN_GOLD, max: MAX_GOLD });
        const multiplierMin = Math.max(1, 1 + (0.05 * Math.floor(tavernLevel / 10)));
        const multiplierMax = Math.max(multiplierMin + 0.1, 1 + (0.1 * Math.floor(tavernLevel / 5)));
        const oddsMin = Math.min(20, 5 + (0.2 * Math.floor(tavernLevel / 15)));
        const oddsMax = Math.min(75, 25 + (Math.floor(tavernLevel / 3)));
        const id = event_1.Event.chance.guid();
        const multiplier = this.chance.floating({ fixed: 2, min: Math.min(3, multiplierMin), max: Math.min(5, multiplierMax) });
        const odds = this.chance.integer({ min: oddsMin, max: oddsMax });
        const message = `Would you like to gamble ${cost.toLocaleString()} gold at a ${multiplier}x rate with ${odds}% chance to win?`;
        const extraData = { multiplier, cost, odds };
        player.addChoice({ id, message, extraData, event: 'GuildGambling', choices: ['Yes', 'No', 'Double Down', 'Cheat'] });
        return [player];
    }
    static makeChoice(player, id, response) {
        if (response === 'No')
            return;
        if (!player.hasGuild)
            return;
        const tavernLevel = player.guild.buildings.levels.Tavern || 0;
        if (tavernLevel === 0)
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
        const isCheat = response === 'Cheat';
        const getCaughtChance = Math.max(15, 50 - (tavernLevel / 5));
        if (isCheat && event_1.Event.chance.bool({ likelihood: getCaughtChance })) {
            let cheatMessage = '%player got caught cheating and lost some XP and Gold as a punishment!';
            cheatMessage = this._parseText(cheatMessage, player);
            this.emitMessage({ affected: [player], eventText: cheatMessage, category: adventure_log_1.MessageCategories.GOLD });
            player.$statistics.incrementStat('Character.Gamble.CheatFail');
            XPForsake_1.XPForsake.operateOn(player, '%player got caught cheating and lost %xp xp!');
            GoldForsake_1.GoldForsake.operateOn(player, '%player got caught cheating and lost %gold gold!');
            return;
        }
        if (isCheat) {
            odds += 10;
            player.$statistics.incrementStat('Character.Gamble.CheatSuccess');
        }
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
GuildGambling.WEIGHT = 0;
exports.GuildGambling = GuildGambling;
