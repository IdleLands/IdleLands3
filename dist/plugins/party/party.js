"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
const game_state_1 = require("../../core/game-state");
const string_generator_1 = require("../../shared/string-generator");
const _emitter_1 = require("../../plugins/players/_emitter");
const PartyLeave_1 = require("../events/events/PartyLeave");
const adventure_log_1 = require("../../shared/adventure-log");
const messagecreator_1 = require("../../plugins/events/messagecreator");
class Party {
    constructor({ leader }) {
        this.players = [];
        this.name = this.generateName();
        game_state_1.GameState.getInstance().parties[this.name] = this;
        this.playerJoin(leader);
    }
    get humanPlayers() {
        return _.filter(this.players, player => player.isPlayer);
    }
    get score() {
        let score = 0;
        if (!this.leader) {
            // Bonecraft edge case ends party with no players
            return 0;
        }
        else if (this.leader.isPlayer) {
            score = _.sum(_.map(this.humanPlayers, 'itemScore')) / this.humanPlayers.length;
        }
        else {
            score = _.sum(_.map(this.players, 'itemScore')) / this.players.length;
        }
        return score;
    }
    get level() {
        let level = 0;
        if (!this.leader) {
            // Bonecraft edge case ends party with no players
            return 0;
        }
        else if (this.leader.isPlayer) {
            level = _.sum(_.map(this.humanPlayers, 'level')) / this.humanPlayers.length;
        }
        else {
            level = _.sum(_.map(this.players, 'level')) / this.players.length;
        }
        return level;
    }
    get displayName() {
        return this.players.length === 1 ? this.players[0].fullname : `${this.name} (${_.map(this.players, 'fullname').join(', ')})`;
    }
    generateName() {
        let name = null;
        do {
            name = string_generator_1.StringGenerator.party();
        } while (game_state_1.GameState.getInstance().parties[name]);
        return name;
    }
    allowPlayerToLeaveParty(player) {
        PartyLeave_1.PartyLeave.operateOn(player);
    }
    setPartySteps(player) {
        player.partySteps = chance.integer({ min: 50, max: 200 });
    }
    playerTakeStep(player) {
        if (!player.partySteps)
            this.setPartySteps(player);
        player.partySteps--;
        if (player.partySteps <= 0) {
            this.allowPlayerToLeaveParty(player);
        }
    }
    playerJoin(player) {
        this.players.push(player);
        player.$partyName = this.name;
        if (player.isPlayer && !this.isMonsterParty) {
            player.$statistics.incrementStat('Character.Party.Join');
            player.partySteps = 0;
            if (this.players.length > 1) {
                this.teleportNear(player, this.players[this.players.length - 2]);
            }
            if (this.players.length > 1) {
                game_state_1.GameState.getInstance().reAddPlayersInOrder(this.players);
            }
        }
    }
    playerLeave(player, disbanding = false) {
        if (!disbanding && !this.isMonsterParty && !player.$battle && player.isPlayer) {
            _emitter_1.emitter.emit('player:event', {
                affected: [player],
                eventText: messagecreator_1.MessageParser.stringFormat('%player has left %partyName.', player, { partyName: this.name }),
                category: adventure_log_1.MessageCategories.PARTY
            });
        }
        let doDisband = false;
        if (!player.$battle && player.isPlayer && ((this.players.length <= 2 && !disbanding) || player === this.leader))
            doDisband = true;
        this.players = _.without(this.players, player);
        player.$partyName = null;
        if (!this.isMonsterParty && player.isPlayer) {
            player.$statistics.incrementStat('Character.Party.Leave');
        }
        player.choices = _.reject(player.choices, c => c.event === 'PartyLeave');
        if (doDisband && !disbanding)
            this.disband(player);
    }
    get leader() {
        return this.players[0];
    }
    getFollowTarget(player) {
        if (player === this.leader)
            return;
        return this.players[_.indexOf(this.players, player) - 1];
    }
    teleportNear(me, target) {
        me.x = target.x;
        me.y = target.y;
        me.map = target.map;
    }
    buildTransmitObject() {
        return {
            name: this.name,
            isBattleParty: this.isBattleParty,
            players: _.map(this.players, p => {
                return {
                    name: p.fullname,
                    shortName: p.name,
                    level: p.level,
                    profession: p.professionName
                };
            })
        };
    }
    prepareForCombat() {
        _.each(this.players, p => {
            const pet = p.$pets ? p.$pets.activePet : null;
            if (!pet || !chance.bool({ likelihood: pet.$_scale.battleJoinPercent }))
                return;
            this.playerJoin(pet);
        });
    }
    disband(player, showMessage = true) {
        if (!this.isBattleParty && !this.isMonsterParty && showMessage) {
            _emitter_1.emitter.emit('player:event', {
                affected: this.players,
                eventText: messagecreator_1.MessageParser.stringFormat('%player has disbanded %partyName.', player || this.leader, { partyName: this.name }),
                category: adventure_log_1.MessageCategories.PARTY
            });
        }
        _.each(this.players, p => this.playerLeave(p, true));
        game_state_1.GameState.getInstance().parties[this.name] = null;
        delete game_state_1.GameState.getInstance().parties[this.name];
    }
}
exports.Party = Party;
