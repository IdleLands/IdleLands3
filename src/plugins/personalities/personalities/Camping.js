
import { Personality } from '../personality';

export class Camping extends Personality {
  static description = 'You will not move or have any events affect you.';

  static hasEarned(player) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 7);
    return player.joinDate > checkDate.getTime();
  }
}