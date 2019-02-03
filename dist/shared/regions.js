"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regions = {
    'Frigri Town': {
        shopPriceMultiplier: () => 2.5,
        shopSlots: () => 3,
        shopQuality: () => 2.5,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Homlet Town': {
        shopPriceMultiplier: () => 1.3,
        shopSlots: () => 1,
        shopQuality: () => 2.3,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Norkos Town': {
        luck: () => 15,
        shopPriceMultiplier: () => 1,
        shopSlots: () => 5,
        shopQuality: () => 1,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Maeles Town': {
        shopPriceMultiplier: () => 2,
        shopSlots: () => 2,
        shopQuality: () => 1.5,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Raburro Town': {
        shopPriceMultiplier: () => 5,
        shopSlots: () => 10,
        shopQuality: () => 0.9,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Vocalnus Town': {
        shopPriceMultiplier: () => 1,
        shopSlots: () => 3,
        shopQuality: () => 1.4,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Astral Town': {
        shopPriceMultiplier: () => 10,
        shopSlots: () => 5,
        shopQuality: () => 10,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Astral Boardwalk': {
        shopPriceMultiplier: () => 10,
        shopSlots: () => 5,
        shopQuality: () => 10,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Desert Town': {
        shopPriceMultiplier: () => 1.5,
        shopSlots: () => 4,
        shopQuality: () => 1.2,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Tree Town': {
        shopPriceMultiplier: () => 1.5,
        shopSlots: () => 4,
        shopQuality: () => 1.4,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Cliff Town': {
        shopPriceMultiplier: () => 2.1,
        shopSlots: () => 5,
        shopQuality: () => 2.3,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Mountain Town': {
        shopPriceMultiplier: () => 3.1,
        shopSlots: () => 4,
        shopQuality: () => 3.2,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    Alehaven: {
        shopPriceMultiplier: () => 3.5,
        shopSlots: () => 8,
        shopQuality: () => 6.1,
        TownCrierChance: (player, baseValue) => baseValue * 3
    },
    'Guild Hall': {
        shopPriceMultiplier: (player) => player.hasGuild && player.guild.hasBuilt('GuildShop') ? 1 + (Math.floor(player.guild.buildings.levels.GuildShop / 3) * 0.5) : 0,
        shopSlots: (player) => player.hasGuild && player.guild.hasBuilt('GuildShop') ? 1 + Math.floor(player.guild.buildings.levels.GuildShop / 10) : 0,
        shopQuality: (player) => player.hasGuild && player.guild.hasBuilt('GuildShop') ? player.guild.buildings.levels.GuildShop / 5 : 0,
        TownCrierChance: (player, baseValue) => baseValue * 2,
        GuildGamblingChance: (player) => player.hasGuild && player.guild.hasBuilt('Tavern') ? 3 : 0,
        GuildPartyChance: (player) => player.hasGuild && player.guild.hasBuilt('Tavern') ? 9 : 0,
        GoldBlessPartyChance: (player, baseValue) => baseValue * 1.05,
        BattleChance: (player, baseValue) => baseValue * 0,
        BattlePvPChance: (player, baseValue) => baseValue * 0
    },
    'Dangerous Cave Area': {
        BattleChance: (player, baseValue) => baseValue * 1.2,
        BattlePvPChance: (player, baseValue) => baseValue * 1.2
    },
    'Maeles Cave Area': {
        BattleChance: (player, baseValue) => baseValue * 1.2,
        BattlePvPChance: (player, baseValue) => baseValue * 1.2
    },
    'Norkos Fisheries Area': {
        BattleChance: (player, baseValue) => baseValue * 1.2,
        BattlePvPChance: (player, baseValue) => baseValue * 1.2
    },
    'King\'s Treasure Room': {
        PartyChance: (player, baseValue) => baseValue * 0
    },
    'Chamber of Ascension': {
        PartyChance: (player, baseValue) => baseValue * 0
    }
};
