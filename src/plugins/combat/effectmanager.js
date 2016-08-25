
import _ from 'lodash';

export class EffectManager {

  constructor() {
    this.effects = [];
  }

  hasEffect(effectName) {
    return _.some(this.effects, effect => effect.constructor.name === effectName);
  }

  add(effect) {
    this.effects.push(effect);
  }

  remove(effect) {
    this.effects = _.without(this.effects, effect);
  }

  tick() {
    _.each(this.effects, effect => {
      effect.tick();

      if(effect.duration <= 0) {
        effect.unaffect();
        this.remove(effect);
      }
    });
  }
}