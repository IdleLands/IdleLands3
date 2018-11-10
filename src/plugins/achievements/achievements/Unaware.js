
import { Achievement, AchievementTypes } from '../achievement';

export class Unaware extends Achievement {
  static achievementData(player) {

    const totalfalls = player.$statistics.getStat('Character.Movement.Fall');

    if(totalCamps < 250) return [];

    const baseReward = {
      tier: 1,
      name: 'Unaware',
      desc: `Gain a special title for falling into ${(250).toLocaleString()} holes.`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Unaware'
      }, {
        type: 'petattr',
        petattr: 'a portable hole'
      }
    };

    if(totalFalls >= 500) {
      baseReward.rewards.push({
        type: 'title',
        title: 'Clumsy',
        tier: 2,
        desc: `Gain a second title for falling into ${(500).toLocaleString()} holes.`,
        deathMessage: '%player took a long fall down a deep hole.'
      });
    }

    return [baseReward];
  }
}
