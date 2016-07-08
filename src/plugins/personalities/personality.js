
import _ from 'lodash';

export class Personality {
  static disableOnActivate = [];
  static description = 'This personality has no description';

  static hasEarned() {}
  static enable(player) {
    _.each(this.disableOnActivate, personality => {
      if(!player.$personalities.activePersonalities[personality]) return;
      player.$personalities.activePersonalities[personality] = false;
    });
  }
}
