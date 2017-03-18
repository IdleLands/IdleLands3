
import * as _ from 'lodash';

import { Dependencies } from 'constitute';

import { GuildsDb } from './guilds.db';
import { Guild } from './guild';

import { SETTINGS } from '../../static/settings';

@Dependencies(GuildsDb)
export class Guilds {
  guildsDb: any;
  guilds: Guild[];

  constructor(guildsDb) {
    this.guildsDb = guildsDb;
    this.guilds = [];

    this.init();
  }

  init() {
    this.guildsDb.getGuilds()
      .then(guilds => {
        this.guilds = guilds ? _.map(guilds, g => new Guild(g)) : [];
      });
  }

  createGuild({ leader, name, tag }) {
    // gold cost: 100 000 000
    if(leader.gold < SETTINGS.guild.cost) return `You need ${SETTINGS.guild.cost.toLocaleString()} gold to start a guild!`;

    if(_.find(this.guilds, { name }) || _.find(this.guilds, { tag })) {
      return 'You need to have a unique name and tag!';
    }

    leader.gold -= SETTINGS.guild.cost;

    const guild = new Guild({ leader: leader.name, name, tag });

  }

}