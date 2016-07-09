
import { Personality } from '../personality';

export class Denier extends Personality {
  static disableOnActivate = ['Affirmer', 'Indecisive'];
  static description = 'All choices that would be ignored are automatically denied.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Choice.Choose.No') >= 10;
  }
}