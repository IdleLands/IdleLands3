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
				docString += `* ${reqs[req].name} (tier ${reqs[req].tier})\n`;
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
	
	const maxLength = _.max(_.map(_.values(pet.scale), (array) => {
		return _.size(array);
	}));
	
	docString += `### Upgrades\n`;
	//docString += `All Tier 1 upgrades come free with your pet.\n`;
	//docString += `Any further upgrades must be purchased.\n\n`;
	
	docString += `| Upgrade/Cost |`;
	
	var tempString = `|---:|`;
	
	for (var i = 0; i < maxLength; i++) {
		docString += ` Tier ${i+1} |`;
		tempString += `:---:|`;
	}
	
	docString += `\n`;
	tempString += `\n`;
	
	docString += tempString;
	
	_.each(_.keys(pet.scale), (upgradeKey) => {
		
		const upgrade = pet.scale[upgradeKey];
		const cost = pet.scaleCost[upgradeKey];
				
		docString += `| ${upgradeKey} |`;
		var costString = `| Cost |`;
		
		for (var i = 0; i < maxLength; i++) {
			if (i < _.size(upgrade)) {
				docString += ` ${upgrade[i]} |`;
				
				if (cost[i] > 0) {
					costString += ` ${cost[i]} |`;
				}
				else {
					costString += ` --- |`;
				}
			}
			else {
				docString += ` --- |`;
				costString += ` --- |`;
			}
		}
		
		docString += `\n`;
		costString += `\n`;
		
		docString += costString;
	});
});

fs.writeFileSync('docs/PETS.md', docString);