
import _ from 'lodash';

import { ALL_STATS } from '../../shared/stat-calculator';

export class DirtyChecker {
  constructor() {
    this._flags = {};
    _.each(ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier']), stat => this._flags[stat] = true);

    this.flags = new Proxy({}, {
      get: (target, name) => {
        return this._flags[name];
      },
      set: (target, name) => {
        this._flags[name] = name;
        return true;
      }
    });
  }

  reset() {
    _.each(_.keys(this._flags), flag => this._flags[flag] = false);
  }
}