"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_state_1 = require("../../../core/game-state");
const achievement_1 = require("../achievement");
class Anniversary extends achievement_1.Achievement {
    static achievementData(player) {
        const playerSteps = player.$statistics.getStat('Character.Steps');
        const totalCamps = player.$statistics.getStat('Character.Movement.Camping');
        if (playerSteps + totalCamps < 6311520)
            return [];
        let tier = 1;
        while (playerSteps + totalCamps >= 6311520 * tier) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                xp: tier * 100,
                str: (player, baseValue) => baseValue * 0.01 * tier,
                con: (player, baseValue) => baseValue * 0.01 * tier,
                dex: (player, baseValue) => baseValue * 0.01 * tier,
                luk: (player, baseValue) => baseValue * 0.01 * tier,
                int: (player, baseValue) => baseValue * 0.01 * tier,
                agi: (player, baseValue) => baseValue * 0.01 * tier,
                strDisplay: `+${tier}%`,
                conDisplay: `+${tier}%`,
                dexDisplay: `+${tier}%`,
                lukDisplay: `+${tier}%`,
                intDisplay: `+${tier}%`,
                agiDisplay: `+${tier}%`
            }];
        rewards.push({ type: 'petattr', petattr: 'a handful of confetti' });
        rewards.push({ type: 'title', title: 'Wise', deathMessage: '%player may be wise, but %heshe was not smart enough to avoid an untimely death.' });
        player.permanentAchievements = player.permanentAchievements || {};
        if (!player.permanentAchievements['Anniversary' + tier]) {
            player.permanentAchievements['Anniversary' + tier] = true;
            game_state_1.GameState.getInstance().addFestival({
                name: `${player.name}'s ${tier} Year Anniversary`,
                message: `${player.name} has taken ${tier} year(s) worth of steps! +${tier * 100}% Item Find Range and +${tier * 25}% more gold for everyone for 24 hours!`,
                startedBy: player.name,
                hourDuration: 24,
                bonuses: {
                    itemFindRangeMultiplier: tier * 1,
                    gold: tier * 0.25
                }
            });
        }
        ;
        if (tier >= 2) {
            rewards.push({ type: 'petattr', petattr: 'two handfuls of confetti' });
            rewards.push({ type: 'gender', gender: `veteran male` });
            rewards.push({ type: 'gender', gender: `veteran female` });
            rewards.push({ type: 'title', title: 'Revered', deathMessage: 'All of Idliathlia mourns the loss of %player.' });
        }
        if (tier >= 3) {
            rewards.push({ type: 'petattr', petattr: 'a thousand-yard stare' });
            rewards.push({ type: 'gender', gender: `angry bear` });
            rewards.push({ type: 'gender', gender: `veteran glowcloud` });
            rewards.push({ type: 'title', title: 'Legend', deathMessage: 'The legendary %player finally shuffled off this mortal coil.' });
        }
        return [{
                tier,
                name: 'Anniversary',
                desc: `Gain +(${tier * 100}) Bonus XP (added every time XP is gained) and +${tier}% STR/CON/DEX/AGI/INT/LUK for taking ${tier} year(s) worth of steps.`,
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards
            }];
    }
}
exports.Anniversary = Anniversary;
