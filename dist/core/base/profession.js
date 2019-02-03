"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Profession {
    static load() { }
    static unload() { }
    static handleEvent(target, event, args) {
        _.each(args.battle.allPlayers, player => {
            let func = '';
            if (player === target) {
                func = `_eventSelf${event}`;
            }
            else if (player.party === target.party) {
                func = `_eventAlly${event}`;
            }
            else {
                func = `_eventEnemy${event}`;
            }
            if (target.$profession[func]) {
                target.$profession[func](target, args);
            }
            if (target[func]) {
                target[func](target, args);
            }
        });
    }
    static setupSpecial() { }
    static resetSpecial(target) {
        target._special.name = '';
        target._special.maximum = target._special.minimum = target._special.__current = 0;
    }
}
Profession.baseHpPerLevel = 270;
Profession.baseHpPerCon = 30;
Profession.baseHpPerInt = 0;
Profession.baseHpPerDex = 0;
Profession.baseHpPerStr = 0;
Profession.baseHpPerAgi = 0;
Profession.baseHpPerLuk = 0;
Profession.baseMpPerLevel = 0;
Profession.baseMpPerInt = 0;
Profession.baseMpPerCon = 0;
Profession.baseMpPerDex = 0;
Profession.baseMpPerStr = 0;
Profession.baseMpPerAgi = 0;
Profession.baseMpPerLuk = 0;
Profession.baseConPerLevel = 3;
Profession.baseDexPerLevel = 3;
Profession.baseAgiPerLevel = 3;
Profession.baseStrPerLevel = 3;
Profession.baseIntPerLevel = 3;
Profession.baseLukPerLevel = 0;
Profession.classStats = {};
exports.Profession = Profession;
