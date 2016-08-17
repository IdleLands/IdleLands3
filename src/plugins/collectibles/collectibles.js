
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import { Logger } from '../../shared/logger';

@Dependencies(Container)
export class Collectibles {
  constructor(container) {
    const CollectiblesDb = require('./collectibles.db').CollectiblesDb;
    try {
      container.schedulePostConstructor((collectiblesDb) => {
        this.collectiblesDb = collectiblesDb;
      }, [CollectiblesDb]);
    } catch (e) {
      Logger.error('Collectibles', e);
    }
  }

  // clear current variables and set new
  init(opts) {
    this._id = undefined;
    this.collectibles = undefined;
    _.extend(this, opts);
  }

  totalCollectibles() {
    return _.size(this.collectibles);
  }

  addCollectible(collectible) {
    this.collectibles[collectible.name] = collectible;
    this.save();
  }

  hasCollectible(collectibleName) {
    return this.collectibles[collectibleName];
  }

  save() {
    this.collectiblesDb.saveCollectibles(this);
  }
}