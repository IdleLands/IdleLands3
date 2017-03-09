
import * as _ from 'lodash';

export const migrate = (player) => {
  const choiceMigrate = _.get(player.$statistics.stats, 'Character.Choice.Choose');
  if(!_.isObject(choiceMigrate)) {
    _.set(player.$statistics.stats, 'Character.Choice.Choose', {});
  }

  const profMigrate = _.get(player.$statistics.stats, 'Character.Professions');
  if(!_.isObject(profMigrate)) {
    _.set(player.$statistics.stats, 'Character.Professions', {});
  }
};