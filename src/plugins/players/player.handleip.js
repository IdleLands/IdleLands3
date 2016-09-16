
import _ from 'lodash';

import { GameState } from '../../core/game-state';

export const handleIp = (player, fromIp) => {
  if(!player.allIps) player.allIps = [];
  if(!_.includes(player.allIps, fromIp)) player.allIps.push(fromIp);
  player.allIps = _.compact(_.uniq(player.allIps));

  player.$currentIp = fromIp;
  if(player.isPardoned) return;

  const playerLoad = GameState.getInstance().playerLoad;
  playerLoad.playerDb.getOffenses(fromIp).then(offenses => {
    if(!offenses) return;

    player.isMuted = true;
    player.save();
  });
};