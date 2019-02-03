"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBattleDebug = process.env.BATTLE_DEBUG;
const _ = require("lodash");
const event_1 = require("../event");
const game_state_1 = require("../../../core/game-state");
const party_1 = require("../../../plugins/party/party");
const adventure_log_1 = require("../../../shared/adventure-log");
const settings_1 = require("../../../static/settings");
exports.WEIGHT = isBattleDebug ? 250 : 72;
// Create a party
class Party extends event_1.Event {
    static operateOn(player) {
        if (player.$personalities.isActive('Solo') || player.level < settings_1.SETTINGS.minPartyLevel)
            return;
        const validPlayers = _.reject(game_state_1.GameState.getInstance().getPlayers(), p => p.$partyName || p === player
            || p.$personalities.isActive('Solo')
            || p.$personalities.isActive('Camping')
            || p.level < settings_1.SETTINGS.minPartyLevel
            || p.map !== player.map);
        if (player.$partyName) {
            if (player.party.players.length < settings_1.SETTINGS.maxPartyMembers && validPlayers.length >= 1) {
                const newPlayer = _.sample(validPlayers);
                player.party.playerJoin(newPlayer);
                this.emitMessage({
                    affected: player.party.players,
                    eventText: this._parseText('%partyName picked up a stray %player on their travels!', newPlayer, { partyName: player.party.name }),
                    category: adventure_log_1.MessageCategories.PARTY
                });
            }
            return;
        }
        if (validPlayers.length < 3)
            return;
        const partyInstance = new party_1.Party({ leader: player });
        const newPlayers = _.sampleSize(validPlayers, 3);
        player.$statistics.incrementStat('Character.Party.Create');
        _.each(newPlayers, p => {
            partyInstance.playerJoin(p);
        });
        const partyMemberString = _(newPlayers).map(p => `«${p.fullname}»`).join(', ');
        const eventText = this.eventText('party', player, { partyName: partyInstance.name, partyMembers: partyMemberString });
        this.emitMessage({ affected: partyInstance.players, eventText, category: adventure_log_1.MessageCategories.PARTY });
        return player.party.players;
    }
}
Party.WEIGHT = exports.WEIGHT;
exports.Party = Party;
