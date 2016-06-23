
import _ from 'lodash';

import { Logger } from '../../shared/logger';
import { savePlayer } from './player.db';

export class Player {
  constructor(opts) {
    _.extend(this, opts);

    if(!this.name) Logger.error('Player', new Error('No name specified.'), opts);
  }

  takeTurn() {
    this.save();
  }

  save() {
    savePlayer(this);
  }
}