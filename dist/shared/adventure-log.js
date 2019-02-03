"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const server_1 = require("../primus/server");
const verifyMessage = (msg) => {
    if (!msg.type)
        return logger_1.Logger.error('AdventureLog', new Error('No message type given.'), msg);
    if (!msg.text)
        return logger_1.Logger.error('AdventureLog', new Error('No message text given.'), msg);
    if (!msg.category)
        return logger_1.Logger.error('AdventureLog', new Error('No message category given.'), msg);
    if (!msg.targets && msg.type !== 'Global')
        return logger_1.Logger.error('AdventureLog', new Error('No message targets given (message is not global).'), msg);
    return true;
};
exports.MessageCategories = {
    META: 'Meta',
    EXPLORE: 'Explore',
    LEVELUP: 'Levelup',
    ACHIEVEMENT: 'Achievement',
    COMBAT: 'Combat',
    PET: 'Pet',
    GUILD: 'Guild',
    TOWNCRIER: 'Towncrier',
    PARTY: 'Party',
    ITEM: 'Item',
    GOLD: 'Gold',
    PROFESSION: 'Profession',
    XP: 'Xp'
};
exports.MessageTypes = {
    GLOBAL: 'Global',
    SINGLE: 'Single'
};
exports.AdventureLog = (message) => {
    if (!verifyMessage(message))
        return;
    if (process.env.NODE_ENV !== 'production') {
        logger_1.Logger.info('AdventureLog', JSON.stringify(message));
    }
    message.event = 'adventurelog';
    server_1.primus.emitToPlayers(message.targets, message);
};
