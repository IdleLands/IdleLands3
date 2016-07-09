
import { Personality } from '../personality';

export class Indecisive extends Personality {
  static disableOnActivate = ['Affirmer', 'Denier'];
  static description = 'All choices that would be ignored are automatically accepted or denied.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Choice.Ignore') >= 10;
  }
}