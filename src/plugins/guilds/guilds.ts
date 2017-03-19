
import * as _ from 'lodash';

import { Dependencies } from 'constitute';

import { GuildsDb } from './guilds.db';
import { Guild } from './guild';

import { SETTINGS } from '../../static/settings';

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
      });
  }

  createGuild({ leader, name, tag }) {
    if(leader.gold < SETTINGS.guild.cost) return `You need ${SETTINGS.guild.cost.toLocaleString()} gold to start a guild!`;

    name = (''+name).trim();
    tag = (''+tag).trim();

    if(_.find(this.guilds, { name }) || _.find(this.guilds, { tag })) {
      return 'You need to have a unique name and tag!';
    }

    if(name.length <= 3 || name.length > 20) return 'Guild name must be between 3 and 20 characters.';
    if(tag.length <= 1 || tag.length > 6) return 'Guild tag mus be between 1 and 6 characters';

    leader.gold -= SETTINGS.guild.cost;
    leader.guildName = name;

    const guild = new Guild(this.guildsDb);
    guild.init({ leader: leader.name, name, tag });
    guild.save();
  }

}