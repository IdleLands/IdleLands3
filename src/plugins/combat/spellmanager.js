
import * as _ from 'lodash';
import * as Spells from './spells/_all';

export class SpellManager {
  static validSpells(player) {
    return _(Spells)
      .values()
      .filter(spellData => {
        return _.filter(spellData.tiers, tier => {
          return (tier.profession === player.professionName
                    || (player.$secondaryProfessions && _.includes(player.$secondaryProfessions, tier.profession)))
                 && tier.level <= player.level;
        }).length > 0;
      })
      .value();
  }
}