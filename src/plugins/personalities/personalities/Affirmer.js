
import _ from 'lodash';

import { Personality } from '../personality';

export class Affirmer extends Personality {
  static disableOnActivate = ['Denier', 'Indecisive'];
  static description = 'All choices that would be ignored are automatically accepted.';

  static hasEarned(player) {
    return _.get(player.$statistics.stats, 'Character.Choice.Choose.Yes') >= 10;
  }
}