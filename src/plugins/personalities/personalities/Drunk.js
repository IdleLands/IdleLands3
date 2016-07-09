
import { Personality } from '../personality';

export class Drunk extends Personality {
  static description = 'You stumble around like a drunk.';

  static hasEarned(player) {
    return player.level >= 18;
  }
}