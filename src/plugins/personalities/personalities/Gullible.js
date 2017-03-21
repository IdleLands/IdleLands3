
import { Personality } from '../personality';

export class Gullible extends Personality {
  static disableOnActivate = [
    'Affirmer', 'Bloodthirsty', 'Camping', 'Coward', 'Delver',
    'Denier', 'Drunk', 'Explorer', 'FeelingLucky', 'Greedy',
    'Gullible', 'Indecisive', 'ScaredOfTheDark', 'Seeker',
    'Sharpeye', 'Solo', 'Swapper', 'TreasureHunter'
  ];
  static description = 'Become the best form of yourself.';
  static stats = {};

  static hasEarned() {
    const date = new Date();
    return date.getUTCMonth() + 1 === 4 && date.getUTCDate() === 1;
  }
}