
import _ from 'lodash';

export class Personality {
  static disableOnActivate = [];
  static description = 'This personality has no description';

  static stats = {};

  static hasEarned() {}
  static enable(player) {
    _.each(this.disableOnActivate, personality => {
      if(!player.$personalities.activePersonalities[personality]) return;
      player.$personalities.activePersonalities[personality] = false;
    });

    if(_.size(this.stats) > 0) {
      player.recalculateStats();
      player._updatePlayer();
    }
  }

  static disable(player) {
    if(_.size(this.stats) > 0) {
      player.recalculateStats();
      player._updatePlayer();
    }
  }

  static flagDirty(player, stats) {
    _.each(stats, stat => {
      player.$dirty.flags[stat] = true;
    });

    player.recalculateStats(stats);
  }
}
