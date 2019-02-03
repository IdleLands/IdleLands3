"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const event_1 = require("../event");
const game_state_1 = require("../../../core/game-state");
const battle_1 = require("../../combat/battle");
const party_1 = require("../../party/party");
const adventure_log_1 = require("../../../shared/adventure-log");
const logger_1 = require("../../../shared/logger");
const settings_1 = require("../../../static/settings");
exports.WEIGHT = 3;
// Create a pvp battle
class BattlePvP extends event_1.Event {
    static operateOn(player) {
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        const allPlayers = _.reject(game_state_1.GameState.getInstance().getPlayers(), p => p.$battle || p === player);
        let opponent = null;
        // 1v1
        if (!player.party || player.party.players.length === 1) {
            const partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
            opponent = _(allPlayers)
                .reject(p => p.party)
                .reject(p => p.$personalities.isActive('Camping'))
                .reject(p => p.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
                .reject(p => p.score < player.score - settings_1.SETTINGS.pvpBattleRange || p.score > player.score + settings_1.SETTINGS.pvpBattleRange)
                .sample();
            if (!opponent)
                return;
            const opponentParty = new party_1.Party({ leader: opponent });
            opponentParty.isBattleParty = true;
            // XvX
        }
        else {
            opponent = _(allPlayers)
                .reject(p => p.$personalities.isActive('Camping'))
                .reject(p => p.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
                .reject(p => !p.party || p.party === player.party || p.party.players.length === 1)
                .reject(p => p.party.score < player.party.score - settings_1.SETTINGS.pvpBattleRange || p.party.score > player.party.score + settings_1.SETTINGS.pvpBattleRange)
                .sample();
            if (!opponent)
                return;
        }
        const parties = [player.party, opponent.party];
        const players = _.flatten(_.map(parties, party => party.players));
        const introText = this.eventText('battle', player, { _eventData: { parties } });
        const battle = new battle_1.Battle({ introText, parties });
        this.emitMessage({ affected: players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('Battle:PvP', e, battle.saveObject());
        }
        const affected = player.party.players.concat(opponent.party.players);
        _.each(affected, player => player.recalculateStats());
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        if (opponent.party.isBattleParty) {
            opponent.party.disband();
        }
        return affected;
    }
}
BattlePvP.WEIGHT = exports.WEIGHT;
exports.BattlePvP = BattlePvP;
