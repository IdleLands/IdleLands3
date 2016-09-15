
import _ from 'lodash';

export const handleIp = (player, fromIp) => {
  if(!player.allIps) player.allIps = [];
  if(!_.includes(player.allIps, fromIp)) player.allIps.push(fromIp);

  player.$currentIp = fromIp;
};