"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
const PETDATA = require("../../assets/maps/content/pets.json");
let indexString = `# IdleLands Pets\n\n`;
indexString += `## Table of Contents\n\n`;
let petString = ``;
const sortedPets = _.sortBy(_.keys(PETDATA));
_.each(sortedPets, (petKey, index) => {
    const pet = PETDATA[petKey];
    indexString += `${index + 1}. [${petKey}](#${_.kebabCase(petKey)})\n`;
    if (index > 0) {
        petString += `\n###### [\\[top\\]](#idlelands-pets)`;
    }
    petString += `\n---\n\n`;
    petString += `## ${petKey}\n\n`;
    petString += `### Cost\n`;
    petString += `${pet.cost.toLocaleString()} gold\n\n`;
    petString += `### Category\n`;
    petString += `${pet.category}\n\n`;
    petString += `### Description\n`;
    petString += `${pet.description}\n\n`;
    petString += `### Gear Slots\n`;
    _.each(_.keys(pet.slots), (slot) => {
        petString += `* ${slot}: ${pet.slots[slot]}\n`;
    });
    petString += `\n`;
    petString += `### Special Stats\n`;
    _.each(_.keys(pet.specialStats), (stat) => {
        petString += `* ${stat}: ${pet.specialStats[stat].toLocaleString()}\n`;
    });
    petString += `\n`;
    petString += `### Unlock Requirements\n`;
    _.each(_.keys(pet.requirements), (reqType) => {
        const reqs = pet.requirements[reqType];
        petString += `#### ${_.upperFirst(reqType)}\n`;
        _.each(_.sortBy(_.keys(reqs)), (req) => {
            if (reqType == "achievements") {
                petString += `* ${reqs[req].name} (tier ${reqs[req].tier})\n`;
            }
            if (reqType == "bosses" || reqType == "collectibles") {
                petString += `* ${reqs[req]}\n`;
            }
            if (reqType == "statistics") {
                petString += `* ${req}: ${reqs[req].toLocaleString()}\n`;
            }
        });
        petString += `\n`;
    });
    const maxLength = _.max(_.map(_.values(pet.scale), (array) => {
        return _.size(array);
    }));
    petString += `### Upgrades\n`;
    //petString += `All Tier 1 upgrades come free with your pet.\n`;
    //petString += `Any further upgrades must be purchased.\n\n`;
    petString += `Upgrade/Cost`;
    var tableString = `---:`;
    for (var i = 0; i < maxLength; i++) {
        petString += `|Tier ${i + 1}`;
        tableString += `|:---:`;
    }
    petString += `\n`;
    tableString += `\n`;
    petString += tableString;
    _.each(_.keys(pet.scale), (upgradeKey) => {
        const upgrade = pet.scale[upgradeKey];
        const cost = pet.scaleCost[upgradeKey];
        var upgradeString = `${upgradeKey}`;
        var costString = `Cost`;
        for (var i = 0; i < maxLength; i++) {
            if (i < _.size(upgrade)) {
                upgradeString += `|${upgrade[i].toLocaleString()}`;
                costString += `|${cost[i].toLocaleString()}`;
            }
            else {
                upgradeString += `|---`;
                costString += `|---`;
            }
        }
        upgradeString += `\n`;
        costString += `\n`;
        petString += upgradeString;
        petString += costString;
    });
});
var docString = ``;
docString += indexString;
docString += petString;
fs.writeFileSync('docs/PETS.md', docString);
