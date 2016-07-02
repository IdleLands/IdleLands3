
import _ from 'lodash';

class Settings {

  constructor() {
    this.timeframeSeconds = 10;
    this.maxLevel = 200;

    this.maxChoices = 10;

    this.chatMessageMaxLength = 500;

    this.externalChat = 'irc';

    this.chatConfig = {};
    this.chatConfig.irc = {
      server: 'irc.freenode.net',
      nick: 'idlelandschat',
      channel: '##idlebot'
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
      55: 'Palm Tree'
    };

    this.revGidMap = _.invert(this.gidMap);
  }
}

export const SETTINGS = new Settings();