"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const map_1 = require("../../core/world/map");
const settings_1 = require("../../static/settings");
class GuildBase extends map_1.Map {
    constructor(name, guild) {
        super(`${__dirname}/../../../assets/maps/guildhall-maps/${name}.json`, `${guild.name} Guild Base`);
        this.dimensions = { sm: 3, md: 5, lg: 7 };
        this.baseTile = settings_1.SETTINGS.revGidMap.Tile;
        this.startLoc = [10, 10];
        this.costs = {
            moveIn: 0,
            build: {
                sm: 0,
                md: 0,
                lg: 0
            }
        };
        this.$instances = {
            sm: [],
            md: [],
            lg: []
        };
        this.buildings = {
            sm: [],
            md: [],
            lg: []
        };
        this.path = `guilds/${guild.name}`;
        this.$guild = guild;
    }
    init() {
        this.$slotSizes = {
            sm: this.buildings.sm.length,
            md: this.buildings.md.length,
            lg: this.buildings.lg.length
        };
    }
    updateSignpost(building, size, slot) {
        const { signpostLoc } = this.buildings[size][slot];
        const sign = _.find(this.map.layers[2].objects, { x: signpostLoc[0] * 16, y: (1 + signpostLoc[1]) * 16 });
        if (!sign)
            return;
        sign.name = `Level ${this.$guild.buildings.levels[building]} ${building}`;
    }
    buildBuilding(building, size, slot, instance) {
        const { startCoords, signpostLoc, tiles } = this.buildings[size][slot];
        const tileIndexes = [];
        const tileCoords = [];
        const dimensions = this.dimensions[size];
        const mapWidth = this.map.width;
        for (let i = 0; i < dimensions; i++) {
            const startLeft = ((i + startCoords[1]) * mapWidth) + startCoords[0];
            tileIndexes.push(..._.range(startLeft, startLeft + dimensions));
            for (let j = 0; j < dimensions; j++) {
                tileCoords.push({ x: startCoords[0] + j, y: i + startCoords[1] });
            }
        }
        const instanceProto = Object.getPrototypeOf(instance).constructor;
        _.each(tileIndexes, (index, myLookup) => {
            this.map.layers[0].data[index] = instanceProto.baseTile || this.baseTile;
            if (tiles[myLookup] > 0) {
                this.map.layers[1].data[index] = tiles[myLookup];
            }
        });
        this.map.layers[2].objects = _.reject(this.map.layers[2].objects, (item) => _.includes(tileIndexes, (item.y / 16) * mapWidth + item.x / 16));
        const sign = _.find(this.map.layers[2].objects, { x: signpostLoc[0] * 16, y: (1 + signpostLoc[1]) * 16 });
        if (sign) {
            sign.name = `Level ${this.$guild.buildings.levels[building]} ${building}`;
            sign.properties.flavorText = instanceProto.desc;
        }
        else {
            this.map.layers[2].objects.push({
                gid: 48,
                height: 0,
                width: 0,
                name: `Level ${this.$guild.buildings.levels[building]} ${building}`,
                properties: {
                    flavorText: instanceProto.prototype.desc
                },
                type: 'Sign',
                visible: true,
                x: signpostLoc[0] * 16,
                y: (1 + signpostLoc[1]) * 16
            });
        }
        _.each(instance.tiles, (tile, index) => {
            if (tile === 0)
                return;
            const gid = _.isObject(tile) ? tile.gid : tile;
            const newObj = {
                gid,
                height: 0,
                width: 0,
                visible: true,
                x: tileCoords[index].x * 16,
                y: (1 + tileCoords[index].y) * 16,
                properties: {}
            };
            if (_.isObject(tile))
                _.merge(newObj, tile);
            this.map.layers[2].objects.push(newObj);
        });
    }
    buildTransmitObject() {
        return _.omit(this, key => _.includes(key, '$'));
    }
}
GuildBase.moveInCost = 0;
exports.GuildBase = GuildBase;
