"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_wrapper_1 = require("../../shared/db-wrapper");
const messages_1 = require("../../static/messages");
exports.persistToDb = (battleInstance) => __awaiter(this, void 0, void 0, function* () {
    const saveData = battleInstance.saveObject();
    const db = yield db_wrapper_1.DbWrapper.promise;
    const battles = db.$$collections.battles;
    return new Promise((resolve, reject) => {
        battles.findOneAndUpdate({ _id: saveData._id }, saveData, { upsert: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(saveData);
        }, reject);
    });
});
exports.retrieveFromDb = (battleName) => __awaiter(this, void 0, void 0, function* () {
    const db = yield db_wrapper_1.DbWrapper.promise;
    const battles = db.$$collections.battles;
    return new Promise((resolve, reject) => {
        battles.find({ _id: battleName }).limit(1).next((err, doc) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return reject({ err, msg: messages_1.MESSAGES.GENERIC });
            }
            if (!doc) {
                return reject({ err, msg: messages_1.MESSAGES.NO_BATTLE });
            }
            resolve(doc);
        }));
    });
});
