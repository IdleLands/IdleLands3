
import _ from 'lodash';

import NRP from 'node-redis-pubsub';

import { GameState } from '../../core/game-state';
import { PlayerLoginData, PlayerLogoutData, PlayerUpdateAllData } from '../../shared/playerlist-updater';
import { sendMessage } from '../chat/sendmessage';

const redisUrl = process.env.REDIS_URL;

const redisInstance = redisUrl ? new NRP({
  url: redisUrl
}) : null;

const innerRedisClient = redisInstance ? redisInstance.getRedisClient() : null;

const cleanRedis = () => {
  if(!innerRedisClient) return;
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
    if(GameState.getInstance().hasPlayer(playerName)) return;
    PlayerLoginData(playerName, data);
    otherPlayers.push(data);
  });

  redisInstance.on('player:update', ({ data }) => {
    PlayerUpdateAllData(data);
    _.merge(_.find(otherPlayers, { name: data.name }), data);
  });

  redisInstance.on('chat:send', ({ message }) => {
    if(GameState.getInstance().hasPlayer(message.realPlayerName)) return;
    sendMessage(message);
  });

  redisInstance.on('festival:add', ({ festival }) => {
    GameState.getInstance().addFestivalData(festival);
  });

  redisInstance.on('festival:cancel', ({ festivalId }) => {
    GameState.getInstance().cancelFestivalData(festivalId);
  });
}

const firstNodePromise = new Promise((resolve) => {
  // no redis = yes, this is client #1
  if(!redisInstance) return resolve(true);

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

export const SendChatMessage = (message) => {
  if(!redisInstance) return;
  redisInstance.emit('chat:send', { message });
};

export const AddFestivalRedis = (festival) => {
  if(!redisInstance) return;
  redisInstance.emit('festival:add', { festival });
};

export const CancelFestivalRedis = (festivalId) => {
  if(!redisInstance) return;
  redisInstance.emit('festival:cancel', { festivalId });
};