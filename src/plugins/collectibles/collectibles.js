
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import { Logger } from '../../shared/logger';
import { GameState } from '../../core/game-state';

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
    const allCollectibles = GameState.getInstance().world.allCollectibles;

    // update collectibles on login
    _.each(_.values(opts.collectibles), coll => {
      if(!allCollectibles[coll.name]) return;
      coll.rarity = allCollectibles[coll.name].rarity || 'basic';
      coll.description = allCollectibles[coll.name].flavorText;
      coll.storyline = allCollectibles[coll.name].storyline;
    });

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