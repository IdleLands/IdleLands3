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
const AllPersonalities = require("./personalities/_all");
const logger_1 = require("../../shared/logger");
let Personalities = class Personalities {
    constructor(container) {
        const PersonalitiesDb = require('./personalities.db.js').PersonalitiesDb;
        try {
            container.schedulePostConstructor((personalitiesDb) => {
                this.personalitiesDb = personalitiesDb;
            }, [PersonalitiesDb]);
        }
        catch (e) {
            logger_1.Logger.error('Personalities', e);
        }
    }
    // clear current variables and set new
    init(opts) {
        this._id = undefined;
        this.activePersonalities = {};
        this.earnedPersonalities = [];
        _.extend(this, opts);
    }
    _allPersonalities(player) {
        return _(AllPersonalities)
            .values()
            .filter(ach => ach.hasEarned(player))
            .value();
    }
    _activePersonalityData() {
        return _(this.earnedPersonalities)
            .filter(({ name }) => this.isActive(name))
            .map(({ name }) => AllPersonalities[name])
            .value();
    }
    turnAllOff(player) {
        _.each(_.keys(this.activePersonalities), pers => {
            if (!this.activePersonalities[pers])
                return;
            this.togglePersonality(player, pers);
        });
    }
    togglePersonality(player, personality) {
        const newState = !this.activePersonalities[personality];
        this.activePersonalities[personality] = newState;
        if (newState) {
            AllPersonalities[personality].enable(player);
        }
        else {
            AllPersonalities[personality].disable(player);
        }
        this.save();
    }
    isAnyActive(personalities) {
        return _.some(personalities, p => this.isActive(p));
    }
    isActive(personality) {
        return this.activePersonalities[personality];
    }
    checkPersonalities(player) {
        const earned = this._allPersonalities(player);
        const earnedObjs = _.sortBy(_.map(earned, pers => {
            return {
                name: pers.name,
                description: pers.description
            };
        }), 'name');
        this.earnedPersonalities = earnedObjs;
        // this.save(); - these are regenerated a lot, this is not really necessary except on toggle
        return earnedObjs;
    }
    save() {
        this.personalitiesDb.savePersonalities(this);
    }
};
Personalities = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Personalities);
exports.Personalities = Personalities;
