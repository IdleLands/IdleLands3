"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
const Professions = require("../core/professions/_all");
const item_generator_1 = require("./item-generator");
const generator_1 = require("../core/base/generator");
const equipment_1 = require("../core/base/equipment");
const asset_loader_1 = require("../shared/asset-loader");
const Bosses = require("../../assets/maps/content/boss.json");
const BossParties = require("../../assets/maps/content/bossparties.json");
const BossItems = require("../../assets/maps/content/bossitems.json");
const bossTimers = {};
class MonsterGenerator extends generator_1.Generator {
    static get bossTimers() {
        return bossTimers || {};
    }
    static _setBossTimer(name) {
        const respawn = Bosses[name] ? Bosses[name].respawn : BossParties[name].respawn;
        bossTimers[name] = Date.now() + (1000 * respawn);
    }
    static _isBossAlive(name) {
        return bossTimers[name] ? bossTimers[name] - Date.now() < 0 : true;
    }
    static generateBoss(name, forPlayer) {
        const boss = _.cloneDeep(Bosses[name]);
        if (!this._isBossAlive(name))
            return;
        boss.stats.name = `${name}`;
        boss.stats._name = `${name}`;
        const monster = this.augmentMonster(boss.stats, forPlayer);
        monster.$isBoss = true;
        this.equipBoss(monster, boss.items);
        monster._collectibles = boss.collectibles;
        return [monster];
    }
    static generateBossParty(name, forPlayer) {
        const bossparty = BossParties[name];
        if (!this._isBossAlive(name))
            return;
        return _.map(bossparty.members, member => {
            const boss = _.cloneDeep(Bosses[member]);
            boss.stats.name = `${member}`;
            boss.stats._name = `${member}`;
            const monster = this.augmentMonster(boss.stats, forPlayer);
            monster.$isBoss = true;
            this.equipBoss(monster, boss.items);
            monster._collectibles = boss.collectibles;
            return monster;
        });
    }
    static equipBoss(monster, items) {
        if (!items || !items.length)
            return;
        _.each(items, item => {
            const itemInst = new equipment_1.Equipment(BossItems[item.name]);
            itemInst.name = item.name;
            itemInst.itemClass = 'guardian';
            itemInst.dropPercent = item.dropPercent;
            item_generator_1.ItemGenerator.tryToVectorize(itemInst, monster.level);
            monster.equip(itemInst);
        });
    }
    static generateMonsters(party) {
        return _.map(party.players, p => {
            return this.augmentMonster(this.pickMonster(p), p);
        });
    }
    static pickMonster(player) {
        return _.clone(_(asset_loader_1.ObjectAssets.monster)
            .reject(mon => mon.level > player.level + 5 || mon.level < player.level - 5)
            .sample());
    }
    static equipMonster(monster, baseMonster) {
        // give it some equipment to defend itself with
        _.each(generator_1.Generator.types, type => {
            const item = item_generator_1.ItemGenerator.generateItem(type, monster.level * 15, monster.level);
            if (monster.canEquip(item, monster.level * 5, false)) {
                monster.equip(item);
            }
        });
        // base stats = "monster essence"; always given to a monster after other equipment
        const baseEssence = _.pick(baseMonster, generator_1.Generator.stats);
        baseEssence.type = 'essence';
        baseEssence.name = 'monster essence';
        const essence = new equipment_1.Equipment(baseEssence);
        monster.equip(essence);
    }
    static generateVectorMonster(forPlayer) {
        const profession = _.sample(_.keys(Professions));
        return {
            name: `Vector ${profession}`,
            class: profession,
            level: forPlayer.level
        };
    }
    static augmentMonster(baseMonster, forPlayer) {
        if (!baseMonster)
            baseMonster = this.generateVectorMonster(forPlayer);
        baseMonster.professionName = baseMonster.class;
        if (!baseMonster.professionName || baseMonster.professionName.toLowerCase() === 'random') {
            baseMonster.professionName = _.sample(_.keys(Professions));
        }
        // TODO personalities
        // TODO other additions
        if (baseMonster.name && chance.bool({ likelihood: 1 })) {
            const chanceOpts = { prefix: chance.bool(), suffix: chance.bool(), middle: chance.bool() };
            if (baseMonster.gender) {
                chanceOpts.gender = _.sample(['male', 'female']);
            }
            baseMonster.name = `${chance.name(chanceOpts)}, the ${baseMonster.name}`;
        }
        const Monster = require('../plugins/combat/monster').Monster;
        const monster = new Monster();
        if (baseMonster.mirror) {
            baseMonster.professionName = forPlayer && forPlayer.professionName ? forPlayer.professionName : 'Monster';
            baseMonster.level = forPlayer && forPlayer.professionName ? forPlayer.level : baseMonster.level;
        }
        if (forPlayer) {
            const levelDifference = forPlayer.level - baseMonster.level;
            if (levelDifference > 25) {
                _.each(['str', 'con', 'dex', 'int', 'agi', 'luk'], stat => {
                    const mod = Math.floor(levelDifference / 10);
                    baseMonster[stat] = baseMonster[stat] || 0;
                    baseMonster[stat] += Math.floor(baseMonster[stat] * (mod / 100));
                });
            }
        }
        monster.init(baseMonster);
        if (baseMonster.mirror && forPlayer) {
            _.each(_.values(forPlayer.equipment), item => {
                const cloned = _.cloneDeep(item);
                monster.equip(cloned);
            });
        }
        else {
            this.equipMonster(monster, baseMonster);
        }
        if (forPlayer) {
            const levelDifference = forPlayer.level - monster.level;
            if (levelDifference > 25) {
                _.each(_.values(monster.equipment), item => {
                    _.each(['str', 'con', 'dex', 'int', 'agi', 'luk'], stat => {
                        const mod = Math.floor(levelDifference / 10);
                        item[stat] = item[stat] || 0;
                        item[stat] += Math.floor(item[stat] * (mod / 100));
                    });
                });
            }
        }
        return monster;
    }
}
exports.MonsterGenerator = MonsterGenerator;
