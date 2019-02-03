"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Spiritualist extends achievement_1.Achievement {
    static achievementData(player) {
        const requiredPets = ['Ghostly Shield', 'Ghostly Sword', 'Spellbook'];
        const pets = player.$pets;
        if (!pets || !pets.$pets)
            return [];
        if (!_.every(requiredPets, req => {
            const foundPet = pets.$pets[req];
            // Do we have the pet?
            if (!foundPet || !foundPet.scaleLevel || !foundPet.$scale)
                return false;
            // Is Max Level fully upgraded?
            if (foundPet.scaleLevel.maxLevel !== foundPet.$scale.maxLevel.length - 1)
                return false;
            // Is the pet at max level?
            if (foundPet.level !== foundPet.$scale.maxLevel[foundPet.scaleLevel.maxLevel])
                return false;
            return true;
        }))
            return [];
        return [{
                tier: 1,
                name: 'Spiritualist',
                desc: 'Get a title for getting max level on the ghostly pets!',
                type: achievement_1.AchievementTypes.PET,
                rewards: [{
                        type: 'title', title: 'Spiritualist', deathMessage: '%player became a ghooooooooost.'
                    }, {
                        type: 'petattr', petattr: 'a miniature ghost that says boo a lot'
                    }]
            }];
    }
}
exports.Spiritualist = Spiritualist;
