
import * as _ from 'lodash';

import { Dependencies } from 'constitute';

import { GuildsDb } from './guilds.db';
import { Guild } from './guild';

import { GameState } from '../../core/game-state';

import { SETTINGS } from '../../static/settings';

import { GetRedisPlayers } from '../scaler/redis';

import * as Bases from './bases';
import * as Buildings from './buildings';

@Dependencies(GuildsDb)
export class Guilds {
  guildsDb: any;
  guilds: any;

  constructor(guildsDb) {
    this.guildsDb = guildsDb;
    this.guilds = {};

    this.init();
  }

  init() {
    this.guildsDb.getGuilds()
      .then(guilds => {
        this.guilds = guilds || {};
        _.each(guilds, guild => guild.$guildDb = this.guildsDb);
      });
  }

  async _loadGuild(guildName, notify) {
    const guild = await this.guildsDb.getGuild(guildName);
    this.guilds[guildName] = guild;
    guild.$guildDb = this.guildsDb;

    if(notify) {
      guild.updateAllOnlineMembers();
    }
  }

  getGuild(guildName): Guild {
    return this.guilds[guildName];
  }

  createGuild({ leader, name, tag }) {
    const guildCheck: Guild = leader.guild;
    if(guildCheck && !guildCheck.$noGuild) return 'You already have a guild!';
    if(leader.gold < SETTINGS.guild.cost) return `You need ${SETTINGS.guild.cost.toLocaleString()} gold to start a guild!`;

    name = (''+name).trim();
    tag = (''+tag).trim();

    if(_.find(this.guilds, { name }) || _.find(this.guilds, { tag })) {
      return 'You need to have a unique name and tag!';
    }

    if(name.length <= 3 || name.length > 20) return 'Guild name must be between 4 and 20 characters.';
    if(tag.length <= 1 || tag.length > 6) return 'Guild tag must be between 2 and 6 characters';

    leader.gold -= SETTINGS.guild.cost;

    const guild = new Guild(this.guildsDb);
    guild.init({ leader: leader.name, name, tag });
    guild.memberJoin(leader, true);
    guild.save();

    this.guilds[guild.name] = guild;

    leader._updateGuild();
    leader._saveSelf();
  }

  _renameRetag(oldName, newName, newTag) {

    const guildCheck: Guild = this.getGuild(oldName);

    guildCheck.name = newName;
    guildCheck.tag = newTag;

    delete this.guilds[oldName];
    this.guilds[newName] = guildCheck;

    guildCheck.renameRetag(newName);

    this.guildsDb.updateAllGuildMembersToNewGuild(oldName, newName);
    this.guildsDb.renameGuild(oldName, newName, newTag);

    guildCheck.updateAllOnlineMembers();
  }

  renameRetag(leader, name, tag) {
    const guildCheck: Guild = leader.guild;
    if(guildCheck && guildCheck.$noGuild) return 'You do not have a guild!';

    name = (''+name).trim();
    tag = (''+tag).trim();

    if(_.find(this.guilds, { name }) || _.find(this.guilds, { tag })) {
      return 'You need to have a unique name and tag!';
    }

    if(name.length <= 3 || name.length > 20) return 'Guild name must be between 4 and 20 characters.';
    if(tag.length <= 1 || tag.length > 6) return 'Guild tag must be between 2 and 6 characters';

    if(!leader.$premium.canConsume('renameTagGuild')) return 'You do not have a guild rename tag!';
    leader.$premium.consume(leader, 'renameTagGuild');

    this._renameRetag(guildCheck.name, name, tag);

  }

  disbandGuild(player) {
    const guild: Guild = player.guild;
    if(!guild.isLeader(player)) return 'You do not have enough privileges to do this!';

    delete this.guilds[guild.name];
    guild.disband();
  }

  leaveGuild(player) {
    const guild: Guild = player.guild;
    if(!guild) return 'You are not in a guild!';

    guild.memberLeave(player);
  }

