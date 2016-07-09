
import { Personality } from '../personality';

export class ScaredOfTheDark extends Personality {
  static description = 'You will never go down stairs, because its dark down there.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Movement.Descend') >= 5;
  }
}