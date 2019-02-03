"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const RestrictedNumber = require("restricted-number");
const game_state_1 = require("../game-state");
const settings_1 = require("../../static/settings");
const logger_1 = require("../../shared/logger");
const equipment_1 = require("../base/equipment");
const spellmanager_1 = require("../../plugins/combat/spellmanager");
const effectmanager_1 = require("../../plugins/combat/effectmanager");
const stat_calculator_1 = require("../../shared/stat-calculator");
const generator_js_1 = require("./generator.js");
class Character {
    init(opts) {
        _.extend(this, opts);
        if (!this.name)
            logger_1.Logger.error('Player', new Error('No name specified.'), opts);
        if (!this._hp)
            this._hp = { minimum: 0, maximum: 20, __current: 20 };
        if (!this._mp)
            this._mp = { minimum: 0, maximum: 0, __current: 0 };
        if (!this._xp)
            this._xp = { minimum: 0, maximum: this.levelUpXpCalc(1), __current: 0 };
        if (!this._level)
            this._level = { minimum: 1, maximum: settings_1.SETTINGS.maxLevel, __current: this.levelSet || 1 };
        if (!this._special)
            this._special = { minimum: 0, maximum: 0, __current: 0 };
        this._level.minimum = 1;
        if (this._level.maximum < settings_1.SETTINGS.maxLevel) {
            this._level.maximum = settings_1.SETTINGS.maxLevel;
        }
        if (this._xp.__current > this._xp.maximum) {
            this._xp.__current = this._xp.maximum;
        }
        _.each(['_hp', '_mp', '_xp', '_level', '_special'], stat => {
            if (_.isNaN(this[stat].__current))
                this[stat].__current = 0;
            this[stat].__proto__ = RestrictedNumber.prototype;
        });
        _.each(_.compact(_.flatten(_.values(this.equipment))), item => {
            delete item.isUnderNormalPercent;
            delete item.isNormallyEnchantable;
            delete item.isNothing;
            delete item.score;
            delete item.fullname;
            item.__proto__ = equipment_1.Equipment.prototype;
        });
        if (!this.gender)
            this.gender = _.sample(['male', 'female']);
        if (!this.professionName)
            this.professionName = 'Generalist';
        if (!this.equipment)
            this.equipment = {};
        if (!this.statCache)
            this.statCache = {};
        this.$effects = new effectmanager_1.EffectManager();
        this.$stats = new Proxy({}, {
            get: (target, name) => {
                if (_.includes(generator_js_1.Generator.stats, name) && !_.includes(['gold', 'xp'], name)) {
                    return stat_calculator_1.StatCalculator.stat(this, name);
                }
                if (!stat_calculator_1.StatCalculator[name])
                    return null;
                try {
                    return stat_calculator_1.StatCalculator[name](this);
                }
                catch (e) {
                    logger_1.Logger.error('Character: $stats', e, { name });
                }
            }
        });
        this.changeProfession(this.professionName);
    }
    get hp() { return this._hp.__current; }
    get mp() { return this._mp.__current; }
    get xp() { return this._xp.__current; }
    get level() { return this._level.__current; }
    get special() { return this._special.__current; }
    get profession() { return this.$profession; }
    get liveStats() { return this.$stats; }
    get stats() { return this.statCache; }
    get fullname() { return this.name; }
    randomDeathMessage() {
        return _.sample([
            '%player watched %hisher innards become outards.',
            '%player vanished into thin air.',
            '%player has died.',
            '%player isn\'t pining for the fjords!',
            '%player has passed on.',
            '%player has gone to meet their maker.',
            '%player\'s a stiff!',
            'Bereft of life, %player can finally rest in pieces.',
            '%player\'s metabolic processes are now history!',
            '%player kicked the bucket, and the bucket kicked back!'
        ]);
    }
    get deathMessage() {
        return this._deathMessage;
    }
    get party() {
        if (!this.$partyName)
            return null;
        return game_state_1.GameState.getInstance().getParty(this.$partyName);
    }
    get itemScore() {
        return _.reduce(_.flatten(_.values(this.equipment)), (prev, cur) => {
            const newScore = cur.score;
            if (newScore <= 0)
                return prev;
            if (cur.type === 'soul' || cur.type === 'providence' || cur.type === 'trinket')
                return prev;
            return prev + newScore;
        }, 0);
    }
    get score() {
        return this.itemScore;
    }
    get spells() {
        return spellmanager_1.SpellManager.validSpells(this);
    }
    get isPlayer() { return this.joinDate; }
    recalculateStats(otherStats = stat_calculator_1.ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier'])) {
        _.each(otherStats, stat => {
            const val = this.liveStats[stat];
            if (_.includes(['xp', 'gold'], stat))
                return;
            this.statCache[stat] = val;
        });
        const hpVal = stat_calculator_1.StatCalculator.hp(this);
        this._hp.maximum = this._hp.__current = hpVal + (this.hpBoost || 0);
        const mpVal = stat_calculator_1.StatCalculator.mp(this);
        this._mp.maximum = this._mp.__current = mpVal + (this.mpBoost || 0);
    }
    changeProfession(professionName) {
        if (this.$profession)
            this.$profession.unload(this);
        this.professionName = professionName;
        this.$profession = require(`../professions/${professionName}`)[professionName];
        this.$profession.load(this);
        this.recalculateStats();
    }
    calcLuckBonusFromValue(value = this.liveStats.luk) {
        const tiers = [1, 2, 4, 6, 10, 20, 35, 65, 125, 175, 200, 250, 400, 450, 500];
        const postMaxTierDifference = 150;
        let bonus = 0;
        for (let i = 0; i < tiers.length; i++) {
            if (value >= tiers[i]) {
                bonus++;
            }
        }
        let postmax = tiers[tiers.length - 1] + postMaxTierDifference;
        if (value >= tiers[tiers.length - 1]) {
            while (value > postmax) {
                bonus++;
                postmax += postMaxTierDifference;
            }
        }
        return bonus;
    }
    canEquip(item, rangeBoostMultiplier = 1, useCheckRangeMultiplier = true) {
        const myItem = this.equipment[item.type];
        const checkScore = item.score;
        const myScore = myItem ? myItem.score : -1000;
        const itemFindRange = rangeBoostMultiplier * this.liveStats.itemFindRange;
        let checkRangeMultiplier = this.$personalities && this.$personalities.isActive('SharpEye') ? 0.65 : 0.05;
        if (!useCheckRangeMultiplier) {
            checkRangeMultiplier = 0;
        }
        const metRequirements = (this.isPlayer) ? _(item)
            .keys()
            .filter(stat => _.includes(stat, 'Req'))
            .every(requirement => {
            if (requirement.startsWith('a')) {
                const name = _(requirement).trimStart().replace('aReq', '').replace(/_/g, ' ');
                const tier = item[requirement];
                return this.$achievements.hasAchievement(name) && this.$achievements.hasAchievementAtTier(name, tier);
            }
            else if (requirement.startsWith('c')) {
                const name = _(requirement).trimStart().replace('cReq', '').replace(/_/g, ' ');
                const number = item[requirement];
                return this.$collectibles.hasTotalCollectibleAtNumber(name, number);
            }
            else if (requirement.startsWith('s')) {
                let statisticName = _(requirement).trimStart().replace('sReq', '').replace(/\*/g, ' ').split(' ');
                const requiredNumber = item[requirement];
                if (statisticName[0] === 'Boss_Kills')
                    statisticName[0] = 'BossKills';
                if (statisticName[0] === 'Regions' || statisticName[0] === 'Maps' || statisticName[0] === 'BossKills')
                    statisticName.unshift('Character');
                statisticName = statisticName.join('.').replace(/_/g, ' ');
                return this.$statistics.getStat(statisticName) >= requiredNumber;
            }
            return false;
        }) : false;
        return checkScore > 0 && checkScore > (myScore * checkRangeMultiplier) && checkScore <= itemFindRange && metRequirements;
    }
    equip(item) {
        item._wasEquipped = true;
        this.equipment[item.type] = item;
        this.recalculateStats();
        if (this.$statistics) {
            this.$statistics.incrementStat('Character.Item.Equip');
        }
    }
    levelUp() {
        this._level.add(1);
        this.resetMaxXp();
        this._xp.toMinimum();
        this.recalculateStats();
    }
    resetMaxXp() {
        this._xp.maximum = this.levelUpXpCalc(this.level);
    }
    levelUpXpCalc(level) {
        let xp = Math.floor(100 + (400 * Math.pow(level, 1.71)));
        if (level > 200) {
            const modifier = level - 200;
            xp += (xp * (modifier / 100));
            if (level >= this._level.maximum - settings_1.SETTINGS.ascensionLevelBoost) {
                const levelsTilMax = this._level.maximum - level;
                const multiplier = settings_1.SETTINGS.ascensionXpCurve * (settings_1.SETTINGS.ascensionLevelBoost - levelsTilMax);
                xp += (xp * (multiplier / 100));
            }
        }
        return Math.floor(xp);
    }
    gainGold(gold = 1) {
        this.gold += gold;
        if (this.gold < 0 || _.isNaN(this.gold)) {
            this.gold = 0;
        }
        return gold;
    }
    gainXp(xp = 1) {
        this._xp.add(xp);
        return xp;
    }
    sellItem(item) {
        const value = Math.max(1, Math.floor(item.score * this.liveStats.itemValueMultiplier));
        const maxValue = this.liveStats.itemFindRange * 10;
        if (this.$statistics) {
            this.$statistics.incrementStat('Character.Item.Sell');
        }
        const gold = this.gainGold(Math.min(maxValue, value));
        return gold;
    }
}
exports.Character = Character;
