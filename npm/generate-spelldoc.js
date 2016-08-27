
import _ from 'lodash';

import fs from 'fs';

import * as Professions from '../src/core/professions/_all';
import * as Spells from '../src/plugins/combat/spells/_all';

let docString = `
# IdleLands Class Spells

## Table of Contents

`;

_.each(_.sortBy(_.keys(Professions)), (profession, index) => {
  docString += `${index + 1}. ${profession}\n`;
});

docString += '\n\n';

_.each(_.sortBy(_.keys(Professions)), (profession) => {

  docString += `## ${profession}\n\n`;
  docString += 'Name | Level | Required Collectibles\n';
  docString += '---- | ----- | ---------------------\n';

  const professionSpellsSorted = _(Spells)
    .values()
    /* .tap(spell => {
      console.log(spell, spell.name, spell.constructor.name);
      _.each(spell.tiers, tier => tier._spellName = spell.constructor.name);
    }) */
    .map('tiers')
    .flattenDeep()
    .reject(tier => tier.profession !== profession)
    .sortBy(['level', 'name'])
    .value();

  _.each(professionSpellsSorted, tier => {
    docString += `${tier.name} | ${tier.level} | ${tier.collectibles ? tier.collectibles.join(', ') : ''}\n`;
  });

  docString += '\n\n';

});

fs.writeFileSync('docs/SPELLS.md', docString);