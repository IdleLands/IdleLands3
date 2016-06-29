
import test from 'ava';

import { PlayerMovement } from '../../../src/plugins/players/player.movement';

class MockTile {
  constructor(blocked, terrain) {
    this.blocked = blocked;
    this.terrain = terrain;
  }
}

test('Blocked tile should not be enter-able', t => {
  let tile = new MockTile(true, 'grass');
  t.is(PlayerMovement.canEnterTile({}, tile), false);

  tile = new MockTile(false, 'Void');
  t.is(PlayerMovement.canEnterTile({}, tile), false);

  tile = new MockTile(false, 'Grass');
  t.is(PlayerMovement.canEnterTile({}, tile), true);
});

