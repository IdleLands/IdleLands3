"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = {
    GENERIC: { notify: 'Generic error message. How did you get this?' },
    NO_PLAYER: { type: 'error', title: 'Login Error', notify: 'Player does not exist.' },
    INVALID_TOKEN: { type: 'error', title: 'Login Error', notify: 'Invalid auth token.' },
    INVALID_NAME: { type: 'error', title: 'Register Error', notify: 'Invalid character name. It must be between 2 and 20 characters.' },
    PLAYER_EXISTS: { type: 'error', title: 'Register Error', notify: 'A player with that name already exists.' },
    ALREADY_LOGGED_IN: { type: 'error', title: 'Login Error', notify: 'You are already logged in elsewhere!' },
    BANNED: { type: 'error', title: 'Banned', notify: 'You are banned!' },
    LOGIN_SUCCESS: { type: 'success', title: 'Login', notify: '' },
    ON_OTHER_SHARD: { type: 'error', title: 'Login', notify: 'You are already logged in on another shard.' },
    NO_BATTLE: { type: 'error', title: 'Battle Expired', notify: 'That battle is too old to be loaded.' }
};
