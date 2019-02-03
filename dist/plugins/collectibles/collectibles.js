"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const constitute_1 = require("constitute");
const _ = require("lodash");
const logger_1 = require("../../shared/logger");
const game_state_1 = require("../../core/game-state");
let Collectibles = class Collectibles {
    constructor(container) {
        const CollectiblesDb = require('./collectibles.db').CollectiblesDb;
        try {
            container.schedulePostConstructor((collectiblesDb) => {
                this.collectiblesDb = collectiblesDb;
            }, [CollectiblesDb]);
        }
        catch (e) {
            logger_1.Logger.error('Collectibles', e);
        }
    }
    // clear current variables and set new
    init(opts) {
        this._id = undefined;
        this.collectibles = undefined;
        this.priorCollectibles = undefined;
        const allCollectibles = game_state_1.GameState.getInstance().world.allCollectibles;
        // update collectibles on login
        _.each(opts.collectibles, (coll, name) => {
            if (!allCollectibles[name]) {
                delete opts.collectibles[name];
                return;
            }
            coll.name = name;
            coll.rarity = allCollectibles[coll.name].rarity || 'basic';
            coll.description = allCollectibles[coll.name].flavorText;
            coll.storyline = allCollectibles[coll.name].storyline;
        });
        _.extend(this, opts);
        if (!this.priorCollectibles) {
            this.priorCollectibles = {};
        }
    }
    calcUniqueCollectibles() {
        return _.uniq(_.keys(this.collectibles).concat(_.keys(this.priorCollectibles))).length;
    }
    reset() {
        if (!this.priorCollectibles)
            this.priorCollectibles = {};
        _.each(_.values(this.collectibles), coll => {
            this.priorCollectibles[coll.name] = this.priorCollectibles[coll.name] || 0;
            this.priorCollectibles[coll.name]++;
        });
        this.collectibles = {};
    }
    get priorCollectibleData() {
        if (!this.priorCollectibles)
            return {};
        const allCollectibles = game_state_1.GameState.getInstance().world.allCollectibles;
        const emit = {};
        _.each(this.priorCollectibles, (count, coll) => {
            emit[coll] = _.cloneDeep(allCollectibles[coll]);
            if (!emit[coll])
                return;
            emit[coll].name = coll;
            emit[coll].count = count;
            emit[coll].description = emit[coll].flavorText;
        });
        return emit;
    }
    totalCollectibles() {
        return _.size(this.collectibles);
    }
    addCollectible(collectible) {
        const allCollectibles = game_state_1.GameState.getInstance().world.allCollectibles;
        const newCollectible = _.cloneDeep(allCollectibles[collectible.name]);
        this.collectibles[collectible.name] = newCollectible;
        this.save();
    }
    hadCollectible(collectibleName) {
        return this.priorCollectibles && this.priorCollectibles[collectibleName];
    }
    hasCollectible(collectibleName) {
        return this.collectibles[collectibleName];
    }
    hasTotalCollectibleAtNumber(collectibleName, number) {
        let count = 0;
        if (this.hasCollectible(collectibleName))
            count++;
        if (this.hadCollectible(collectibleName))
            count += this.priorCollectibles[collectibleName];
        return count >= number;
    }
    save() {
        this.uniqueCollectibles = this.calcUniqueCollectibles();
        this.collectiblesDb.saveCollectibles(this);
    }
};
Collectibles = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Collectibles);
exports.Collectibles = Collectibles;
