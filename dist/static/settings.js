"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const teleports = require('../../assets/maps/content/teleports.json');
class Settings {
    constructor() {
        this.timeframeSeconds = 5;
        this.maxLevel = 200;
        this.xpPerStep = 5;
        this.ilpConversionRate = 20000;
        this.pvpBattleRange = 1000;
        this.minBattleLevel = 5;
        this.minPartyLevel = 10;
        this.maxPartyMembers = 4;
        this.merchantMultiplier = 3;
        this.saveSteps = 10;
        this.achievementSteps = 60;
        this.ascensionLevelBoost = 50;
        this.ascensionXpCurve = 20;
        this.guild = {
            cost: 100000000
        };
        this.reductionDefaults = {
            itemFindRange: 12,
            itemFindRangeMultiplier: 0.5,
            itemValueMultiplier: 0.1,
            merchantCostReductionMultiplier: 0.0,
            merchantItemGeneratorBonus: 5
        };
        this.validGenders = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
        this.validPetAttributes = [
            'a top hat',
            'a monocle',
            'a fedora',
            'a bag of chips',
            'a giant keychain',
            'a rubber duck',
            'a glowing leek',
            'a YBox controller',
            'a Gandum minifig',
            'a pocket watch',
            'a cumberbund',
            'a funky tie',
            'a doily',
            'a polka-dot pillowcase',
            'a giant stack of sticky notes',
            'a miniature replica of the worlds biggest roller-coaster',
            'a spork with a knife on the other side',
            'a shiny medallion',
            'a used drinking straw',
            'a popping filter',
            'a giant rock used to stop doors dead in their tracks',
            'a tab formerly attached to a Dosa Can'
        ];
        this.maxChoices = 10;
        this.chatMessageMaxLength = 500;
        this.holidays = {
            valentine: {
                start: new Date('Feb 1'),
                end: new Date('Feb 28')
            },
            leprechaun: {
                start: new Date('Mar 1'),
                end: new Date('Mar 31')
            },
            eggs: {
                start: new Date('Apr 1'),
                end: new Date('Apr 30')
            },
            anniversary: {
                start: new Date('Jun 1'),
                end: new Date('Jun 30')
            },
            fireworks: {
                start: new Date('Jul 1'),
                end: new Date('Jul 31')
            },
            school: {
                start: new Date('Sep 1'),
                end: new Date('Sep 30')
            },
            hallows: {
                start: new Date('Oct 1'),
                end: new Date('Oct 31')
            },
            turkeys: {
                start: new Date('Nov 1'),
                end: new Date('Nov 31')
            },
            winter: {
                start: new Date('Dec 1'),
                end: new Date('Dec 31')
            }
        };
        this.externalChat = 'discord';
        this.chatConfig = {
            irc: {
                server: 'irc.freenode.net',
                nick: 'idlelandschat',
                channel: '##idlebot'
            }
        };
        this.gidMap = {
            1: 'StairsDown',
            2: 'StairsUp',
            3: 'BrickWall',
            4: 'Grass',
            5: 'Water',
            6: 'Lava',
            7: 'Tile',
            8: 'Ice',
            9: 'Forest',
            10: 'Sand',
            11: 'Swamp',
            12: 'BlueNPC',
            13: 'RedNPC',
            14: 'GreenNPC',
            15: 'QuestionMark',
            16: 'Tree',
            17: 'Mountain',
            18: 'Door',
            19: 'Dirt',
            20: 'FighterTrainer',
            21: 'MageTrainer',
            22: 'ClericTrainer',
            23: 'JesterTrainer',
            24: 'RogueTrainer',
            25: 'GeneralistTrainer',
            26: 'Boss',
            27: 'Chest',
            28: 'PurpleTeleport',
            29: 'RedTeleport',
            30: 'YellowTeleport',
            31: 'GreenTeleport',
            32: 'BlueTeleport',
            33: 'Cloud',
            34: 'Wood',
            35: 'Hole',
            36: 'Gravel',
            37: 'Mushroom',
            38: 'StoneWall',
            39: 'Box',
            40: 'LadderUp',
            41: 'LadderDown',
            42: 'RopeUp',
            43: 'RopeDown',
            44: 'Table',
            45: 'Pot',
            46: 'Barrel',
            47: 'Bed',
            48: 'Sign',
            49: 'Carpet',
            50: 'CrumblingBrick',
            51: 'Skeleton',
            52: 'Snow',
            53: 'Fence',
            54: 'Dead Tree',
            55: 'Palm Tree',
            56: 'Cactus',
            57: 'Pillar',
            58: 'StoneDoor',
            59: 'Chair',
            60: 'GoldPile',
            61: 'Bloodstain',
            62: 'FenceGate',
            63: 'Glowcloud',
            64: 'ArcherTrainer',
            65: 'PirateTrainer',
            66: 'MagicalMonsterTrainer',
            67: 'MonsterTrainer',
            68: 'BarbarianTrainer',
            69: 'BardTrainer',
            70: 'SandwichArtistTrainer',
            71: 'NecromancerTrainer',
            72: 'BitomancerTrainer',
            73: 'NotABear',
            74: 'AstronomicalEntity',
            75: 'TownCrier',
            76: 'LootSack',
            77: 'LootSackWithSword',
            78: 'EmptyLootSack',
            79: 'Tombstone',
            80: 'Astral',
            81: 'NightSky',
            82: 'Acid',
            83: 'TreeStump',
            84: 'AntiShrine',
            85: 'Shrine',
            86: 'Merchant',
            87: 'JailDoor',
            88: 'StoneJailDoor',
            89: 'BlueFighter',
            90: 'RedFighter',
            91: 'GreenFighter',
            92: 'GoldFighter',
            93: 'BlueMage',
            94: 'RedMage',
            95: 'GreenMage',
            96: 'GoldMage',
            97: 'BlueCleric',
            98: 'RedCleric',
            99: 'GreenCleric',
            100: 'GoldCleric',
            101: 'BlueJester',
            102: 'RedJester',
            103: 'GreenJester',
            104: 'GoldJester',
            105: 'BlueRogue',
            106: 'RedRogue',
            107: 'GreenRogue',
            108: 'GoldRogue',
            109: 'BlueGeneralist',
            110: 'RedGeneralist',
            111: 'GreenGeneralist',
            112: 'GoldGeneralist',
            113: 'BlueArcher',
            114: 'RedArcher',
            115: 'GreenArcher',
            116: 'GoldArcher',
            117: 'BluePirate',
            118: 'RedPirate',
            119: 'GreenPirate',
            120: 'GoldPirate',
            121: 'BlueMagicalMonster',
            122: 'RedMagicalMonster',
            123: 'GreenMagicalMonster',
            124: 'GoldMagicalMonster',
            125: 'BlueMonster',
            126: 'RedMonster',
            127: 'GreenMonster',
            128: 'GoldMonster',
            129: 'BlueBarbarian',
            130: 'RedBarbarian',
            131: 'GreenBarbarian',
            132: 'GoldBarbarian',
            133: 'BlueBard',
            134: 'RedBard',
            135: 'GreenBard',
            136: 'GoldBard',
            137: 'BlueSandwichArtist',
            138: 'RedSandwichArtist',
            139: 'GreenSandwichArtist',
            140: 'GoldSandwichArtist',
            141: 'BlueNecromancer',
            142: 'RedNecromancer',
            143: 'GreenNecromancer',
            144: 'GoldNecromancer',
            145: 'BlueBitomancer',
            146: 'RedBitomancer',
            147: 'GreenBitomancer',
            149: 'GoldBitomancer',
            150: 'GambleShrine',
            151: 'GreenBoss',
            152: 'BlueBoss',
            153: 'GoldBoss',
            154: 'GreenMale',
            155: 'RedFemale',
            156: 'VeteranBear',
            157: 'VeteranGlowcloud',
            158: 'Soap',
            159: 'RuinedTombstone',
            160: 'Armoire',
            161: 'Bookcase',
            162: 'Bookshelf',
            163: 'HangingSign'
        };
        this.revGidMap = {};
        this.allTeleports = _(teleports)
            .values()
            .map(entry => _.map(entry, (loc, key) => {
            loc.name = key;
            return loc;
        }))
            .flattenDeep()
            .value();
        this.revGidMap = _.invert(this.gidMap);
    }
    locToTeleport(name) {
        return _.find(this.allTeleports, { name });
    }
}
exports.SETTINGS = new Settings();
