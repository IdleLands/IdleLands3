"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const game_state_1 = require("../../core/game-state");
const ProfessionChange_1 = require("../events/events/ProfessionChange");
const BattleBoss_1 = require("../events/events/BattleBoss");
const FindTreasure_1 = require("../events/events/FindTreasure");
const Events = require("../events/events/_all");
const settings_1 = require("../../static/settings");
const logger_1 = require("../../shared/logger");
const _emitter_1 = require("./_emitter");
const monster_generator_1 = require("../../shared/monster-generator");
const Chance = require("chance");
const chance = new Chance(Math.random);
const directions = [1, 2, 3, 6, 9, 8, 7, 4];
class PlayerMovement {
    static num2dir(dir, x, y) {
        switch (dir) {
            case 1: return { x: x - 1, y: y - 1 };
            case 2: return { x: x, y: y - 1 };
            case 3: return { x: x + 1, y: y - 1 };
            case 4: return { x: x - 1, y: y };
            case 6: return { x: x + 1, y: y };
            case 7: return { x: x - 1, y: y + 1 };
            case 8: return { x: x, y: y + 1 };
            case 9: return { x: x + 1, y: y + 1 };
            default: return { x: x, y: y };
        }
    }
    static canEnterTile(player, tile) {
        const properties = _.get(tile, 'object.properties');
        if (properties) {
            let totalRequirements = 0;
            let metRequirements = 0;
            if (properties.requireMap) {
                totalRequirements++;
                if (player.$statistics.getStat(`Character.Maps.${properties.requireMap}`) > 0)
                    metRequirements++;
            }
            if (properties.requireRegion) {
                totalRequirements++;
                if (player.$statistics.getStat(`Character.Regions.${properties.requireRegion}`) > 0)
                    metRequirements++;
            }
            if (properties.requireBoss) {
                totalRequirements++;
                if (player.$statistics.getStat(`Character.BossKills.${properties.requireBoss}`) > 0)
                    metRequirements++;
            }
            if (properties.requireClass) {
                totalRequirements++;
                if (player.professionName === properties.requireClass)
                    metRequirements++;
            }
            if (properties.requireAchievement) {
                totalRequirements++;
                if (player.$achievements.hasAchievement(properties.requireAchievement))
                    metRequirements++;
            }
            if (properties.requireCollectible) {
                totalRequirements++;
                if (player.$collectibles.hasCollectible(properties.requireCollectible))
                    metRequirements++;
            }
            if (properties.requireAscension) {
                totalRequirements++;
                if (player.ascensionLevel >= +properties.requireAscension)
                    metRequirements++;
            }
            if (properties.requireHoliday) {
                totalRequirements++;
                const { start, end } = settings_1.SETTINGS.holidays[properties.requireHoliday];
                const today = new Date();
                const meets = today.getMonth() >= start.getMonth()
                    && today.getDate() >= start.getDate()
                    && today.getMonth() <= end.getMonth()
                    && today.getDate() <= end.getDate();
                if (meets)
                    metRequirements++;
            }
            if (totalRequirements !== metRequirements)
                return;
        }
        return !tile.blocked && tile.terrain !== 'Void';
    }
    static handleTile(player, tile, ignoreIf) {
        const type = _.get(tile, 'object.type');
        const forceEvent = _.get(tile, 'object.properties.forceEvent', '');
        if (forceEvent) {
            if (!Events[forceEvent]) {
                logger_1.Logger.error('PlayerMovement', new Error(`forceEvent ${forceEvent} does not exist at ${player.x}, ${player.y} in ${player.map}`));
                return;
            }
            if (!player.forceEvent)
                player.forceEvent = { steps: 0, decrementer: 0 };
            Events[forceEvent].operateOn(player, tile.object.properties);
            player.forceEvent.steps++;
            if (player.forceEvent.steps > 500)
                player.forceEvent.steps = 500;
        }
        if (!type || !this[`handleTile${type}`] || ignoreIf === type)
            return;
        this[`handleTile${type}`](player, tile);
    }
    static handleTileTreasure(player, tile) {
        FindTreasure_1.FindTreasure.operateOn(player, { treasureName: tile.object.name });
    }
    static handleTileBoss(player, tile) {
        const boss = monster_generator_1.MonsterGenerator.generateBoss(tile.object.name, player);
        if (!boss)
            return;
        BattleBoss_1.BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: boss });
    }
    static handleTileBossParty(player, tile) {
        const bossparty = monster_generator_1.MonsterGenerator.generateBossParty(tile.object.name, player);
        if (!bossparty)
            return;
        BattleBoss_1.BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: bossparty });
    }
    static handleTileGuildTeleport(player) {
        if (!player.hasGuild)
            return;
        this.handleTileTeleport(player, { object: { properties: { toLoc: 'guildbase', movementType: 'teleport' } } });
    }
    static handleTileTrainer(player, tile) {
        if (player.stepCooldown > 0)
            return;
        player.stepCooldown = 10;
        const professionName = tile.object.name;
        const trainerName = tile.object.properties.realName ?
            `${tile.object.properties.realName}, the ${professionName} trainer` :
            `the ${professionName} trainer`;
        ProfessionChange_1.ProfessionChange.operateOn(player, { professionName, trainerName });
    }
    static handleTileTeleport(player, tile, force = false) {
        const dest = tile.object.properties;
        dest.x = +dest.destx;
        dest.y = +dest.desty;
        if (dest.movementType === 'ascend' && player.$personalities.isActive('Delver'))
            return;
        if (dest.movementType === 'descend' && player.$personalities.isActive('ScaredOfTheDark'))
            return;
        if (!force && (dest.movementType === 'ascend' || dest.movementType === 'descend')) {
            if (player.stepCooldown > 0)
                return;
            player.stepCooldown = 10;
        }
        if (!dest.map && !dest.toLoc) {
            logger_1.Logger.error('PlayerMovement', new Error(`No dest.map at ${player.x}, ${player.y} in ${player.map}`));
            return;
        }
        if (!dest.movementType) {
            logger_1.Logger.error('PlayerMovement', new Error(`No dest.movementType at ${player.x}, ${player.y} in ${player.map}`));
            return;
        }
        if (!dest.fromName)
            dest.fromName = player.map;
        if (!dest.destName)
            dest.destName = dest.map;
        if (dest.toLoc) {
            if (dest.toLoc === 'guildbase' && player.hasGuild) {
                const base = player.guild.baseMap;
                dest.x = base.startLoc[0];
                dest.y = base.startLoc[1];
                dest.map = player.guild.baseName;
                dest.destName = `${player.guildName}'s Guild Base`;
            }
            else {
                const toLocData = settings_1.SETTINGS.locToTeleport(dest.toLoc);
                dest.x = toLocData.x;
                dest.y = toLocData.y;
                dest.map = toLocData.map;
                dest.destName = toLocData.formalName;
            }
        }
        const destTile = this.getTileAt(dest.map, dest.x, dest.y);
        player.mapPath = destTile.path;
        player.map = dest.map;
        player.x = dest.x;
        player.y = dest.y;
        player.oldRegion = player.mapRegion;
        player.mapRegion = tile.region;
        this.handleTile(player, tile, 'Teleport');
        player.$statistics.incrementStat(`Character.Movement.${_.capitalize(dest.movementType)}`);
        _emitter_1.emitter.emit('player:transfer', { player, dest });
    }
    static handleTileCollectible(player, tile) {
        const collectible = tile.object;
        const collectibleName = collectible.name;
        const collectibleRarity = _.get(collectible, 'properties.rarity', 'basic');
        if (player.$collectibles.hasCollectible(collectibleName))
            return;
        const collectibleObj = {
            name: collectibleName,
            map: player.map,
            region: player.mapRegion,
            rarity: collectibleRarity,
            description: collectible.properties.flavorText,
            storyline: collectible.properties.storyline,
            foundAt: Date.now()
        };
        player.$collectibles.addCollectible(collectibleObj);
        _emitter_1.emitter.emit('player:collectible', { player, collectible: collectibleObj });
    }
    static getTileAt(map, x, y) {
        let mapInstance = game_state_1.GameState.getInstance().world.maps[map];
        if (!mapInstance) {
            mapInstance = game_state_1.GameState.getInstance().world.maps.Norkos;
            x = 10;
            y = 10;
        }
        return mapInstance.getTile(x, y);
    }
    static pickFollowTile(player, target) {
        if (!target.x || !target.y) {
            const payload = { player: player.buildTransmitObject(), target: target.buildTransmitObject(), party: player.party.buildTransmitObject() };
            logger_1.Logger.error('PlayerMovement', new Error(`${player.name} in ${player.map} @ ${player.x},${player.y} is following invalid target ${target.name} to ${target.x},${target.y}.`), { custom: payload });
        }
        // TODO: Do we need a non-zero index?
        return [0, { x: target.x, y: target.y }, target.lastDir];
    }
    static pickRandomTile(player, weight) {
        const indexes = [0, 1, 2, 3, 4, 5, 6, 7];
        const weights = weight;
        let useIndexes = [];
        let useWeights = [];
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] === 0)
                continue;
            useWeights.push(weights[i]);
            useIndexes.push(indexes[i]);
        }
        if (weight.length === 0 && !player.party) {
            logger_1.Logger.error('PlayerMovement', new Error(`${player.name} in ${player.map} @ ${player.x},${player.y} is unable to move due to no weights.`));
        }
        let randomIndex;
        try {
            randomIndex = chance.weighted(useIndexes, useWeights);
        }
        catch (e) {
            player.moveToStart();
            logger_1.Logger.error('PlayerMovement', new Error('Chance.weighted failed. RIP'));
        }
        const dir = directions[randomIndex];
        return [randomIndex, this.num2dir(dir, player.x, player.y), dir];
    }
    static getInitialWeight(player) {
        let weight = [300, 40, 7, 3, 1, 3, 7, 40];
        const drunk = player.$personalities.isActive('Drunk');
        if (player.lastDir && !drunk) {
            const lastDirIndex = directions.indexOf(player.lastDir);
            if (lastDirIndex !== -1) {
                weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
            }
        }
        else if (drunk) {
            weight = [1, 1, 1, 1, 1, 1, 1, 1];
        }
        return weight;
    }
    static partyTileCheck(player, tile) {
        const party = player.party;
        if (!party)
            return;
        const followTarget = party.getFollowTarget(player);
        if (!this.canEnterTile(player, tile)) {
            if (player.$partyStepsLeft)
                player.$partyStepsLeft = undefined;
            return;
        }
        if (followTarget && followTarget.map !== player.map) {
            player.$partyStepsLeft = (player.$partyStepsLeft === undefined) ? 3 : player.$partyStepsLeft;
            if (player.$partyStepsLeft <= 0) {
                player.$partyStepsLeft = undefined;
                return;
            }
            player.$partyStepsLeft--;
            return true;
        }
        if (player.$partyStepsLeft)
            player.$partyStepsLeft = undefined;
        return true;
    }
    static _doTeleport(player, { map, x, y, toLoc }) {
        const tileData = {
            object: {
                properties: {
                    destx: x,
                    desty: y,
                    movementType: 'teleport',
                    map,
                    toLoc
                }
            }
        };
        this.handleTileTeleport(player, tileData, true);
        const tile = this.getTileAt(player.map, player.x, player.y);
        this.handleTile(player, tile);
    }
}
exports.PlayerMovement = PlayerMovement;
