
import _ from 'lodash';

import NRP from 'node-redis-pubsub';

import { GameState } from '../../core/game-state';
import { PlayerLoginData, PlayerLogoutData, PlayerUpdateAllData, SomePlayersPostMoveData } from '../../shared/playerlist-updater';
import { sendMessage } from '../chat/sendmessage';
import { GMCommands } from '../gm/commands';

const redisUrl = process.env.REDIS_URL;

const redisInstance = redisUrl ? new NRP({
  url: redisUrl
}) : null;

const innerRedisClient = redisInstance ? redisInstance.getRedisClient() : null;

const cleanRedis = () => {
  if(!innerRedisClient || _.isNumber(process.env.INSTANCE_NUMBER)) return;
  innerRedisClient.del('IsFirst', () => {
    process.exit();
  });
};

process.on('exit', cleanRedis);
process.on('SIGINT', cleanRedis);
process.on('SIGTERM', cleanRedis);

let otherPlayers = [];

if(redisInstance) {
  redisInstance.on('player:logout', ({ playerName }) => {
    PlayerLogoutData(playerName);
    otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
  });

  redisInstance.on('player:login', ({ playerName, data }) => {
    if(GameState.getInstance().getPlayer(playerName)) return;
    PlayerLoginData(playerName, data);
    otherPlayers.push(data);
  });

  redisInstance.on('player:update', ({ data }) => {
    PlayerUpdateAllData(data);
    _.merge(_.find(otherPlayers, { name: data.name }), data);
  });

  redisInstance.on('global:move', ({ data }) => {
    SomePlayersPostMoveData(data);
  });

  redisInstance.on('chat:send', ({ message, isExternal }) => {
    if(GameState.getInstance().getPlayer(message.realPlayerName)) return;
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

const firstNodePromise = new Promise((resolve) => {
  // no redis = yes, this is client #1
  if(!redisInstance) return resolve(true);

  // deployed on clever-cloud
  if(_.isNumber(process.env.INSTANCE_NUMBER)) {
    return process.env.INSTANCE_NUMBER === 0 ? resolve(true) : resolve(false);
  }

  // do logic
  innerRedisClient.get('IsFirst', (e, hasFirst) => {
    if(hasFirst) return resolve(false);

    innerRedisClient.set('IsFirst', '1', () => {
      resolve(true);
    });
  });
});

export const IsFirstNode = () => {
  return firstNodePromise;
};

export const GetRedisPlayers = () => {
  return otherPlayers;
};

export const PlayerLogoutRedis = (playerName) => {
  if(!redisInstance) return;
  redisInstance.emit('player:logout', { playerName });
};

export const PlayerLoginRedis = (playerName, data) => {
  if(!redisInstance) return;
  redisInstance.emit('player:login', { playerName, data });
};

export const PlayerUpdateAllRedis = (data) => {
  if(!redisInstance) return;
  redisInstance.emit('player:update', { data });
};

export const SomePlayersPostMoveRedis = (data) => {
  if(!redisInstance) return;
  redisInstance.emit('global:move', { data });
};

export const SendChatMessage = (message, isExternal) => {
  if(!redisInstance) {
    if(isExternal) {
      sendMessage(message, isExternal);
    }
    return;
  }
  redisInstance.emit('chat:send', { message, isExternal });
};

export const AddFestivalRedis = (festival) => {
  if(!redisInstance) return;
  redisInstance.emit('festival:add', { festival });
};

export const CancelFestivalRedis = (festivalId) => {
  if(!redisInstance) return;
  redisInstance.emit('festival:cancel', { festivalId });
};

export const TeleportRedis = (playerName, opts) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:teleport', { playerName, opts });
};

export const ToggleModRedis = (playerName) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:togglemod', { playerName });
};

export const ToggleAchievementRedis = (playerName, achievement) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:toggleachievement', { playerName, achievement });
};

export const SetLevelRedis = (playerName, level) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:setlevel', { playerName, level });
};

export const GiveItemRedis = (playerName, item) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:giveitem', { playerName, item });
};

export const GiveEventRedis = (playerName, event) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:giveevent', { playerName, event });
};

export const GiveGoldRedis = (playerName, gold) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:givegold', { playerName, gold });
};

export const GiveILPRedis = (playerName, ilp) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:giveilp', { playerName, ilp });
};

export const BanRedis = (playerName) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:ban', { playerName });
};

export const MuteRedis = (playerName) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:mute', { playerName });
};

export const PardonRedis = (playerName) => {
  if(!redisInstance) return;
  redisInstance.emit('gm:pardon', { playerName });
};