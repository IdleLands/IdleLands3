"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const game_state_1 = require("../../core/game-state");
const _emitter_1 = require("../players/_emitter");
const logger_1 = require("../../shared/logger");
const Bases = require("./bases");
const Buildings = require("./buildings");
const redis_1 = require("../scaler/redis");
const LEADER = 1;
const MOD = 3;
const MEMBER = 5;
class GuildMember {
}
exports.GuildMember = GuildMember;
class Guild {
    constructor(guildDb) {
        this.$guildDb = guildDb;
    }
    init(opts) {
        _.extend(this, opts);
        if (!this.founded)
            this.founded = Date.now();
        if (!this.level)
            this.level = 1;
        if (!this.gold || _.isNaN(this.gold))
            this.gold = 0;
        if (!this.members)
            this.members = [];
        if (!this.taxRate)
            this.taxRate = 0;
        if (!this.maxMembers)
            this.maxMembers = 10;
        if (!this.motd)
            this.motd = `Welcome to ${this.name} [${this.tag}]!`;
        if (!this.resources)
            this.resources = { wood: 0, stone: 0, clay: 0, astralium: 0 };
        if (!this.baseLocation)
            this.baseLocation = 'Norkos';
        if (!this.buildings)
            this.buildings = { currentlyBuilt: { sm: {}, md: {}, lg: {} }, levels: {}, properties: {} };
        if (!this.buildings.currentlyBuilt)
            this.buildings.currentlyBuilt = { sm: {}, md: {}, lg: {} };
        if (!this.buildings.levels)
            this.buildings.levels = {};
        if (!this.buildings.properties)
            this.buildings.properties = {};
        if (!this.$buildingInstances)
            this.$buildingInstances = {};
        if (!this.$statBoosts)
            this.$statBoosts = {};
        _.each(this.members, member => { if (member.rank > 5)
            member.rank = 5; });
        _.each(_.keys(Buildings), building => this.buildings.levels[building] = this.buildings.levels[building] || 0);
        this.buildBase();
        this.recalculateStats();
    }
    recalculateStats() {
        this.maxMembers = 10 + (this.buildings.levels.Academy || 0);
        const numBuildings = _.size(Buildings);
        const totalLevel = _.sum(_.values(this.buildings.levels));
        this.level = Math.max(1, Math.floor(totalLevel / numBuildings));
        this.$statBoosts = {};
        if (this.$buildingInstances.GardenSmall) {
            const smallGardenLevel = this.buildings.levels.GardenSmall;
            const smallGardenBoost1 = this.getProperty('GardenSmall', 'StatBoost1');
            this.$statBoosts[smallGardenBoost1] = smallGardenLevel;
        }
        if (this.$buildingInstances.GardenMedium) {
            const mediumGardenLevel = this.buildings.levels.GardenMedium;
            const mediumGardenBoost1 = this.getProperty('GardenMedium', 'StatBoost1');
            const mediumGardenBoost2 = this.getProperty('GardenMedium', 'StatBoost2');
            this.$statBoosts[mediumGardenBoost1] = mediumGardenLevel * 20;
            let val = 0;
            switch (mediumGardenBoost2) {
                case 'gold':
                    val = 10;
                    break;
                case 'xp':
                    val = 2;
                    break;
                case 'itemFindRangeMultiplier':
                    val = 0.05;
                    break;
                case 'salvage':
                    val = 1;
                    break;
            }
            this.$statBoosts[mediumGardenBoost2] = mediumGardenLevel * val;
        }
        if (this.$buildingInstances.GardenLarge) {
            const largeGardenLevel = this.buildings.levels.GardenLarge;
            const largeGardenBoost1 = this.getProperty('GardenLarge', 'StatBoost1');
            const largeGardenBoost2 = this.getProperty('GardenLarge', 'StatBoost2');
            const largeGardenBoost3 = this.getProperty('GardenLarge', 'StatBoost3');
            this.$statBoosts[largeGardenBoost1] = largeGardenLevel;
            this.$statBoosts[largeGardenBoost2] = largeGardenLevel;
            let val = 0;
            switch (largeGardenBoost3) {
                case 'hp':
                case 'mp':
                    val = 1000;
                    break;
                case 'hpregen':
                case 'mpregen':
                    val = 200;
                    break;
                case 'damageReduction':
                    val = 100;
                    break;
            }
            this.$statBoosts[largeGardenBoost3] = largeGardenLevel * val;
        }
    }
    verifyPlayer(player) {
        const member = this.getMemberByName(player.name);
        if (!member)
            return;
        if (player.guildName && member.unacceptedInvite) {
        }
    }
    hasBuilt(building) {
        return _(this.buildings.currentlyBuilt.sm).concat(this.buildings.currentlyBuilt.md, this.buildings.currentlyBuilt.lg).includes(building);
    }
    resetBuildings() {
        this.buildings.currentlyBuilt = { sm: [], md: [], lg: [] };
        this.$buildingInstances = {};
    }
    get baseName() {
        return `Guild Base - ${this.name}`;
    }
    get baseMap() {
        return this.$base;
    }
    buildBase() {
        const base = new Bases[this.baseLocation](this);
        this.$base = base;
        base.init();
        game_state_1.GameState.getInstance().world.maps[this.baseName] = base;
        this.rebuildBuildings();
    }
    buildBuilding(name, slot, propagate = true) {
        const buildingProto = Buildings[name];
        if (!this.buildings.levels[name])
            this.buildings.levels[name] = 1;
        if (_.isUndefined(slot) && this.$buildingInstances[name]) {
            slot = this.$buildingInstances[name].$slot;
        }
        const building = new buildingProto(this);
        building.$slot = slot;
        this.$buildingInstances[name] = building;
        this.buildings.currentlyBuilt[buildingProto.size][slot] = name;
        this.$base.buildBuilding(name, buildingProto.size, slot, building);
        this.recalculateStats();
        if (propagate) {
            redis_1.GuildBuildBuildingRedis(this.name, name, slot);
        }
        this.save();
    }
    upgradeBuilding(name, propagate = true) {
        if (!this.buildings.levels[name])
            this.buildings.levels[name] = 1;
        this.buildings.levels[name]++;
        const buildingInstance = this.$buildingInstances[name];
        const instanceProto = Object.getPrototypeOf(buildingInstance).constructor;
        this.$base.updateSignpost(name, instanceProto.size, buildingInstance.$slot);
        this.recalculateStats();
        if (propagate) {
            redis_1.GuildUpgradeBuildingRedis(this.name);
        }
        this.save();
    }
    rebuildBuildings() {
        this.$buildingInstances = {};
        _.each(['sm', 'md', 'lg'], size => {
            _.each(this.buildings.currentlyBuilt[size], (building, index) => {
                if (!building)
                    return;
                const inst = new Buildings[building](this);
                this.$buildingInstances[building] = inst;
                inst.$slot = index;
                this.baseMap.buildBuilding(building, size, index, inst);
            });
        });
        this.recalculateStats();
    }
    resetOnlinePlayersInGuildBase() {
        const gameState = game_state_1.GameState.getInstance();
        _.each(this.onlineMembers, member => {
            const player = gameState.getPlayer(member.name);
            if (!player || player.map !== this.baseName)
                return;
            const startLoc = this.$base.startLoc;
            player.x = startLoc[0];
            player.y = startLoc[1];
        });
    }
    moveBases(newBase, propagate = true) {
        this.baseLocation = newBase;
        this.resetBuildings();
        this.buildBase();
        this.resetOnlinePlayersInGuildBase();
        if (propagate) {
            redis_1.GuildMoveBaseRedis(this.name, newBase);
        }
        this.save();
    }
    getProperty(buildingName, propName) {
        return this.buildings.properties[`${buildingName}-${propName}`];
    }
    updateProperty(buildingName, propName, propValue, propagate = true) {
        this.buildings.properties[`${buildingName}-${propName}`] = propValue;
        this.buildBuilding(buildingName);
        if (propagate) {
            redis_1.GuildUpdateBuildingPropertyRedis(this.name, buildingName, propName, propValue);
        }
        this.recalculateStats();
        this.save();
    }
    addResources({ wood, clay, stone, astralium }) {
        this.resources.wood += wood;
        this.resources.clay += clay;
        this.resources.stone += stone;
        this.resources.astralium += astralium;
        this.save();
    }
    updateAllOnlineMembers() {
        const state = game_state_1.GameState.getInstance();
        _.each(this.onlineMembers, member => {
            const player = state.getPlayer(member.name);
            if (!player)
                return;
            player._updateGuild();
        });
    }
    updateMember(player) {
        const member = _.find(this.members, { name: player.name });
        member.ascensionLevel = player.ascensionLevel;
        member.profession = player.professionName;
        member.level = player.level;
        member.title = player.title;
        this.save();
    }
    renameRetag(newGuildName) {
        const gameState = game_state_1.GameState.getInstance();
        _.each(this.onlineMembers, member => {
            const player = gameState.getPlayer(member.name);
            player.guildName = newGuildName;
        });
    }
    get onlineMembers() {
        return _.filter(this.members, member => member.lastSeen === 0);
    }
    isLeader(player) {
        const member = this.getMemberByName(player.name);
        return member.rank === LEADER;
    }
    isMod(player) {
        const member = this.getMemberByName(player.name);
        return member.rank <= MOD;
    }
    disband() {
        this.$disbanding = true;
        _.each(this.members, member => {
            this.kickMember(member);
        });
        redis_1.GuildDisbandRedis(this.name);
        this.$guildDb.removeGuild(this);
    }
    updateLastSeen(player, online) {
        const member = this.getMemberByName(player.name);
        if (online) {
            member.lastSeen = 0;
        }
        else {
            member.lastSeen = Date.now();
        }
        this.save(true);
    }
    canKick(mod, member) {
        return mod.rank < member.rank || mod.rank <= MOD && member.unacceptedInvite;
    }
    kickMemberName(name, propagate = true) {
        this.kickMember(this.getMemberByName(name), propagate);
    }
    kickMember(member, propagate = true) {
        // check if they're online, remove guildName (basically, call memberLeave)
        const onlinePlayer = game_state_1.GameState.getInstance().getPlayer(member.name);
        if (onlinePlayer && onlinePlayer.guildName !== this.name)
            return;
        if (onlinePlayer) {
            this.memberLeave(onlinePlayer);
            // check if member is even in guild (ie, could just be an invite)
            const memberInList = _.find(this.members, { name: member.name });
            this.members = _.without(this.members, memberInList);
            this.save(true);
        }
        else if (propagate) {
            redis_1.GuildKickRedis(this.name, member.name);
        }
        else if (!propagate) {
            // if not online, dig into db and unset guildName
            const memberInList = _.find(this.members, { name: member.name });
            this.members = _.without(this.members, memberInList);
            this.$guildDb.removePlayerFromGuild(member.name, this.name);
            this.save(true);
        }
    }
    getMemberByName(name) {
        return _.find(this.members, { name });
    }
    createMemberFromPlayer(player) {
        const oldMember = _.find(this.members, { name: player.name });
        if (oldMember)
            return oldMember;
        const member = new GuildMember();
        member.name = player.name;
        member.level = player.level;
        member.profession = player.professionName;
        member.ascensionLevel = player.ascensionLevel;
        member.title = player.title;
        return member;
    }
    memberJoinName(newMemberName, push = false, propagate = true) {
        this.memberJoin({ name: newMemberName }, push, propagate);
    }
    memberJoin(newMember, push = false, propagate = true) {
        const onlinePlayer = game_state_1.GameState.getInstance().getPlayer(newMember.name);
        if (onlinePlayer) {
            onlinePlayer.guildName = this.name;
            onlinePlayer.guildTaxRate = 0;
            const member = this.createMemberFromPlayer(onlinePlayer);
            member.unacceptedInvite = false;
            member.lastSeen = 0;
            // first person is leader
            if (!this.members.length) {
                member.rank = LEADER;
            }
            else {
                member.rank = MEMBER;
            }
            member.joinedAt = Date.now();
            if (push) {
                this.members.push(member);
            }
            onlinePlayer._saveSelf();
            onlinePlayer._updateGuild();
            onlinePlayer.update();
            _emitter_1.emitter.emit('player:changeguildstatus', { player: onlinePlayer });
            this.save(true);
        }
        else if (propagate) {
            redis_1.GuildJoinRedis(this.name, newMember.name);
        }
    }
    memberLeaveName(playerName, propagate = true) {
        this.memberLeave({ name: playerName }, propagate);
    }
    memberLeave(player, propagate = true) {
        const onlinePlayer = game_state_1.GameState.getInstance().getPlayer(player.name);
        const memberInList = this.getMemberByName(player.name);
        if (onlinePlayer) {
            // pass leader onto someone else
            if (this.isLeader(memberInList) && this.members.length > 1) {
                const mods = _.filter(this.members, { rank: MOD });
                let random = null;
                if (mods.length === 0) {
                    random = _.sample(_.reject(this.members, m => m.rank === LEADER));
                }
                else {
                    random = _.sample(mods);
                }
                random.rank = LEADER;
                this.leader = random.name;
            }
            onlinePlayer.guildName = '';
            onlinePlayer.guildInvite = null;
            onlinePlayer.update();
            onlinePlayer._updateGuild();
            onlinePlayer._saveSelf();
            _emitter_1.emitter.emit('player:changeguildstatus', { player: onlinePlayer });
            this.members = _.without(this.members, memberInList);
            this.save(true);
            if (this.members.length === 0) {
                this.disband();
            }
        }
        else if (propagate) {
            redis_1.GuildLeaveRedis(this.name, player.name);
        }
    }
    inviteMemberName(byName, playerName, propagate = true) {
        logger_1.Logger.silly('Guild', `${byName} inviting (by name) ${playerName} {prop=${propagate}}`);
        this.inviteMember({ name: byName }, { name: playerName }, propagate);
    }
    inviteMember(by, player, propagate = true) {
        logger_1.Logger.silly('Guild', `${by.name} inviting ${player.name} {prop=${propagate}}`);
        const onlinePlayer = game_state_1.GameState.getInstance().getPlayer(player.name);
        if (onlinePlayer) {
            logger_1.Logger.silly('Guild', `Found ${onlinePlayer.name} {prop=${propagate}}`);
            onlinePlayer.guildInvite = {
                invitedAt: Date.now(),
                inviter: by.name,
                name: this.name,
                members: this.members.length,
                leader: this.leader,
                tag: this.tag,
                founded: this.founded
            };
            const newMember = this.createMemberFromPlayer(onlinePlayer);
            newMember.unacceptedInvite = true;
            this.members.push(newMember);
            this.save(true);
            onlinePlayer._saveSelf();
            onlinePlayer._updateGuild();
        }
        else if (propagate) {
            logger_1.Logger.silly('Guild', `propagating invite for ${player.name} {prop=${propagate}}`);
            redis_1.GuildInviteRedis(this.name, by.name, player.name);
        }
    }
    promoteMember(memberName) {
        const member = this.getMemberByName(memberName);
        member.rank -= 2;
        this.save(true);
        this.updateAllOnlineMembers();
    }
    demoteMember(memberName) {
        const member = this.getMemberByName(memberName);
        member.rank += 2;
        this.save(true);
        this.updateAllOnlineMembers();
    }
    donateGold(player, gold) {
        this.gold += gold;
        player.gold -= gold;
        player._updateGuild();
        player._saveSelf();
        this.save();
        // consciously not updating all members here - small update, not really worth it.
    }
    getTaxedAmount(player, gold) {
        const percent = Math.min(100, player.guildTaxRate + this.taxRate);
        return Math.floor((percent / 100) * gold);
    }
    payTaxes(player, taxes) {
        this.gold += taxes;
        player.gold -= taxes;
        this.save();
    }
    changeMOTD(motd) {
        this.motd = motd;
        this.save(true);
    }
    setTaxRate(taxRate) {
        this.taxRate = taxRate;
        this.save();
        // consciously not updating all members here - small update, not really worth it.
    }
    save(forceUpdateOthers = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$disbanding)
                return;
            yield this.$guildDb.saveGuild(this);
            if (forceUpdateOthers) {
                this.updateAllOnlineMembers();
            }
            redis_1.GuildReloadRedis(this.name, forceUpdateOthers);
        });
    }
    buildBuildingTransmitObject() {
        return {
            otherBases: _.map(Bases, (base, baseName) => {
                return { name: baseName, moveInCost: base.moveInCost };
            }),
            hallCosts: this.baseMap.costs,
            hallSizes: this.baseMap.$slotSizes,
            buildings: this.buildings,
            buildingInfo: _.map(Buildings, (building, buildingName) => {
                return {
                    name: buildingName,
                    desc: building.desc,
                    size: building.size,
                    properties: building.properties,
                    nextLevelCost: building.levelupCost(this.buildings.levels[buildingName] || 1)
                };
            })
        };
    }
    buildTransmitObject() {
        const obj = this.buildSaveObject();
        return obj;
    }
    buildSaveObject() {
        const obj = _.omitBy(this, (val, key) => {
            return _.startsWith(key, '$')
                || _.isNotWritable(this, key);
        });
        return obj;
    }
}
exports.Guild = Guild;
