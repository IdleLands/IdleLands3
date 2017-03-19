
import * as _ from 'lodash';

export class GuildMember {
  name: string;
  level: number;
  profession: string;
  rank: number;
}

export class Guild {
  name: string;
  tag: string;
  leader: string;
  founded: number;
  level: number;
  gold: number;

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
  }

  disband() {
    // go through every member, remove them if online, if in db reset guildName
    // remove self from db
  }

  kickMember(member) {
    // check if they're online, remove guildName (basically, call memberLeave)
    // if not online, dig into db and unset guildName
  }

  memberLeave(member) {
    // unset guildName, updateGuild
    // remove from this.members
  }

  inviteMember() {

  }

  donateGold() {

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