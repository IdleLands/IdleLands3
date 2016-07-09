
import { Personality } from '../personality';

export class Affirmer extends Personality {
  static disableOnActivate = ['Denier', 'Indecisive'];
  static description = 'All choices that would be ignored are automatically accepted.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Choice.Choose.Yes') >= 10;
  }
}