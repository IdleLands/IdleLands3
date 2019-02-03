"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actualConstitute = require("constitute");
let container = null;
exports.constitute = (Class) => {
    if (!container) {
        return actualConstitute(Class);
    }
    return container.constitute(Class);
};
// used for intercepting constitutes during tests, otherwise regular constitute is used.
exports.setConstituteContainer = (newContainer) => {
    container = newContainer;
};
