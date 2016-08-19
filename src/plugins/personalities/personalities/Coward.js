
import { Personality } from '../personality';

export class Coward extends Personality {
  static description = 'Your cowardice allows you to avoid combat more often.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Combat.Lose') >= 25;
  }
}