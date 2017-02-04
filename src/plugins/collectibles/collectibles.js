
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
    this.priorCollectibles = undefined;
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

  reset() {
    if(!this.priorCollectibles) this.priorCollectibles = {};

    _.each(_.values(this.collectibles), coll => {
      this.priorCollectibles[coll.name] = this.priorCollectibles[coll.name] || 0;
      this.priorCollectibles[coll.name]++;
    });

    this.collectibles = {};
  }

  get priorCollectibleData() {
    if(!this.priorCollectibles) return {};

    const allCollectibles = GameState.getInstance().world.allCollectibles;
    const emit = {};
    _.each(this.priorCollectibles, (count, coll) => {
      emit[coll] = _.cloneDeep(allCollectibles[coll]);
      emit[coll].name = coll;
      emit[coll].count = count;
    });

    return emit;
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