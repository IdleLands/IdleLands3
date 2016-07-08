
import _ from 'lodash';

import { Personality } from '../personality';

export class Indecisive extends Personality {
  static disableOnActivate = ['Affirmative', 'Denier'];
  static description = 'All choices that would be ignored are automatically accepted or denied.';

  static hasEarned(player) {
    return _.get(player.$statistics.stats, 'Character.Choice.Ignore') >= 10;
  }
}