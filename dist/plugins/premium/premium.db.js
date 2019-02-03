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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constitute_1 = require("constitute");
const db_wrapper_1 = require("../../shared/db-wrapper");
const messages_1 = require("../../static/messages");
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
const premium_1 = require("./premium");
let PremiumDb = class PremiumDb {
    constructor(DbWrapper) {
        this.dbWrapper = DbWrapper;
    }
    getPremium(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const premiums = db.$$collections.premiums;
            return new Promise((resolve, reject) => {
                premiums.find({ _id: id }).limit(1).next((err, doc) => {
                    if (err) {
                        return reject({ err, msg: messages_1.MESSAGES.GENERIC });
                    }
                    try {
                        const premium = di_wrapper_1.constitute(premium_1.Premium);
                        premium.init(doc);
                        resolve(premium);
                    }
                    catch (e) {
                        logger_1.Logger.error('PremiumDb:getPremium', e);
                        reject({ e, msg: messages_1.MESSAGES.GENERIC });
                    }
                });
            });
        });
    }
    savePremium(premiumObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.dbWrapper.connectionPromise();
            const premiums = db.$$collections.premiums;
            return new Promise((resolve, reject) => {
                premiums.updateOne({ _id: premiumObject._id }, { $set: {
                        ilp: premiumObject.ilp,
                        oneTimeItemsPurchased: premiumObject.oneTimeItemsPurchased,
                        donatorFirstTimeBonus: premiumObject.donatorFirstTimeBonus,
                        consumables: premiumObject.consumables
                    } }, { upsert: true }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(premiumObject);
                });
            });
        });
    }
};
PremiumDb = __decorate([
    constitute_1.Dependencies(db_wrapper_1.DbWrapper),
    __metadata("design:paramtypes", [Object])
], PremiumDb);
exports.PremiumDb = PremiumDb;
