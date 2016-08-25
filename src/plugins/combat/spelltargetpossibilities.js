
import _ from 'lodash';

export class SpellTargetPossibilities {
  static yes() {
    return true;
  }

  static moreThanOneEnemy(caster) {
    return _(caster.$battle.allPlayers)
      .reject(p => p.hp === 0)
      .reject(p => p.party === caster.party)
      .value().length > 1;
  }


}