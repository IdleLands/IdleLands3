
export class Achievement {
  static achievementData() {}
  static log(base, number) {
    return Math.log(number) / Math.log(base);
  }
}

export const AchievementTypes = {
  PROGRESS: 'Progress',
  EXPLORE: 'Explore',
  COMBAT: 'Combat',
  SPECIAL: 'Special',
  EVENT: 'Event',
  PET: 'Pet'
};