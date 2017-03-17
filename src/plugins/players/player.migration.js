
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

  const mapMigrate = _.get(player.$statistics.stats, 'Character.Maps');
  if(!_.isObject(mapMigrate)) {
    _.set(player.$statistics.stats, 'Character.Maps', {});
  }

  const regionMigrate = _.get(player.$statistics.stats, 'Character.Regions');
  if(!_.isObject(regionMigrate)) {
    _.set(player.$statistics.stats, 'Character.Regions', {});
  }

  const combats = player.$statistics.getStat('Combats');
  player.$statistics.setStat('Combat.Times', combats);

  const combatSolo = player.$statistics.getStat('CombatSolo');
  player.$statistics.setStat('Combat.TimesSolo', combatSolo);

};