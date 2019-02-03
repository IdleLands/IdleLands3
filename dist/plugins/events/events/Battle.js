"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBattleDebug = process.env.BATTLE_DEBUG;
const _ = require("lodash");
const event_1 = require("../event");
const battle_1 = require("../../combat/battle");
const party_1 = require("../../party/party");
const monster_generator_1 = require("../../../shared/monster-generator");
const adventure_log_1 = require("../../../shared/adventure-log");
const logger_1 = require("../../../shared/logger");
const settings_1 = require("../../../static/settings");
exports.WEIGHT = isBattleDebug ? 300 : 3;
// Create a battle
class Battle extends event_1.Event {
    static operateOn(player) {
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        if (!player.party) {
            const partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
        }
        const monsters = monster_generator_1.MonsterGenerator.generateMonsters(player.party);
        const monsterPartyInstance = new party_1.Party({ leader: monsters[0] });
        monsterPartyInstance.isMonsterParty = true;
        if (monsters.length > 1) {
            for (let i = 1; i < monsters.length; i++) {
                monsterPartyInstance.playerJoin(monsters[i]);
            }
        }
        const parties = [player.party, monsterPartyInstance];
        const introText = this.eventText('battle', player, { _eventData: { parties } });
        const battle = new battle_1.Battle({ introText, parties });
        this.emitMessage({ affected: player.party.players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('Battle', e, battle.saveObject());
        }
        _.each(player.party.players, player => player.recalculateStats());
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        monsterPartyInstance.disband();
        return [player];
    }
}
Battle.WEIGHT = exports.WEIGHT;
exports.Battle = Battle;
