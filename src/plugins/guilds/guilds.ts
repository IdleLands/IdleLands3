
import * as _ from 'lodash';

import { Dependencies } from 'constitute';

import { GuildsDb } from './guilds.db';
import { Guild } from './guild';

import { GameState } from '../../core/game-state';

import { SETTINGS } from '../../static/settings';

import { GetRedisPlayers } from '../scaler/redis';

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

    if(!leader.$premium.canConsume('renameTagGuild')) return 'You do not have a guild rename tag!';
    leader.$premium.consume(leader, 'renameTagGuild');

    name = (''+name).trim();
    tag = (''+tag).trim();

    if(_.find(this.guilds, { name }) || _.find(this.guilds, { tag })) {
      return 'You need to have a unique name and tag!';
    }

    if(name.length <= 3 || name.length > 20) return 'Guild name must be between 4 and 20 characters.';
    if(tag.length <= 1 || tag.length > 6) return 'Guild tag must be between 2 and 6 characters';

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
    if(taxRate > 85) taxRate = 85;

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
    player.$statistics.increment('Character.Gold.Donate', gold);
  }

  inviteMember(player, newMemberName) {
    const guild: Guild = player.guild;
    if(!guild.isMod(player)) return 'You do not have enough privileges to do this!';
    if(guild.members.length >= guild.maxMembers) return 'You do not have enough space to add more members!';

    let memberExists = false;
    const newMember = GameState.getInstance().getPlayer(newMemberName);
    if(newMember) memberExists = true;
    if(_.find(GetRedisPlayers(), { name: newMemberName })) memberExists = true;

    if(!memberExists) return 'That player is not online!';

    if(newMember.guildInvite && newMember.guildInvite.name !== guild.name) return 'That player already has an outstanding guild invite!';

    if(_.find(guild.members, { name: newMemberName })) return 'That player is already in your roster!';

    guild.inviteMember(player, newMember);
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
    player._updateGuild();
  }

  promoteMember(player, memberName: string) {
    const guild: Guild = player.guild;
    if(!guild.isLeader(player)) return 'You do not have enough privileges to do this!';

    const member = guild.getMemberByName(memberName);
    if(guild.isMod(member)) return 'Member already a mod!';

    guild.promoteMember(memberName);
  }

  demoteMember(player, memberName: string) {
    const guild: Guild = player.guild;
    if(!guild.isLeader(player)) return 'You do not have enough privileges to do this!';

    const member = guild.getMemberByName(memberName);
    if(!guild.isMod(member)) return 'Member already lowest privileges!';

    guild.demoteMember(memberName);
  }

}