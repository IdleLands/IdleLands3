"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const battle_1 = require("../../combat/battle");
const party_1 = require("../../party/party");
const FindItem_1 = require("./FindItem");
const monster_generator_1 = require("../../../shared/monster-generator");
const adventure_log_1 = require("../../../shared/adventure-log");
const _emitter_1 = require("../../players/_emitter");
const logger_1 = require("../../../shared/logger");
const settings_1 = require("../../../static/settings");
exports.WEIGHT = -1;
// Create a battle
class BattleBoss extends event_1.Event {
    static operateOn(player, { bossName, bosses }) {
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        if (!player.party) {
            const partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
        }
        const monsterPartyInstance = new party_1.Party({ leader: bosses[0] });
        monsterPartyInstance.isMonsterParty = true;
        if (bosses.length > 1) {
            for (let i = 1; i < bosses.length; i++) {
                monsterPartyInstance.playerJoin(bosses[i]);
            }
        }
        const parties = [player.party, monsterPartyInstance];
        const introText = `${player.party.displayName} is gearing up for an epic boss battle against ${monsterPartyInstance.displayName}!`;
        const battle = new battle_1.Battle({ introText, parties });
        this.emitMessage({ affected: player.party.players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('BattleBoss', e, battle.saveObject());
        }
        if (!battle.isLoser(player.party) && !battle._isTie) {
            _.each(player.party.players, p => {
                if (!p.$statistics)
                    return;
                _.each(bosses, boss => {
                    p.$statistics.incrementStat(`Character.BossKills.${boss._name}`);
                });
            });
            monster_generator_1.MonsterGenerator._setBossTimer(bossName);
            const dropItems = _.compact(_.flattenDeep(_.map(bosses, boss => {
                return _.map(_.values(boss.equipment), item => {
                    if (!item.dropPercent)
                        return null;
                    if (!event_1.Event.chance.bool({ likelihood: item.dropPercent }))
                        return null;
                    return item;
                });
            })));
            const dropCollectibles = _.compact(_.flattenDeep(_.map(bosses, boss => {
                return _.map(boss._collectibles, coll => {
                    if (!coll.dropPercent)
                        return null;
                    if (!event_1.Event.chance.bool({ likelihood: coll.dropPercent }))
                        return null;
                    return coll;
                });
            })));
            if (dropItems.length > 0) {
                _.each(dropItems, item => {
                    _.each(player.party.players, p => {
                        if (!p.canEquip(item))
                            return;
                        FindItem_1.FindItem.operateOn(p, null, item);
                    });
                });
            }
            if (dropCollectibles.length > 0) {
                _.each(dropCollectibles, coll => {
                    const collectibleObj = {
                        name: coll.name,
                        map: 'Boss',
                        region: bossName,
                        rarity: coll.rarity || 'guardian',
                        description: coll.flavorText,
                        storyline: coll.storyline,
                        foundAt: Date.now()
                    };
                    _.each(player.party.players, p => {
                        if (p.$collectibles.hasCollectible(collectibleObj.name))
                            return;
                        p.$collectibles.addCollectible(collectibleObj);
                        _emitter_1.emitter.emit('player:collectible', { player: p, collectible: collectibleObj });
                    });
                });
            }
        }
        if (!player.party)
            return [];
        const affected = player.party.players;
        _.each(affected, player => player.recalculateStats());
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        monsterPartyInstance.disband();
        return affected;
    }
}
BattleBoss.WEIGHT = exports.WEIGHT;
exports.BattleBoss = BattleBoss;
