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
const _ = require("lodash");
const constitute_1 = require("constitute");
const festivals_db_1 = require("./festivals.db");
const festival_1 = require("./festival");
const mongodb_1 = require("mongodb");
const node_schedule_1 = require("node-schedule");
const send_system_message_1 = require("../../shared/send-system-message");
let Festivals = class Festivals {
    constructor(festivalsDb) {
        this.festivalsDb = festivalsDb;
        this.festivals = [];
        this.init();
    }
    init() {
        this.festivalsDb.getFestivals()
            .then(festivals => {
            this.festivals = festivals || [];
            _.each(festivals, festival => {
                this.setExpiryTimerForFestival(festival);
            });
        });
    }
    hasFestival(playerName) {
        return _.find(this.festivals, { startedBy: playerName });
    }
    addFestival(festival, insertIntoDb) {
        if (_.find(this.festivals, { name: festival.name }))
            return;
        if (festival.message) {
            send_system_message_1.sendSystemMessage(festival.message);
        }
        festival = new festival_1.Festival(festival);
        if (insertIntoDb) {
            this.festivalsDb.saveFestival(festival);
        }
        this.festivals.push(festival);
        this.setExpiryTimerForFestival(festival);
    }
    removeFestivalById(festivalId) {
        const festival = _.find(this.festivals, { _id: mongodb_1.ObjectId(festivalId) });
        if (!festival)
            return;
        this._removeFestival(festival);
    }
    _removeFestival(festival) {
        this.festivals = _.without(this.festivals, festival);
        send_system_message_1.sendSystemMessage(`${festival.name} is now over!`);
        this.festivalsDb.removeFestival(festival);
    }
    setExpiryTimerForFestival(festival) {
        if (festival.endDate < Date.now()) {
            this._removeFestival(festival);
            return;
        }
        node_schedule_1.scheduleJob(festival.endDate, () => {
            this._removeFestival(festival);
        });
    }
};
Festivals = __decorate([
    constitute_1.Dependencies(festivals_db_1.FestivalsDb),
    __metadata("design:paramtypes", [Object])
], Festivals);
exports.Festivals = Festivals;
