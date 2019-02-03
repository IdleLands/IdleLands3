"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const adventure_log_1 = require("../../../shared/adventure-log");
const equipment_1 = require("../../../core/base/equipment");
const stat_calculator_1 = require("../../../shared/stat-calculator");
exports.WEIGHT = 6;
// Enchant an item (+special stat, +50 to random stat, +1 enchantLevel)
class Enchant extends event_1.Event {
    static getBlowupItem(item, enchantLevel) {
        const r = (div) => Math.floor(event_1.Event.chance.integer({ min: -enchantLevel * 10, max: enchantLevel * 10 }) / div);
        const stats = { str: r(2), dex: r(2), con: r(3), int: r(0.5), agi: r(1), luk: r(-1), sentimentality: enchantLevel * 1000 };
        stats.type = item.type;
        const junks = [
            'blown up pile of junk',
            'pile of mystic dust',
            'dusting of mystic ash',
            'ball of mystic ooze',
            'mystical broken shards',
            'chunk of old soul',
            'unrecognizable item',
            'handful of flux capacitor innards',
            `broken ${stats.type}`
        ];
        stats.itemClass = 'newbie';
        stats.name = _.sample(junks);
        return new equipment_1.Equipment(stats);
    }
    static getStatAndBoost(item) {
        if (event_1.Event.chance.bool({ likelihood: 75 })) {
            const stat = this.pickStat(item);
            const boost = 50;
            return [stat, boost];
        }
        const { enchantMax, name } = _.sample(stat_calculator_1.SPECIAL_STATS_BASE.concat(stat_calculator_1.ATTACK_STATS_BASE));
        return [name, enchantMax];
    }
    static normalEnchant(player) {
        const item = this.pickValidItemForEnchant(player);
        if (!item) {
            const enchantTotal = _.sumBy(_.values(player.equipment), 'enchantLevel');
            if (enchantTotal < 100)
                return [];
            const eventText = this._parseText('%player attempted to enchant %hisher gear, but it failed!', player);
            this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.ITEM });
            player.$statistics.incrementStat('Character.Item.OverEnchant');
            return [];
        }
        const eventType = _.sample(['enchant', 'tinker']);
        let eventText = this.eventText(eventType, player, { item: item.fullname });
        const [stat, boost] = this.getStatAndBoost(item);
        item[stat] = item[stat] || 0;
        eventText = `${eventText} [${stat} ${item[stat]} -> ${item[stat] + boost}]`;
        item[stat] += boost;
        item.enchantLevel = item.enchantLevel || 0;
        item.enchantLevel++;
        this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.ITEM });
        item.score;
    }
    static guildEnchant(player) {
        const item = this.pickValidItem(player);
        if (!item) {
            const enchantTotal = _.sumBy(_.values(player.equipment), 'enchantLevel');
            if (enchantTotal < 100)
                return [];
            const eventText = this._parseText('%player attempted to enchant %hisher gear, but it failed!', player);
            this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.ITEM });
            player.$statistics.incrementStat('Character.Item.OverEnchant');
            return [];
        }
        const enchantressLevel = player.guild.buildings.levels.Enchantress || 0;
        const enchantressName = player.guild.getProperty('Enchantress', 'Name');
        const doUnsafe = player.guild.getProperty('Enchantress', 'AttemptUnsafeEnchant') === 'Yes';
        const enchantressDisplay = enchantressName ? enchantressName + ', the Guild Enchantress' : 'the Guild Enchantress';
        let baseEventText = `%player met with ${enchantressDisplay} and wanted to get an item boost!`;
        const maxEnchant = 1 + (enchantressLevel / 5);
        const maxSafeEnchant = maxEnchant - 2;
        const currentLevel = item.enchantLevel;
        const isUnsafe = currentLevel + 1 > maxSafeEnchant;
        const cost = (currentLevel + 1) * 1000000;
        const itemName = item.fullname;
        if (player.gold < cost) {
            baseEventText = `${baseEventText} But unfortunately %player does not have enough gold for a +${currentLevel + 1} enchantment!`;
        }
        else if (isUnsafe && !doUnsafe) {
            baseEventText = `${baseEventText} Unfortunately the offered enchantment to +${currentLevel + 1} was unsafe!`;
        }
        else {
            player.gold -= cost;
            const blowupChance = isUnsafe ? (10 * (10 - enchantressLevel % 10)) : 0;
            if (event_1.Event.chance.bool({ likelihood: blowupChance })) {
                const blownUpItem = this.getBlowupItem(item, currentLevel + 1);
                baseEventText = `${baseEventText} Sadly, %item was reduced to an unrecognizable mess while attempting a +${currentLevel + 1} enchantment.`;
                player.equip(blownUpItem);
            }
            else {
                baseEventText = `${baseEventText} Fortunately, %item was successfully enchanted to +${currentLevel + 1}!`;
                const [stat, boost] = this.getStatAndBoost(item);
                item[stat] = item[stat] || 0;
                baseEventText = `${baseEventText} [${stat} ${item[stat]} -> ${item[stat] + boost}]`;
                item[stat] += boost;
                item.enchantLevel++;
                item.score;
            }
        }
        const eventText = this._parseText(baseEventText, player, { item: itemName });
        this.emitMessage({ affected: [player], eventText, category: adventure_log_1.MessageCategories.ITEM });
    }
    static operateOn(player, { isGuild } = {}) {
        if (isGuild && player.hasGuild) {
            this.guildEnchant(player);
        }
        else {
            this.normalEnchant(player);
        }
        player.recalculateStats();
        player.$updateEquipment = true;
        return [player];
    }
}
Enchant.WEIGHT = exports.WEIGHT;
exports.Enchant = Enchant;
