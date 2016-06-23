
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';

PlayerEmitter.on('player:login', player => {
  console.log(player, 'login');
});

PlayerEmitter.on('player:register', player => {
  console.log(player, 'register');
});