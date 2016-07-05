
import _ from 'lodash';

import { AdventureLog, MessageTypes } from '../shared/adventure-log';
import { GameState } from './game-state';
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';
import { AllPlayers, PlayerLogin, PlayerLogout, PlayerUpdateAll } from '../shared/playerlist-updater';

PlayerEmitter.on('player:login', async ({ playerName }) => {
  const player = await GameState.getInstance().addPlayer(playerName);
  if(!player) return;
  player.update();
  player.$statistics.incrementStat('Game.Logins');
  AllPlayers(playerName);
  PlayerLogin(playerName);
  AdventureLog({
    text: `Welcome ${player.name} back to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
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
    text: `Welcome ${player.name} to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:logout', ({ playerName }) => {
  PlayerLogout(playerName);
  AdventureLog({
    text: `${playerName} has departed Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: playerName }]
  });
  GameState.getInstance().delPlayer(playerName);
});

// TODO title

PlayerEmitter.on('player:levelup', ({ player }) => {
  PlayerUpdateAll(player.name, ['name', 'level']);
  AdventureLog({
    text: `${player.fullname} has reached experience level ${player.level}!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.fullname }]
  });
});

PlayerEmitter.on('player:changeclass', ({ player, choice }) => {
  PlayerUpdateAll(player.name, ['name', 'professionName']);
  AdventureLog({
    text: `${player.fullname} has met with ${choice.extraData.trainerName} and became a ${choice.extraData.professionName}!`,
    type: MessageTypes.SINGLE,
    targets: [player.name],
    highlights: [{ name: player.fullname }]
  });
});

PlayerEmitter.on('player:transfer', ({ player, dest }) => {
  PlayerUpdateAll(player.name, ['name', 'map']);

  let message = '';
  switch(dest.movementType) {
    case 'ascend':    message = `${player.fullname} has ascended to ${dest.destName}.`; break;
    case 'descend':   message = `${player.fullname} has descended to ${dest.destName}.`; break;
    case 'fall':      message = `${player.fullname} has fallen to ${dest.destName} from ${dest.fromName}.`; break;
    case 'teleport':  message = `${player.fullname} has been teleported to ${dest.destName} from ${dest.fromName}.`; break;
  }

  if(dest.customMessage) {
    message = dest.customMessage.split('%playerName').join(player.fullname).split('%destName').join(dest.destName);
  }

  AdventureLog({
    text: message,
    type: MessageTypes.SINGLE,
    targets: [player.name],
    highlights: [{ name: player.name }]
  });

});

PlayerEmitter.on('player:event', ({ affected, eventText }) => {
  AdventureLog({
    text: eventText,
    type: MessageTypes.SINGLE,
    targets: _.map(affected, 'name'),
    highlights: _.map(affected, p => ({ name: p.name }))
  });
});