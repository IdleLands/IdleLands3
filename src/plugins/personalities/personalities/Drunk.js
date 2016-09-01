
import { Personality } from '../personality';

export class Drunk extends Personality {
  static description = 'You stumble around randomly like a drunk.';

  static hasEarned(player) {
    return player.level >= 18;
  }
}