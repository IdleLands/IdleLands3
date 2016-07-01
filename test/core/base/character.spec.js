import test from 'ava';
import { Character } from '../../../src/core/base/character';
import { Generalist } from '../../../src/core/professions/Generalist';

test('Character base stats are correct', t => {
  const c = new Character();
  c.init({ name: 'Mr so and so' });
  t.is(c.level, 1);
  t.is(c.liveStats.str, Generalist.baseStrPerLevel * c.level);
  t.is(c.mp, (Generalist.baseMpPerLevel * c.level) + (Generalist.baseIntPerLevel * c.level * Generalist.baseMpPerInt));
  t.is(c.hp, (Generalist.baseHpPerLevel * c.level) + (Generalist.baseConPerLevel * c.level * Generalist.baseHpPerCon));
});

test('Character opts should be copied', t => {
  const c = new Character();
  c.init({ name: 'Mr so and so' });
  t.is(c.name, 'Mr so and so');
});

test('Character name cannot be empty', t => {
  const c = new Character();
  t.throws(c.init);
});