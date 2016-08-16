
import { Personality } from '../personality';

export class SharpEye extends Personality {
  static description = 'You can more easily discern valuable equipment.';

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Item.Equip') >= 25;
  }
}