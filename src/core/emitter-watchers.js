
import _ from 'lodash';

import { AdventureLog, MessageTypes, MessageCategories } from '../shared/adventure-log';
import { GameState } from './game-state';
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';
import { migrate } from '../plugins/players/player.migration';
import { AllPlayers, PlayerLogin, PlayerLogout, PlayerUpdateAll } from '../shared/playerlist-updater';
import { MessageParser } from '../plugins/events/messagecreator';

PlayerEmitter.on('player:login', async ({ playerName }) => {
  const player = await GameState.getInstance().addPlayer(playerName);
  if(!player) return;
  migrate(player);
  player.update();
  player.$statistics.incrementStat('Game.Logins');
  AllPlayers(playerName);
  PlayerLogin(playerName);
  AdventureLog({
    text: MessageParser.stringFormat('Welcome %player back to Idliathlia!', player),
    type: MessageTypes.GLOBAL,
    category: MessageCategories.META
  });
});

PlayerEmitter.on('player:register', async ({ playerName }) => {
  const player = await GameState.getInstance().addPlayer(playerName);
  if(!player) return;
  player.update();
  player.$statistics.incrementStat('Game.Logins');
  AllPlayers(playerName);
  PlayerLogin(playerName);
  AdventureLog({
    text: MessageParser.stringFormat('Welcome %player to Idliathlia!', player),
    type: MessageTypes.GLOBAL,
    category: MessageCategories.META
  });
});

PlayerEmitter.on('player:logout', ({ playerName }) => {
  PlayerLogout(playerName);
  AdventureLog({
    text: `«${playerName}» has departed Idliathlia!`,
    type: MessageTypes.GLOBAL,
    category: MessageCategories.META
  });
  GameState.getInstance().delPlayer(playerName);
});

PlayerEmitter.on('player:levelup', ({ player }) => {
  PlayerUpdateAll(player.name, ['name', 'level']);
  AdventureLog({
    text: MessageParser.stringFormat(`%player has reached experience level ${player.level}!`, player),
    type: MessageTypes.SINGLE,
    category: MessageCategories.LEVELUP,
    targets: [player.name]
  });
});

PlayerEmitter.on('player:changegender', ({ player }) => {
  PlayerUpdateAll(player.name, ['name', 'gender']);
  player.update();
});

PlayerEmitter.on('player:changetitle', ({ player }) => {
  PlayerUpdateAll(player.name, ['name', 'title']);
  player.update();
});

PlayerEmitter.on('player:achieve', ({ player, achievements }) => {
  player.recalculateStats();
  _.each(achievements, achievement => {
    AdventureLog({
      text: MessageParser.stringFormat(`%player has achieved ${achievement.name} ${achievement.tier > 1 ? `tier ${achievement.tier}` : ''}!`, player),
      type: MessageTypes.SINGLE,
      category: MessageCategories.ACHIEVEMENT,
      targets: [player.name]
    });
  });
});

PlayerEmitter.on('player:changeclass', ({ player, choice }) => {
  PlayerUpdateAll(player.name, ['name', 'professionName']);
  AdventureLog({
    text: MessageParser.stringFormat(`%player has met with ${choice.extraData.trainerName} and became a ${choice.extraData.professionName}!`, player),
    type: MessageTypes.SINGLE,
    category: MessageCategories.PROFESSION,
    targets: [player.name]
  });
});

PlayerEmitter.on('player:transfer', ({ player, dest }) => {
  PlayerUpdateAll(player.name, ['name', 'map']);

  let message = '';
  switch(dest.movementType) {
    case 'ascend':    message = `%player has ascended to ${dest.destName}.`; break;
    case 'descend':   message = `%player has descended to ${dest.destName}.`; break;
    case 'fall':      message = `%player has fallen to ${dest.destName} from ${dest.fromName}.`; break;
    case 'teleport':  message = `%player has been teleported to ${dest.destName} from ${dest.fromName}.`; break;
  }

  if(dest.customMessage) {
    message = dest.customMessage.split('%playerName').join(player.fullname).split('%destName').join(dest.destName);
  }

  AdventureLog({
    text: MessageParser.stringFormat(message, player),
    type: MessageTypes.SINGLE,
    category: MessageCategories.EXPLORE,
    targets: [player.name]
  });

});

PlayerEmitter.on('player:event', ({ affected, category, eventText }) => {
  AdventureLog({
    text: eventText,
    type: MessageTypes.SINGLE,
    category,
    targets: _.map(affected, 'name')
  });
});