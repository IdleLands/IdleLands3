"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../static/settings");
exports.chatSetup = (primus) => {
    if (process.env.INSTANCE_NUMBER != 0)
        return;
    if (!settings_1.SETTINGS.externalChat)
        return;
    if (primus.extChat)
        return;
    primus.extChat = new (require(`./external.chat.${settings_1.SETTINGS.externalChat}`).ExternalChatMechanism);
    primus.extChat.connect(primus, 'chat:channel:General');
};
