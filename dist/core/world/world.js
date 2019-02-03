"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const map_1 = require("./map");
const fs = require("fs");
const Bosses = require("../../../assets/maps/content/boss.json");
const Pets = require("../../../assets/maps/content/pets.json");
const Spells = require("../../plugins/combat/spells/_all");
class World {
    constructor() {
        this.load();
    }
    load() {
        this.maps = {};
        this.uniqueRegions = [];
        this.loadAllMaps();
        this.loadAllCollectibles();
    }
    getMapsInFolder(dir) {
        let results = [];
        const list = fs.readdirSync(__dirname + '/../../../' + dir);
        _.each(list, basefilename => {
            const filename = `${dir}/${basefilename}`;
            const stat = fs.statSync(__dirname + '/../../../' + filename);
            if (_.includes(filename, 'promo'))
                return;
            if (stat && stat.isDirectory())
                results = results.concat(this.getMapsInFolder(filename));
            else
                results.push({ map: basefilename.split('.')[0], path: __dirname + '/../../../' + filename });
        });
        return results;
    }
    loadAllMaps() {
        _.each(this.getMapsInFolder('assets/maps/world-maps'), ({ map, path }) => {
            const mapRef = new map_1.Map(path, map);
            this.maps[map] = mapRef;
            this.uniqueRegions.push(..._.uniq(_.compact(mapRef.regions)));
        });
    }
    loadAllCollectibles() {
        this.allCollectibles = {};
        _.each(Bosses, (boss, bossName) => {
            if (!boss.collectibles)
                return;
            _.each(boss.collectibles, coll => {
                coll.rarity = 'guardian';
                coll.map = 'Boss';
                coll.region = bossName;
                this.allCollectibles[coll.name] = coll;
            });
        });
        const mapRequirements = {};
        _.each(_.values(this.maps), map => {
            _.extend(this.allCollectibles, map.collectibles);
            _.extend(mapRequirements, map.loadRequirements());
        });
        const petRequirements = {};
        _.each(_.values(Pets), pet => {
            const collectibles = _.get(pet, 'requirements.collectibles', []);
            _.each(collectibles, coll => petRequirements[coll] = true);
        });
        const spellRequirements = {};
        _.each(_.flatten(_.map(Spells, 'tiers')), spellTier => {
            if (!spellTier.collectibles)
                return;
            _.each(spellTier.collectibles, coll => spellRequirements[coll] = true);
        });
        _.each(this.allCollectibles, (coll, name) => {
            coll.name = name;
            if (coll.map !== 'Boss')
                coll.rarity = 'basic';
            if (spellRequirements[name])
                coll.rarity = 'pro';
            if (petRequirements[name])
                coll.rarity = 'idle';
            if (mapRequirements[name])
                coll.rarity = 'godly';
        });
    }
}
exports.World = World;
