"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Rollbar = require("rollbar");
const rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;
const isQuiet = process.env.QUIET;
let rollbar = null;
if (rollbarToken) {
    rollbar = new Rollbar({
        accessToken: rollbarToken,
        handleUncaughtExceptions: true,
        handleUnhandledRejections: true
    });
}
class Logger {
    static _formatMessage(tag, message) {
        return `[${new Date()}] {${tag}} ${message}`;
    }
    static error(tag, error, payload) {
        return new Promise(resolve => {
            console.error(this._formatMessage(tag, error.message));
            if (error.stack) {
                console.error(error.stack);
            }
            if (payload) {
                console.error('PAYLOAD', payload);
            }
            if (rollbarToken && rollbar) {
                if (payload) {
                    rollbar.error(error, null, payload, resolve);
                }
                else {
                    rollbar.error(error, resolve);
                }
            }
        });
    }
    static important(tag, message) {
        console.log(this._formatMessage(`${process.env.INSTANCE_NUMBER}:${tag}`, message));
    }
    static info(tag, message) {
        if (isQuiet)
            return;
        console.info(this._formatMessage(`${process.env.INSTANCE_NUMBER}:${tag}`, message));
    }
    static silly(tag, message) {
        const SILLY = process.env.DEBUG_SILLY;
        if (!SILLY)
            return;
        if (SILLY === '1' || SILLY === tag || _.includes(message, SILLY)) {
            console.info(this._formatMessage(`${process.env.INSTANCE_NUMBER}:${tag}`, message));
        }
    }
}
exports.Logger = Logger;
