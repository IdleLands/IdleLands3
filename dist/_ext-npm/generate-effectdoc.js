"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const stat_calculator_1 = require("../shared/stat-calculator");
let docString = `
# IdleLands Equipment Effects
`;
docString += '\n\n';
docString += '## Special Stats\n\n';
docString += 'Name | Description\n';
docString += '---- | -----------\n';
_.each(stat_calculator_1.SPECIAL_STATS_BASE, ({ name, desc }) => {
    if (desc.length)
        docString += `${name} | ${desc}\n`;
});
docString += '\n\n';
docString += '## Attack Stats\n\n';
docString += 'Name | Description\n';
docString += '---- | -----------\n';
_.each(stat_calculator_1.ATTACK_STATS_BASE, ({ name, desc }) => {
    docString += `${name} | ${desc}\n`;
});
fs.writeFileSync('docs/EFFECTS.md', docString);
