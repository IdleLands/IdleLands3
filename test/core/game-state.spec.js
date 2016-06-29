
import test from 'ava';
import actualConstitute from 'constitute';
import _ from 'lodash';
import { setConstituteContainer } from '../../src/shared/di-wrapper';

import { PlayerLoad } from '../../src/plugins/players/player.load';
import { GameState } from '../../src/core/game-state';
import { World } from '../../src/core/world/world';

class MockPlayerLoad {
  constructor() {
    this.existingPlayers = ['Johnson', 'Morrison', 'Katey'];
  }

  loadPlayer(playerName) {
    if(_.indexOf(this.existingPlayers, playerName) != -1) {
      return { name: playerName, save() {} };
    }
    return null;
  }
}

class MockWorld {

}

test.before(() => {
  const container = new actualConstitute.Container();
  container.bindClass(PlayerLoad, MockPlayerLoad);
  container.bindClass(World, MockWorld);

  setConstituteContainer(container);
});

test.serial('game-state should have proper initial state', t => {
  const gameState = GameState.getInstance();
  t.plan(3);

  t.is(gameState.getPlayers().length, 0);
  t.is(gameState.playerLoad instanceof MockPlayerLoad, true);
  t.is(gameState.world instanceof MockWorld, true);
});

test.serial('should be able to retrieve players from state', t => {
  t.plan(3);
  const gameState = GameState.getInstance();
  gameState.players = [];

  return new Promise((resolve) => {
    gameState.addPlayer('Johnson').then((player) => {
      t.is(gameState.players.length, 1);
      t.is(player.name, 'Johnson');
      t.is(gameState.getPlayer('Johnson').name, 'Johnson')
      resolve();
    });
  });
});

test.serial('should not be able to add the same player', t => {
  t.plan(5);
  const gameState = GameState.getInstance();
  gameState.players = [];

  return new Promise((resolve, reject) => {
    gameState.addPlayer('Johnson').then((player) => {
      t.is(gameState.players.length, 1);
      t.is(player.name, 'Johnson');
      t.not(player, false);

      gameState.addPlayer('Johnson').then((player2) => {
        t.is(gameState.players.length, 1);
        t.is(player2, false);
        resolve();
      });

    }).catch((e) => {
      console.log(e);
      reject();
    });
  });
});

test.serial('should not be able to add non-existing player', t => {
  t.plan(2);
  const gameState = GameState.getInstance();
  gameState.players = [];

  return new Promise((resolve) => {
    gameState.addPlayer('Emily').then(() => {
      t.fail();
      resolve();
    }).catch((e) => {
      t.is(gameState.players.length, 0);
      t.is(e.msg.type, 'error');
      resolve();
    });
  });
});

test.serial('should be able to delete player', t => {
  t.plan(4);
  const gameState = GameState.getInstance();
  gameState.players = [];

  return new Promise((resolve) => {
    gameState.addPlayer('Johnson').then((player) => {
      t.is(gameState.players.length, 1);
      t.is(player.name, 'Johnson');
      t.not(player, false);

      gameState.delPlayer('Johnson');
      t.is(gameState.players.length, 0);

      resolve();
    }).catch((e) => {
      console.log(e);
      t.fail();
      resolve();
    });
  });
});

