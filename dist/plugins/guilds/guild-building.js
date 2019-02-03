"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class GuildBuilding {
    constructor(guild) {
        this.tiles = [];
        this.$guild = guild;
        this.init();
    }
    static levelupCost(level) {
        return {
            wood: this.woodCost(level),
            clay: this.clayCost(level),
            stone: this.stoneCost(level),
            astralium: this.astraliumCost(level),
            gold: this.goldCost(level)
        };
    }
    ;
    _propertyName(name) {
        return `${this.constructor.name}-${name}`;
    }
    getProperty(name) {
        return _.get(this.$guild.buildings.properties, this._propertyName(name), null);
    }
    setProperty(name, value) {
        _.set(this.$guild.buildings.properties, this._propertyName(name), value);
    }
    init() { }
}
GuildBuilding.size = 'sm';
GuildBuilding.properties = [];
GuildBuilding.baseTile = 0;
GuildBuilding.woodCost = (level) => 0;
GuildBuilding.clayCost = (level) => 0;
GuildBuilding.stoneCost = (level) => 0;
GuildBuilding.astraliumCost = (level) => 0;
GuildBuilding.goldCost = (level) => 0;
exports.GuildBuilding = GuildBuilding;
