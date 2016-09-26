import _ from 'lodash';

import fs from 'fs';

import PETDATA from '../assets/maps/content/pets.json';

let docString = `# IdleLands Pets\n\n`;
	docString += `## Table of Contents\n\n`;

const sortedPets = _.sortBy(_.keys(PETDATA));

_.each(sortedPets, (pet, index) => {
	docString += `${index + 1}. ${pet}\n`
});

docString += '\n';

_.each(sortedPets, (petKey) => {
	
	const pet = PETDATA[petKey];

	docString += `## ${petKey}\n\n`;
	
	docString += `### Cost\n`;
	docString += `${pet.cost} gold\n\n`;
	
	docString += `### Category\n`;
	docString += `${pet.category}\n\n`;
	
	docString += `### Description\n`;
	docString += `${pet.description}\n\n`;
	
	docString += `### Gear Slots\n`;
	_.each(_.keys(pet.slots), (slot) => {
		docString += `* ${slot}: ${pet.slots[slot]}\n`;
	});
	
	docString += `\n`;
	
	docString += `### Special Stats\n`;
	_.each(_.keys(pet.specialStats), (stat) => {
		docString += `* ${stat}: ${pet.specialStats[stat]}\n`;
	});
	
	docString += `\n`;
	
	docString += `### Unlock Requirements\n`;
	_.each(_.keys(pet.requirements), (reqType) => {
		
		const reqs = pet.requirements[reqType];
		
		docString += `#### ${_.upperFirst(reqType)}\n`;
		
		_.each(_.sortBy(_.keys(reqs)), (req) => {
			if (reqType == "achievements") {
				docString += `* ${reqs[req].name} ${reqs[req].tier}\n`;
			}
			
			if (reqType == "bosses" || reqType == "collectibles") {
				docString += `* ${reqs[req]}\n`;
			}
			
			if (reqType == "statistics") {
				docString += `* ${req}: ${reqs[req]}\n`;
			}
		});
		
		docString += `\n`;
	});
		
	docString += `### Upgrades\n`;
	_.each(_.keys(pet.scale), (upgradeKey) => {
		
		const upgrade = pet.scale[upgradeKey];
		const cost = pet.scaleCost[upgradeKey];
		
		docString += `| ${upgradeKey} | `;
		
		_.each(_.values(upgrade), (value) => {
			docString += ` ${value} |`;
		});
		
		docString += `\n`;
		docString += `|----|`;
		
		for(var i = 0; i < _.size(upgrade); i++) {
			docString += `----|`;
		};
		
		docString += `\n\n`;
	});
});

fs.writeFileSync('docs/PETS.md', docString);