  changeMOTD(player, motd: string) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    motd = motd.trim();
    if(!motd) return 'Please be nice, give them a message to look at.';
    if(motd.length > 500) motd = _.truncate(motd, { length: 500 });

    guild.changeMOTD(motd);
  }

  updateGuildTaxRate(player, taxRate: number) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    taxRate = Math.floor(+taxRate);
    if(taxRate < 0) taxRate = 0;
    if(taxRate > 15) taxRate = 15;

    guild.setTaxRate(taxRate);
  }

  updatePersonalTaxRate(player, taxRate: number) {
    taxRate = Math.floor(+taxRate);
    if(taxRate < 0) taxRate = 0;
    if(taxRate > 100) taxRate = 100;

    player.guildTaxRate = taxRate;
    player._saveSelf();
    player.update();
  }

  donateGold(player, gold: number) {
    gold = Math.floor(+gold);
    if(gold < 0) return 'You cannot donate no gold, you jerk.';
    if(gold > player.gold) return 'If only you could give away money you lacked.';

    const guild: Guild = player.guild;
    guild.donateGold(player, gold);
    player.$statistics.incrementStat('Character.Gold.Donate', gold);

    return `Successfully donated ${gold} gold.`;
  }

  inviteMember(player, newMemberName) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';
    if(guild.members.length >= guild.maxMembers) return 'You do not have enough space to add more members!';

    let memberExists = false;
    const newMember = GameState.getInstance().getPlayer(newMemberName);
    const newMemberRedis = _.find(GetRedisPlayers(), { name: newMemberName });
    if(newMember) memberExists = true;
    if(newMemberRedis) memberExists = true;
    if(!memberExists) return 'That player is not online!';

    if((newMemberRedis && newMemberRedis.hasGuildInvite) || (newMember && newMember.guildInvite && newMember.guildInvite.name !== guild.name)) return 'That player already has an outstanding guild invite!';

    if(_.find(guild.members, { name: newMemberName })) return 'That player is already in your roster!';

    if((newMember && newMember.hasGuild) || (newMemberRedis && newMemberRedis.guildName)) return 'That person already has a guild!';

    guild.inviteMember(player, newMember || newMemberRedis);

    return `Successfully invited ${newMemberName}.`;
  }

  private finalizeInviteRemoval(player) {
    player.guildInvite = null;
    player._saveSelf();
    player._updateGuild();
    player.update();
  }

  inviteAccept(player) {
    const guildName = player.guildInvite.name;
    const guild: Guild = this.guilds[guildName];

    if(!guild) {
      this.finalizeInviteRemoval(player);
      return 'That guild does not exist';
    }

    if(!_.find(guild.members, { name: player.name })) {
      this.finalizeInviteRemoval(player);
      return 'You are no longer in that guild roster.';
    }

    guild.memberJoin(player);
    this.finalizeInviteRemoval(player);
  }

  inviteReject(player) {
    const guildName = player.guildInvite.name;
    const guild: Guild = this.guilds[guildName];

    if(!guild) {
      this.finalizeInviteRemoval(player);
      return 'That guild does not exist';
    }

    if(!_.find(guild.members, { name: player.name })) {
      this.finalizeInviteRemoval(player);
      return 'You are no longer in that guild roster.';
    }

    guild.memberLeave(player);
    this.finalizeInviteRemoval(player);
  }

  kickMember(player, memberName) {
    const guild: Guild = player.guild;
    const mod = guild.getMemberByName(player.name);
    const member = guild.getMemberByName(memberName);

    if(!member) return 'That person is not in the roster.';
    if(!guild.canKick(mod, member)) return 'You do not have enough privileges to do this!';

    guild.kickMember(member);

    return `Sucessfully kicked ${memberName}`;
  }

  promoteMember(player, memberName: string) {
    const guild: Guild = player.guild;
    if(!guild.isLeader(player)) return 'You do not have enough privileges to do this!';

    const member = guild.getMemberByName(memberName);
    if(guild.isMod(member)) return 'Member already a mod!';

    guild.promoteMember(memberName);

    return `Successfully promoted ${memberName}.`;
  }

  demoteMember(player, memberName: string) {
    const guild: Guild = player.guild;
    if(!guild.isLeader(player)) return 'You do not have enough privileges to do this!';

    const member = guild.getMemberByName(memberName);
    if(!guild.isMod(member)) return 'Member already lowest privileges!';

    guild.demoteMember(memberName);

    return `Successfully demoted ${memberName}.`;
  }

  buildBuilding(player, buildingName, slot) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    const buildingProto = Buildings[buildingName];
    if(!buildingProto) return 'That building does not exist!';

    if(buildingName !== 'GuildHall') {
      if(!guild.$buildingInstances.GuildHall) return 'You do not have the guild hall built!';
    }

    const buildCost = guild.$base.costs.build;
    const cost = buildCost[buildingProto.size];
    if(guild.gold < cost) return 'You do not have enough gold to construct a building!';

    slot = Math.floor(+slot);
    if(_.isNaN(slot) || slot < 0 || slot > guild.$base.$slotSizes[buildingProto.size]) return 'Invalid slot.';

    guild.gold -= cost;
    guild.buildBuilding(buildingName, slot);

    player._updateGuild();
    player._updateGuildBuildings();

    return `Successfully built ${buildingName}.`;
  }

  upgradeBuilding(player, buildingName) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    const buildingProto = Buildings[buildingName];
    if(!buildingProto) return 'That building does not exist!';

    if(!guild.$buildingInstances[buildingName]) return 'You have not built that yet!';

    if(buildingName !== 'GuildHall') {
      if(!guild.$buildingInstances.GuildHall) return 'You do not have the guild hall built!';
      if(guild.buildings.levels.GuildHall < guild.buildings.levels[buildingName] + 1) return 'Your guild hall must be upgraded first!';
    }

    const { wood, clay, stone, astralium, gold } = buildingProto.levelupCost(guild.buildings.levels[buildingName] || 1);
    if(guild.gold < gold) return 'Your guild does not have enough gold!';
    if(guild.resources.wood < wood) return 'Your guild does not have enough wood!';
    if(guild.resources.clay < clay) return 'Your guild does not have enough clay!';
    if(guild.resources.stone < stone) return 'Your guild does not have enough stone!';
    if(guild.resources.astralium < astralium) return 'Your guild does not have enough astralium!';

    guild.gold -= gold;
    guild.resources.wood -= wood;
    guild.resources.clay -= clay;
    guild.resources.stone -= stone;
    guild.resources.astralium -= astralium;

    guild.upgradeBuilding(buildingName);

    player._updateGuild();
    player._updateGuildBuildings();

    return `Successfully upgraded ${buildingName}.`;
  }

  moveBase(player, newBase) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    if(guild.baseLocation === newBase) return 'You are already there!';

    const base = Bases[newBase];
    if(!base) return 'That base does not exist!';

    const cost = base.moveInCost;
    if(guild.gold < cost) return 'You do not have enough gold to move!';

    guild.gold -= cost;

    guild.moveBases(newBase);

    player._updateGuild();
    player._updateGuildBuildings();

    return `Successfully moved base to ${newBase}.`;
  }

  updateProp(player, buildingName, propName, propValue) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';

    const building = Buildings[buildingName];
    if(!building) return 'That building does not exist!';

    if(!guild.$buildingInstances[buildingName]) return 'Building not constructed!';

    const prop = _.find(building.properties, { name: propName });
    if(!prop) return 'That property does not exist!';

    propValue = (''+propValue).trim();
    if(!propValue) return 'Invalid property value!';

    guild.updateProperty(buildingName, propName, propValue);

    player._updateGuildBuildings();

    return `Successfully updated ${buildingName} "${propName}" to ${propValue}.`;
  }

}
