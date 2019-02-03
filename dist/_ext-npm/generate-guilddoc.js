"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const Bases = require("../plugins/guilds/bases");
const Buildings = require("../plugins/guilds/buildings");
let docString = `
# IdleLands Guild Bases/Buildings

## Bases

`;
_.each(_.sortBy(_.keys(Bases)), (base, index) => {
    docString += `${index + 1}. [${base}](#${base.toLowerCase()}-base)\n`;
});
docString += '\n\n';
docString += '## Buildings\n\n';
_.each(_.sortBy(_.keys(Buildings)), (building, index) => {
    docString += `${index + 1}. [${building}](#${building.toLowerCase()})\n`;
});
docString += '\n\n';
_.each(_.sortBy(_.keys(Bases)), (baseKey, index) => {
    const base = Bases[baseKey];
    const baseInst = new base('Test');
    if (index > 0) {
        docString += `\n###### [\\[top\\]](#idlelands-guild-basesbuildings)`;
    }
    docString += `\n---\n\n`;
    docString += `## ${baseKey} Base\n\n`;
    docString += `Move In Cost: ${base.moveInCost.toLocaleString()} gold`;
    docString += '\n\n';
    docString += `attr|sm|md|lg\n`;
    docString += ':---:|:---:|:---:|:---:\n';
    docString += `Build | ${baseInst.costs.build.sm.toLocaleString()} | ${baseInst.costs.build.md.toLocaleString()} | ${baseInst.costs.build.lg.toLocaleString()}\n`;
    docString += `Plots | ${baseInst.buildings.sm.length} | ${baseInst.buildings.md.length} | ${baseInst.buildings.lg.length}`;
    docString += '\n\n';
});
_.each(_.sortBy(_.keys(Buildings)), (buildingKey, index) => {
    const building = Buildings[buildingKey];
    if (index > 0) {
        docString += `\n###### [\\[top\\]](#idlelands-guild-basesbuildings)`;
    }
    docString += `\n---\n\n`;
    docString += `## ${buildingKey}\n\n`;
    docString += `${building.desc}\n\n`;
    docString += `Size: ${building.size}\n\n`;
    docString += `Cost Per Level (compounding)\n\n`;
    docString += `Wood|Clay|Stone|Astralium|Gold\n`;
    docString += ':---:|:---:|:---:|:---:|:---:\n';
    docString += `${building.woodCost(1)}|${building.clayCost(1)}|${building.stoneCost(1)}|${building.astraliumCost(1)}|${building.goldCost(1)}`;
    docString += '\n\n';
});
fs.writeFileSync('docs/GUILDS.md', docString);
