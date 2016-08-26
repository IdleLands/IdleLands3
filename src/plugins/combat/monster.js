
import { Character } from '../../core/base/character';

export class Monster extends Character {

  init(opts) {
    opts.levelSet = opts.level;
    delete opts.level;

    opts.hpBoost = opts.hp;
    delete opts.hp;

    opts.mpBoost = opts.mp;
    delete opts.mp;

    this.gold = Math.round(Math.random() * 10000);

    super.init(opts);
  }

}