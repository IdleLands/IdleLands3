import test from 'ava';
import { Character } from '../../../src/core/base/character';

test('Character opts should be copied', t => {
  const c = new Character();
  c.init({ name: 'Mr so and so', _hp: { minimum: 0, maximum: 5, __current: 5 } });
  t.is(c.name, 'Mr so and so');
  t.is(c.hp, 5);
});

test('Character name cannot be empty', t => {
  const c = new Character();
  t.throws(c.init);
});