"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const equipment_1 = require("../../../core/base/equipment");
const adventure_log_1 = require("../../../shared/adventure-log");
const string_generator_1 = require("../../../shared/string-generator");
exports.WEIGHT = -1;
// Get the gift of the divine
class Providence extends event_1.Event {
    static generateProvidenceItem(multiplier = 1, t0shift = 0, t1shift = 0, t2shift = 0) {
        const baseItem = {
            type: 'providence',
            itemClass: 'basic',
            name: string_generator_1.StringGenerator.providence()
        };
        _.each(event_1.Event.t0stats, stat => {
            if (event_1.Event.chance.bool({ likelihood: 30 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-15, (-150 + t0shift) * multiplier),
                max: (150 + t0shift) * multiplier
            });
        });
        _.each(event_1.Event.t1stats, stat => {
            if (event_1.Event.chance.bool({ likelihood: 40 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-10, (-100 + t1shift) * multiplier),
                max: (100 + t1shift) * multiplier
            });
        });
        _.each(event_1.Event.t2stats, stat => {
            if (event_1.Event.chance.bool({ likelihood: 50 }))
                return;
            baseItem[stat] = event_1.Event.chance.integer({
                min: Math.min(-10, (-75 + t2shift) * multiplier),
                max: (75 + t2shift) * multiplier
            });
        });
        return new equipment_1.Equipment(baseItem);
    }
    static doBasicProvidencing(player, provData) {
        let message = '';
        const { xp, level, gender, profession, gold } = provData;
        if (xp && event_1.Event.chance.bool({ likelihood: this.probabilities.xp })) {
            const curPlayerXp = player.xp;
            const lostXp = curPlayerXp - xp;
            player._xp.add(xp);
            message = `${message} ${xp > 0 ? 'Gained' : 'Lost'} ${Math.abs(xp).toLocaleString()} xp!`;
            if (xp < 0 && player._xp.atMinimum()) {
                message = `${message} Lost 1 level!`;
                player._level.sub(1);
                player.resetMaxXp();
                player._xp.set(player._xp.maximum + lostXp);
                player.emitLevelChange();
            }
        }
        else if (level && event_1.Event.chance.bool({ likelihood: this.probabilities.level })) {
            player._level.add(level);
            player.resetMaxXp();
            message = `${message} ${level > 0 ? 'Gained' : 'Lost'} ${Math.abs(level)} levels!`;
            player.emitLevelChange();
        }
        if (player.gender !== gender && event_1.Event.chance.bool({ likelihood: this.probabilities.gender })) {
            player.gender = gender;
            message = `${message} Gender is now ${gender}!`;
        }
        if (gold && event_1.Event.chance.bool({ likelihood: this.probabilities.gold })) {
            player.gold += gold;
            message = `${message} ${gold > 0 ? 'Gained' : 'Lost'} ${Math.abs(gold).toLocaleString()} gold!`;
        }
        if (profession !== player.professionName && event_1.Event.chance.bool({ likelihood: this.probabilities.profession })) {
            player.changeProfession(profession);
            message = `${message} Profession is now ${profession}!`;
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.personality })) {
            _.each(player.$personalities.earnedPersonalities, ({ name }) => {
                if (name === 'Camping' || event_1.Event.chance.bool({ likelihood: 50 }))
                    return;
                player.togglePersonality(name);
            });
            message = `${message} Personality shift!`;
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.title })) {
            player.changeTitle(_.sample(player.$achievements.titles()));
            message = `${message} Title change!`;
        }
        if (event_1.Event.chance.bool({ likelihood: this.probabilities.ilp })) {
            player.$premium.addIlp(5);
            message = `${message} Got ILP!`;
            player._updatePremium();
        }
        return message;
    }
    static fatePoolProvidence(player, baseMessage) {
        const canGainXp = player.level.__current < player.level.maximum - 100;
        const providenceData = {
            xp: event_1.Event.chance.integer({ min: -player._xp.maximum, max: canGainXp ? player._xp.maximum : 0 }),
            level: event_1.Event.chance.integer({ min: -3, max: canGainXp ? 2 : 0 }),
            gender: _.sample(player.validGenders),
            profession: _.sample(this._professions(player)) || 'Generalist',
            gold: event_1.Event.chance.integer({ min: -Math.min(30000, player.gold), max: 20000 })
        };
        baseMessage = `${baseMessage} ${this.doBasicProvidencing(player, providenceData).trim()}`;
        if (player.equipment.providence && event_1.Event.chance.bool({ likelihood: this.probabilities.clearProvidence })) {
            player.equipment.providence = null;
            delete player.equipment.providence;
            baseMessage = `${baseMessage} Providence cleared!`;
        }
        else if (!player.equipment.providence && event_1.Event.chance.bool({ likelihood: this.probabilities.newProvidence })) {
            player.equipment.providence = this.generateProvidenceItem(Math.round(player.level / 10));
        }
        player.recalculateStats();
        this.emitMessage({ affected: [player], eventText: baseMessage, category: adventure_log_1.MessageCategories.EXPLORE });
    }
    static guildHallProvidence(player, baseMessage) {
        const fortuneTellerLevel = player.guild.buildings.levels.FortuneTeller || 0;
        const xpMin = Math.floor(-player._xp.maximum + (player._xp.maximum * Math.min(fortuneTellerLevel, 90) / 100));
        const xpMax = Math.floor(player._xp.maximum * Math.min(fortuneTellerLevel / 10, 10) / 100);
        const goldMin = -Math.min(30000 - (Math.min(fortuneTellerLevel, 25) * 100), player.gold);
        const goldMax = 20000 + fortuneTellerLevel * 100;
        const providenceData = {
            xp: event_1.Event.chance.integer({ min: xpMin, max: xpMax }),
            gender: _.sample(player.validGenders),
            profession: _.sample(this._professions(player)) || 'Generalist',
            gold: event_1.Event.chance.integer({ min: goldMin, max: goldMax })
        };
        const clearChance = Math.min(50, 5 + (fortuneTellerLevel * 2));
        const newChance = Math.min(80, 30 + fortuneTellerLevel);
        baseMessage = `${baseMessage} ${this.doBasicProvidencing(player, providenceData).trim()}`;
        if (player.equipment.providence && event_1.Event.chance.bool({ likelihood: clearChance })) {
            player.equipment.providence = null;
            delete player.equipment.providence;
            baseMessage = `${baseMessage} Providence cleared!`;
        }
        else if (!player.equipment.providence && event_1.Event.chance.bool({ likelihood: newChance })) {
            player.equipment.providence = this.generateProvidenceItem(Math.round(player.level / 10), fortuneTellerLevel, Math.floor(fortuneTellerLevel / 2), Math.floor(fortuneTellerLevel / 3));
        }
        player.recalculateStats();
        this.emitMessage({ affected: [player], eventText: baseMessage, category: adventure_log_1.MessageCategories.EXPLORE });
    }
    static operateOn(player, { isGuild } = {}) {
        if (isGuild && player.hasGuild) {
            const fortuneTellerName = player.guild.getProperty('FortuneTeller', 'Name');
            const fortuneTellerDisplay = fortuneTellerName ? fortuneTellerName + ', the Guild Fortune Teller' : 'the Guild Fortune Teller';
            const eventText = this._parseText(`%player met with ${fortuneTellerDisplay} and had %hisher fortune told!`, player);
            this.guildHallProvidence(player, eventText);
        }
        else {
            const eventText = this.eventText('providence', player);
            this.fatePoolProvidence(player, eventText);
        }
        player.$statistics.batchIncrement(['Character.Events', 'Character.Event.Providence']);
    }
}
Providence.WEIGHT = exports.WEIGHT;
Providence.probabilities = {
    xp: 10,
    level: 5,
    gender: 80,
    gold: 50,
    profession: 10,
    clearProvidence: 20,
    newProvidence: 75,
    personality: 50,
    title: 75,
    ilp: 1
};
Providence._professions = (player) => {
    return _.keys(player.$statistics.getStat('Character.Professions')) || ['Generalist'];
};
exports.Providence = Providence;
