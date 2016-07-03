
require('babel-register');
const ItemGenerator = require('../../src/shared/item-generator').ItemGenerator;

for(let i = 0; i < 100; i++) {
  console.log(ItemGenerator.generateItem());
}