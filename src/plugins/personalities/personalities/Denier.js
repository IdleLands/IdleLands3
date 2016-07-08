
import _ from 'lodash';

import { Personality } from '../personality';

export class Denier extends Personality {
  static disableOnActivate = ['Affirmative', 'Indecisive'];
  static description = 'All choices that would be ignored are automatically denied.';

  static hasEarned(player) {
    return _.get(player.$statistics.stats, 'Character.Choice.Choose.No') >= 10;
  }
}