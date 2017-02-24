
import * as _ from 'lodash';

import * as NRP from 'node-redis-pubsub';
import * as nodeCleanup from 'node-cleanup';

import { GameState } from '../../core/game-state';
import { PlayerLoginData, PlayerLogoutData, PlayerUpdateAllData, SomePlayersPostMoveData } from '../../shared/playerlist-updater';
import { sendMessage } from '../chat/sendmessage';
import { GMCommands } from '../gm/commands';

import { primus } from '../../primus/server';
import { emitter } from '../../core/emitter-watchers';

const redisUrl = process.env.REDIS_URL;
const INSTANCE = _.isNaN(+process.env.INSTANCE_NUMBER) ? 0 : +process.env.INSTANCE_NUMBER;

const redisInstance = redisUrl ? new NRP({
  url: redisUrl
}) : null;

const _emit = (event, data = {}) => {
  if(!redisInstance) return;
  data._instance = INSTANCE;
  redisInstance.emit(event, data);
};

nodeCleanup(() => {
  _emit('server:forcekill');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
  return false;
});

let otherPlayers = [];

if(redisInstance) {

  console.log('Am instance ' + INSTANCE);

  redisInstance.on('server:forcekill', ({ _instance }) => {
    otherPlayers = _.reject(otherPlayers, p => p.$shard === _instance);
  });

  redisInstance.on('player:forcelogout', ({ playerName, _instance }) => {
    if(INSTANCE === _instance) return;
    console.log(`Redis ${INSTANCE} acting on forcelogout from ${_instance}`, playerName);
    primus.delPlayer(playerName);
    emitter.emit('player:logout', { playerName });

    PlayerLogoutData(playerName);
    otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
  });

  redisInstance.on('player:logout', ({ playerName, _instance }) => {
    if(INSTANCE === _instance) return;
    console.log(`Redis ${INSTANCE} acting on logout from ${_instance}`, playerName);
    PlayerLogoutData(playerName);
    otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
  });

  redisInstance.on('player:login', ({ playerName, data, _instance }) => {
    if(INSTANCE === _instance) return;
    console.log(`Redis ${INSTANCE} acting on login from ${_instance}`, playerName);
    PlayerLoginData(playerName, data);
    otherPlayers.push(data);
  });

  redisInstance.on('player:update', ({ data, _instance }) => {
    if(INSTANCE === _instance) return;
    PlayerUpdateAllData(data);
    _.merge(_.find(otherPlayers, { name: data.name }), data);
  });

  redisInstance.on('global:move', ({ data, _instance }) => {
    if(INSTANCE === _instance) return;
    SomePlayersPostMoveData(data);
  });

  redisInstance.on('chat:send', ({ message, isExternal, _instance }) => {
    if(INSTANCE === _instance && !isExternal) return;
    sendMessage(message, isExternal);
  });

  redisInstance.on('festival:add', ({ festival }) => {
    GameState.getInstance().addFestivalData(festival, false);
  });

  redisInstance.on('festival:cancel', ({ festivalId }) => {
    GameState.getInstance().cancelFestivalData(festivalId);
  });

  redisInstance.on('gm:teleport', ({ playerName, opts }) => {
    GMCommands.teleport(playerName, opts, false);
  });

  redisInstance.on('gm:togglemod', ({ playerName }) => {
    GMCommands.toggleMod(playerName, false);
  });

  redisInstance.on('gm:toggleachievement', ({ playerName, achievement }) => {
    GMCommands.toggleAchievement(playerName, achievement, false);
  });

  redisInstance.on('gm:setlevel', ({ playerName, level }) => {
    GMCommands.setLevel(playerName, level, false);
  });

  redisInstance.on('gm:giveitem', ({ playerName, item }) => {
    GMCommands.giveItem(playerName, item, false);
  });

  redisInstance.on('gm:giveevent', ({ playerName, event }) => {
    GMCommands.giveEvent(playerName, event, false);
  });

  redisInstance.on('gm:givegold', ({ playerName, gold }) => {
    GMCommands.giveGold(playerName, gold, false);
  });

  redisInstance.on('gm:giveilp', ({ playerName, ilp }) => {
    GMCommands.giveILP(playerName, ilp, false);
  });

  redisInstance.on('gm:ban', ({ playerName }) => {
    GMCommands.ban(playerName, false);
  });

  redisInstance.on('gm:mute', ({ playerName }) => {
    GMCommands.mute(playerName, false);
  });

  redisInstance.on('gm:pardon', ({ playerName }) => {
    GMCommands.pardon(playerName, false);
  });
}

export const GetRedisPlayers = () => {
  return otherPlayers;
};

export const PlayerForceLogout = (playerName) => {
  console.log(`Redis ${INSTANCE} emitting forcelogout`, playerName);
  _emit('player:forcelogout', { playerName });
};

export const PlayerLogoutRedis = (playerName) => {
  console.log(`Redis ${INSTANCE} emitting logout`, playerName);
  _emit('player:logout', { playerName });
};

export const PlayerLoginRedis = (playerName, data) => {
  console.log(`Redis ${INSTANCE} emitting login`, playerName);
  _emit('player:login', { playerName, data });
};

export const PlayerUpdateAllRedis = (data) => {
  _emit('player:update', { data });
};

export const SomePlayersPostMoveRedis = (data) => {
  _emit('global:move', { data });
};

export const SendChatMessage = (message, isExternal) => {
  if(!redisInstance) {
    if(isExternal) {
      sendMessage(message, isExternal);
    }
    return;
  }
  _emit('chat:send', { message, isExternal });
};

export const AddFestivalRedis = (festival) => {
  _emit('festival:add', { festival });
};

export const CancelFestivalRedis = (festivalId) => {
  _emit('festival:cancel', { festivalId });
};

export const TeleportRedis = (playerName, opts) => {
  _emit('gm:teleport', { playerName, opts });
};

export const ToggleModRedis = (playerName) => {
  _emit('gm:togglemod', { playerName });
};

export const ToggleAchievementRedis = (playerName, achievement) => {
  _emit('gm:toggleachievement', { playerName, achievement });
};

export const SetLevelRedis = (playerName, level) => {
  _emit('gm:setlevel', { playerName, level });
};

export const GiveItemRedis = (playerName, item) => {
  _emit('gm:giveitem', { playerName, item });
};

export const GiveEventRedis = (playerName, event) => {
  _emit('gm:giveevent', { playerName, event });
};

export const GiveGoldRedis = (playerName, gold) => {
  _emit('gm:givegold', { playerName, gold });
};

export const GiveILPRedis = (playerName, ilp) => {
  _emit('gm:giveilp', { playerName, ilp });
};

export const BanRedis = (playerName) => {
  _emit('gm:ban', { playerName });
};

export const MuteRedis = (playerName) => {
  _emit('gm:mute', { playerName });
};

export const PardonRedis = (playerName) => {
  _emit('gm:pardon', { playerName });
};