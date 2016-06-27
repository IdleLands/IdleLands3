import test from 'ava';
import constitute from 'constitute';

import { Player } from '../../../src/plugins/players/player';
import { PlayerDb } from '../../../src/plugins/players/player.db';
import { Statistics } from '../../../src/plugins/statistics/statistics';
import { PlayerMovement } from '../../../src/plugins/players/player.movement';

class MockStatistics {
  incrementStat() {
  }

  batchIncrement() {

  }
}

class MockDatabase {

}

class MockPlayerMovement {
  canEnterTile() {
    return true;
  }

  pickRandomTile(player) {
    return [PlayerMovement.num2dir(1, player.x, player.y), 1];
  }

  getTileAt() {
    return {
      terrain: 'Void',
      blocked: false,
      blocker: 0,
      region: 'Wilderness',
      object: {}
    };
  }

  handleTile() {

  }
}

test.beforeEach(t => {
  const container = new constitute.Container();
  container.bindClass(PlayerDb, MockDatabase);
  container.bindClass(Statistics, MockStatistics);

  t.context.container = container;
});

test('Xp gain should level up', t => {
  const p = t.context.container.constitute(Player);
  p.init({ name: 'Mr so and so' });
  p.$statistics = new MockStatistics();
  t.is(p.level, 1);
  p._xp.toMaximum();
  p.gainXp();
  t.is(p.level, 2);
  t.is(p.xp, 0);
});

test('Movement should move player', t => {
  const p = t.context.container.constitute(Player);
  p.init({ name: 'Mr so and so' });
  p.$PlayerMovement = new MockPlayerMovement();
  p.$statistics = new MockStatistics();
  t.is(p.x, 10);
  t.is(p.y, 10);
  p.moveAction();
  t.is(p.x, 9);
  t.is(p.y, 9);
});