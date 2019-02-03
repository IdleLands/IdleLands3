"use strict";
// TODO: https://github.com/IdleLands/IdleLandsOld/blob/e460f87751ddfe370f8e99b46d4838af5688b93b/src/system/handlers/MessageCreator.coffee
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Chance = require("chance");
const chance = new Chance();
const game_state_1 = require("../../core/game-state");
const asset_loader_1 = require("../../shared/asset-loader");
const logger_1 = require("../../shared/logger");
class AllDomains {
    static dict(props) {
        const { funct } = props[0];
        let normalizedFunct = funct.toLowerCase();
        let isPlural = false;
        if (normalizedFunct === 'nouns') {
            isPlural = true;
            normalizedFunct = 'noun';
        }
        const canLowercase = !_.includes(['deity'], normalizedFunct);
        let chosenItem = _.sample(asset_loader_1.StringAssets[normalizedFunct]) || this.placeholder();
        if (canLowercase) {
            chosenItem = normalizedFunct === funct ? chosenItem.toLowerCase() : _.capitalize(chosenItem);
        }
        if (normalizedFunct === 'noun' && !isPlural) {
            chosenItem = chosenItem.substring(0, chosenItem.length - 1); // supposedly, all nouns are plural
        }
        return chosenItem;
    }
    static placeholder() {
        return this.dict([{ funct: 'placeholder' }]);
    }
    static chance(props) {
        const { funct, args } = props[0];
        if (!chance[funct])
            return this.placeholder();
        return chance[funct](args);
    }
    static party(props, cache, partyData) {
        const { funct, cacheNum } = props[0];
        if (funct === 'member') {
            return partyData.players[cacheNum] ? partyData.players[cacheNum].fullname : this.placeholder();
        }
        return this.placeholder();
    }
    static combat(props, cache, combatData) {
        const { funct, cacheNum } = props[0];
        if (props[1]) {
            return this.party([props[1]], cache, combatData.parties[cacheNum]);
        }
        if (funct === 'party') {
            return combatData.parties[cacheNum].name;
        }
        return this.placeholder();
    }
    static random(props, cache) {
        const { domain, funct, cacheNum, args } = props[0];
        const got = cache.get(domain, funct, cacheNum);
        if (got)
            return got;
        const res = AssetDomainHandler[funct](args, props, cache);
        cache.set(domain, funct, cacheNum, res);
        return res;
    }
}
class AssetDomainHandler {
    static town() {
        return _.sample(_.filter(game_state_1.GameState.getInstance().world.uniqueRegions, r => _.includes(r, 'Town')));
    }
    static class() {
        return _.sample(asset_loader_1.StringAssets.class);
    }
    static player() {
        return _.sample(game_state_1.GameState.getInstance().players).fullname;
    }
    static map() {
        return _.sample(_.keys(game_state_1.GameState.getInstance().world.maps));
    }
    static pet() {
        const player = _.sample(game_state_1.GameState.getInstance().players);
        const pet = _.sample(player.$pets.$pets);
        return pet ? pet.fullname : AllDomains.placeholder();
    }
    static activePet() {
        const player = _.sample(game_state_1.GameState.getInstance().players);
        const pet = player.activePet;
        return pet ? pet.fullname : AllDomains.placeholder();
    }
    static guild() {
        return AllDomains.placeholder();
    }
    static item() {
        return _.sample(_.values(_.sample(game_state_1.GameState.getInstance().players).equipment)).fullname;
    }
    static monster() {
        return _.sample(asset_loader_1.ObjectAssets.monster).name;
    }
    static ingredient() {
        return _.sample(asset_loader_1.ObjectAssets[_.sample(['veg', 'meat', 'bread'])]).name;
    }
    static party() {
        const party = _.sample(_.values(game_state_1.GameState.getInstance().parties));
        if (party)
            return party.name;
        return AllDomains.placeholder();
    }
}
class PlayerOwnedDomainHandler {
    static pet(player) {
        const pet = player.$pets.activePet;
        if (pet)
            return pet.fullname;
        return AllDomains.placeholder();
    }
    static guild() {
        return _.sample(_.keys(game_state_1.GameState.getInstance().guilds.guilds)) || AllDomains.placeholder();
    }
    static guildMember(player) {
        if (!player.hasGuild)
            return AllDomains.placeholder();
        return _.sample(player.guild.members).name;
    }
}
class EventVariableCache {
    constructor() {
        this.cache = {};
    }
    get(domain, funct, num) {
        if (_.isNaN(num))
            throw new Error('Cache:get num cannot be NaN');
        return _.get(this.cache, `${domain}.${funct}.${num}`);
    }
    set(domain, funct, num, val) {
        if (_.isNaN(num))
            throw new Error('Cache:set num cannot be NaN');
        _.set(this.cache, `${domain}.${funct}.${num}`, val);
    }
}
class EventVariableManager {
    static transformVarProps(props, cache, eventData) {
        const { domain, funct, cacheNum } = props[0];
        let retVal = null;
        try {
            const prevCacheData = cache.get(domain, funct, cacheNum);
            if (prevCacheData && funct !== 'party')
                return prevCacheData;
            retVal = `«${AllDomains[domain](props, cache, eventData)}»`;
            if (funct !== 'party')
                cache.set(domain, funct, cacheNum, retVal);
        }
        catch (e) {
            logger_1.Logger.error('EventVariableManager', e, { props, cache });
        }
        return retVal;
    }
    static getVarProps(string) {
        const terms = string.split(' ');
        const varProps = [];
        _.each(terms, term => {
            const [props, cacheNum] = term.split('#');
            const [domain, funct] = props.split(':', 2);
            const args = props.substring(1 + funct.length + props.indexOf(funct)).trim().split('\'').join('"');
            try {
                varProps.push({
                    domain,
                    funct,
                    cacheNum: cacheNum ? +cacheNum : 0,
                    args: args ? JSON.parse(args) : null
                });
            }
            catch (e) {
                logger_1.Logger.error('MessageCreator', e, { string });
            }
        });
        return varProps;
    }
    static handleVariables(string, eventData = {}) {
        const cache = new EventVariableCache();
        return string.replace(/\$([a-zA-Z\:#0-9 {}_,']+)\$/g, (match, p1) => {
            let string = this.getVarProps(p1);
            string = this.transformVarProps(string, cache, eventData);
            return string;
        });
    }
}
class MessageParser {
    static genderPronoun(gender, replace) {
        switch (replace) {
            case '%hisher': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'veteran male': return 'his';
                    case 'female': return 'her';
                    case 'veteran female': return 'her';
                    default: return 'their';
                }
            }
            case '%hishers': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'veteran male': return 'his';
                    case 'female': return 'hers';
                    case 'veteran female': return 'hers';
                    default: return 'theirs';
                }
            }
            case '%himher': {
                switch (gender) {
                    case 'male': return 'him';
                    case 'veteran male': return 'him';
                    case 'female': return 'her';
                    case 'veteran female': return 'her';
                    default: return 'them';
                }
            }
            case '%she':
            case '%heshe': {
                switch (gender) {
                    case 'male': return 'he';
                    case 'veteran male': return 'he';
                    case 'female': return 'she';
                    case 'veteran female': return 'she';
                    default: return 'they';
                }
            }
        }
    }
    static stringFormat(string, player, extra = {}) {
        if (!player)
            return string;
        string = _.trim(string);
        if (extra.item)
            extra.item = `«${extra.item}»`;
        if (extra.partyName)
            extra.partyName = `«${extra.partyName}»`;
        if (extra.spellName)
            extra.spellName = `«${extra.spellName}»`;
        if (extra.weaponName)
            extra.weaponName = `«${extra.weaponName}»`;
        if (extra.targetName)
            extra.targetName = `«${extra.targetName}»`;
        if (extra.casterName)
            extra.casterName = `«${extra.casterName}»`;
        if (extra.treasure)
            extra.treasure = `«${extra.treasure}»`;
        if (extra.deflectItem)
            extra.deflectItem = `«${extra.deflectItem}»`;
        if (extra.collectible)
            extra.collectible = `«${extra.collectible}»`;
        _.each(_.keys(extra), key => {
            string = string.split(`%${key}`).join(_.isNumber(extra[key]) ? extra[key].toLocaleString() : extra[key]);
        });
        string = EventVariableManager.handleVariables(string, extra._eventData);
        const splitJoins = [
            { split: '%player', join: () => `«${player.fullname}»` },
            { split: '%pet', join: () => `«${PlayerOwnedDomainHandler.pet(player)}»` },
            { split: '%guildMember', join: () => `«${PlayerOwnedDomainHandler.guildMember(player)}»` },
            { split: '%guild', join: () => `«${PlayerOwnedDomainHandler.guild(player)}»` }
        ];
        _.each(['hishers', 'hisher', 'himher', 'she', 'heshe'], pronoun => {
            splitJoins.push({
                split: `%${pronoun}`,
                join: () => this.genderPronoun(player.gender, `%${pronoun}`)
            });
            splitJoins.push({
                split: `%${_.capitalize(pronoun)}`,
                join: () => _.capitalize(this.genderPronoun(player.gender, `%${pronoun}`))
            });
        });
        _.each(splitJoins, sj => {
            if (!_.includes(string, sj.split))
                return;
            string = string.split(sj.split).join(sj.join());
        });
        return string;
    }
}
exports.MessageParser = MessageParser;
