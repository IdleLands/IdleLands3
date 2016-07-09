
import { Personality } from '../personality';

export class Delver extends Personality {
  static description = 'You will never go up stairs, because the thrill of adventure is too great.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Movement.Ascend') >= 5;
  }
}