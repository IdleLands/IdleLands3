
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

  constructor(opts: any) {
    _.extend(this, opts);
    if(!this.founded) this.founded = Date.now();
    if(!this.level) this.level = 1;
    if(!this.gold) this.gold = 0;
    if(!this.members) this.members = [];
    if(!this.taxRate) this.taxRate = 0;
  }

  disband() {

  }

  kickMember() {

  }

  memberLeave() {

  }

  inviteMember() {

  }

  donateGold() {

  }

  save() {

  }

  buildSaveObject() {
    return this;
  }
}