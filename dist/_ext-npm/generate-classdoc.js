"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const Professions = require("../core/professions/_all");
let docString = `
# IdleLands Classes

## Table of Contents

`;
_.each(_.sortBy(_.keys(Professions)), (profession, index) => {
    docString += `${index + 1}. [${profession}](#${profession.toLowerCase()})\n`;
});
docString += '\n\n';
_.each(_.sortBy(_.keys(Professions)), (professionKey, index) => {
    const profession = Professions[professionKey];
    if (index > 0) {
        docString += `\n###### [\\[top\\]](#idlelands-classes)`;
    }
    docString += `\n---\n\n`;
    docString += `## ${professionKey}\n\n`;
    docString += '### Stats Per Level\n\n';
    docString += 'These are the stat gains per level.\n\n';
    docString += 'HP | MP | STR | DEX | CON | AGI | INT | LUK\n';
    docString += '--- | --- | --- | --- | --- | --- | --- | ---\n';
    docString += `${profession.baseHpPerLevel} | ${profession.baseMpPerLevel} | ${profession.baseStrPerLevel} | ${profession.baseDexPerLevel} | ${profession.baseConPerLevel} | ${profession.baseAgiPerLevel} | ${profession.baseIntPerLevel} | ${profession.baseLukPerLevel}\n`;
    docString += '\n\n';
    docString += '### HP Modifiers\n';
    docString += 'You get X HP for every point in a particular stat.\n\n';
    docString += 'STR | DEX | CON | AGI | INT | LUK\n';
    docString += '--- | --- | --- | --- | --- | ---\n';
    docString += `${profession.baseHpPerStr} | ${profession.baseHpPerDex} | ${profession.baseHpPerCon} | ${profession.baseHpPerAgi} | ${profession.baseHpPerInt} | ${profession.baseHpPerLuk}`;
    docString += '\n\n';
    docString += '### MP Modifiers\n';
    docString += 'You get X MP for every point in a particular stat.\n\n';
    docString += 'STR | DEX | CON | AGI | INT | LUK\n';
    docString += '--- | --- | --- | --- | --- | ---\n';
    docString += `${profession.baseMpPerStr} | ${profession.baseMpPerDex} | ${profession.baseMpPerCon} | ${profession.baseMpPerAgi} | ${profession.baseMpPerInt} | ${profession.baseMpPerLuk}`;
    docString += '\n\n';
});
fs.writeFileSync('docs/CLASSES.md', docString);
