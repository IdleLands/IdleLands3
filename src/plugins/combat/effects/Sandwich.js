
import _ from 'lodash';

import { Effect } from '../effect';

export class Sandwich extends Effect {
  affect() {
    _.extend(this, _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']));
  }
}