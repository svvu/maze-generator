require('babel-core/register');
const Grid = require('./grid.js').default;
const RecursiveBacktracking = require('./recursive-backtracking.js').default;

function main () {
  let width = process.argv[2] || 10;
  let height = process.argv[3] || 10;
  let errMsg = 'please provide valid number by "node maze-generator.js width height"';
  if (isNaN(width)) {
    console.log(`Invalid width, ${errMsg}`);
    return;
  }
  if (isNaN(height)) {
    console.log(`Invalid height, ${errMsg}`);
    return;
  }

  let grid = new Grid(width, height);
  RecursiveBacktracking.carveBlock(grid, 0, 0);
  console.log(grid.toString());
}

main();
