
import { Personality } from '../personality';

export class Camping extends Personality {
  static description = 'You will not move or have any events affect you.';

  static hasEarned(player) {
    const hoursPlayed = Math.abs(player.joinDate - Date.now()) / 36e5;
    return hoursPlayed > 24 * 7;
  }
}