require('babel-core/register');
const Maze = require('./maze/maze.js').default;
const RecursiveBacktracking = require('./generate_algorithms/recursive-backtracking.js').default;

function main () {
  let width = process.argv[2] || 10;
  let height = process.argv[3] || 10;
  let pathWidth = process.argv[4] || 1;
  let pathHeight = process.argv[5] || 1;

  let errMsg = 'please provide valid number by "node maze-generator.js width height pathWidth pathHeight"';
  if (isNaN(width) || width <= 0) {
    console.log(`Invalid width, ${errMsg}`);
    return;
  }
  if (isNaN(height) || height <= 0) {
    console.log(`Invalid height, ${errMsg}`);
    return;
  }

  if (isNaN(pathWidth) || pathWidth <= 0) {
    console.log(`Invalid path width, ${errMsg}`);
    return;
  }
  if (isNaN(pathHeight) || pathHeight <= 0) {
    console.log(`Invalid path height, ${errMsg}`);
    return;
  }

  let maze = new Maze({
    width: width,
    height: height,
    pathWidth: pathWidth,
    pathHeight: pathHeight
  });
  let rb = new RecursiveBacktracking(maze);
  rb.carve(0, 0);
  console.log(maze.toString());
}

main();
