
import { Personality } from '../personality';

export class Solo extends Personality {
  static description = 'You will never join parties.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Party.Join') >= 5;
  }
}