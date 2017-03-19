
import * as _ from 'lodash';

import { GameState } from '../../core/game-state';

const LEADER = 1;
const MOD = 3;
const MEMBER = 5;

type Rank = 1 | 3 | 5;

export class GuildMember {
  name: string;
  level: number;
  profession: string;
  rank: Rank;
  unacceptedInvite: boolean;
}

export class Guild {
  name: string;
  tag: string;
  leader: string;
  founded: number;
  level: number;
  gold: number;

  maxMembers: number;
  members: GuildMember[];

  taxRate: number;

  $guildDb: any;

  constructor(guildDb) {
    this.$guildDb = guildDb;
  }

  init(opts: any) {
    _.extend(this, opts);
    if(!this.founded) this.founded = Date.now();
    if(!this.level) this.level = 1;
    if(!this.gold) this.gold = 0;
    if(!this.members) this.members = [];
    if(!this.taxRate) this.taxRate = 0;
    if(!this.maxMembers) this.maxMembers = 10;
  }

  disband() {
    _.each(this.members, member => {
      this.kickMember(member);
    });
    // go through every member, remove them if online, if in db reset guildName
    // remove self from db
  }

  kickMember(member: GuildMember) {
    // check if member is even in guild (ie, could just be an invite)
    const memberInList = _.find(this.members, { name: member.name });
    if(member.unacceptedInvite) {
      this.members = _.without(this.members, memberInList);
      this.save();
      return;
    }

    // check if they're online, remove guildName (basically, call memberLeave)
    const gameState = GameState.getInstance();
    const onlinePlayer = gameState.getPlayer(member.name);

    if(onlinePlayer) {
      this.memberLeave(onlinePlayer);
      return;
    }

    // if not online, dig into db and unset guildName
    this.$guildDb.removePlayerFromGuild(member.name);
    this.save();

  }

  private getMemberByName(name) {
    return _.find(this.members, { name });
  }

  private createMemberFromPlayer(player) {
    const member = new GuildMember();

    member.name = player.name;
    member.level = player.level;
    member.profession = player.professionName;

    return member;
  }

  memberJoin(newMember) {

    newMember.guildName = this.name;
    const member = this.createMemberFromPlayer(newMember);

    // first person is leader
    if(!this.members.length) {
      member.rank = LEADER;
    } else {
      member.rank = MEMBER;
    }

    this.members.push(member);
    this.save();
  }

  memberLeave(player) {
    const memberInList = this.getMemberByName(player.name);

    player.guildName = '';
    player._updateGuild();
    this.members = _.without(this.members, memberInList);
    this.save();
  }

  inviteMemberByName(playerName) {
    const player = GameState.getInstance().getPlayer(playerName);
    this.inviteMember(player);
  }

  inviteMember(player) {
    const newMember = this.createMemberFromPlayer(player);
    newMember.unacceptedInvite = true;
    this.members.push(newMember);
  }

  promoteMember(memberName) {
    // TODO: check if rank > before promoting
    const member = this.getMemberByName(memberName);
    member.rank += 2;
    this.save();
  }

  demoteMember(memberName) {
    // TODO: check if rank > before demoting
    const member = this.getMemberByName(memberName);
    member.rank -= 2;
    this.save();
  }

  donateGold(player, gold) {
    // TODO check if member has gold
    this.gold += gold;
    player.gold -= gold;

    player._updateGuild();
    player._save();
    this.save();
  }

  save() {
    this.$guildDb.saveGuild(this);
  }

  buildSaveObject() {
    const obj = _.omitBy(this, (val, key) => {
      return _.startsWith(key, '$')
        || _.isNotWritable(this, key)
    });

    return obj;
  }
}