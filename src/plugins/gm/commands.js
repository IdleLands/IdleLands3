
import { EventHandler } from '../events/eventhandler';
import { FindItem } from '../events/events/FindItem';
import { GameState } from '../../core/game-state';

import { emitter } from '../../plugins/players/_emitter';

import { PlayerUpdateAll } from '../../shared/playerlist-updater';

import { TeleportRedis, ToggleModRedis, ToggleAchievementRedis,
         SetLevelRedis, GiveItemRedis, GiveEventRedis,
         BanRedis, MuteRedis, PardonRedis,
         GiveGoldRedis, GiveILPRedis
} from '../scaler/redis';

export class GMCommands {

  static ban(playerName, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return BanRedis(playerName);

    player.isBanned = true;
    player._saveSelf();

    emitter.emit('player:logout', { playerName: player.name });
  }

  static mute(playerName, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return MuteRedis(playerName);

    player.isMuted = !player.isMuted;
    if(player.isMuted && player.isPardoned) player.isPardoned = false;

    player._saveSelf();

    PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
  }

  static pardon(playerName, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return PardonRedis(playerName);

    player.isPardoned = !player.isPardoned;
    if(player.isPardoned && player.isMuted) player.isMuted = false;

    PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
  }

  static teleport(playerName, { map, x, y, toLoc }, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return TeleportRedis(playerName, { map, x, y, toLoc });

    const tileData = {
      object: {
        properties: {
          destx: x,
          desty: y,
          movementType: 'teleport',
          map,
          toLoc
        }
      }
    };

    player.$playerMovement.handleTileTeleport(player, tileData, true);
    const tile = player.$playerMovement.getTileAt(player.map, player.x, player.y);
    player.$playerMovement.handleTile(player, tile);
  }

  static toggleMod(playerName, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return ToggleModRedis(playerName);

    player.isMod = !player.isMod;
    player._saveSelf();
  }

  static toggleAchievement(playerName, achievement, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return ToggleAchievementRedis(playerName, achievement);

    player.permanentAchievements = player.permanentAchievements || {};
    player.permanentAchievements[achievement] = !player.permanentAchievements[achievement];
    player._checkAchievements();
    player._save();
  }

  static setLevel(playerName, level, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return SetLevelRedis(playerName, level);

    player._level.set(level - 1);
    player.levelUp();
  }

  static giveEvent(playerName, event, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return GiveItemRedis(playerName, event);

    EventHandler.doEvent(player, event);
  }

  static giveItem(playerName, item, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return GiveEventRedis(playerName, item);

    FindItem.operateOn(player, null, item);
  }

  static giveGold(playerName, gold, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return GiveGoldRedis(playerName, gold);

    player.gold += gold;
  }

  static giveILP(playerName, ilp, propagate = true) {
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player && propagate) return GiveILPRedis(playerName, ilp);

    player.$premium.addIlp(ilp);
    player._updatePremium();
  }

  static createFestival(festival) {
    GameState.getInstance().addFestival(festival);
  }

  static cancelFestival(festivalId) {
    GameState.getInstance().cancelFestival(festivalId);
  }
}