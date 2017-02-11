require('babel-core/register');

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const Maze = require('./maze/maze.js').default;
const RecursiveBacktracking = require('./generate_algorithms/recursive-backtracking.js').default;

const optionDefinitions = [
  { name: 'help', type: Boolean, defaultValue: false },
  { name: 'width', alias: 'w', type: Number, defaultValue: 10 },
  { name: 'height', alias: 'h', type: Number, defaultValue: 10 },
  { name: 'pathWidth', type: Number, defaultValue: 1 },
  { name: 'pathHeight', type: Number, defaultValue: 1 },
  { name: 'braided', alias: 'b', type: Boolean, defaultValue: false }
];

const optionsDef = [
  {
    header: 'A typical app',
    content: 'Generates a maze with pass in options.'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        description: 'Print this options list.'
      },
      {
        name: 'width',
        type: Number,
        alias: 'w',
        description: 'The width (vertical path) of the maze.'
      },
      {
        name: 'height',
        type: Number,
        alias: 'h',
        description: 'The height (horizontal path) of the maze.'
      },
      {
        name: 'pathWidth',
        type: Number,
        description: 'The width of the path for the maze.'
      },
      {
        name: 'pathHeight',
        type: Number,
        description: 'The height of the path for the maze.'
      },
      {
        name: 'braided',
        type: Boolean,
        alias: 'b',
        description: 'The maze generated is braided (no dead end) or not.'
      }
    ]
  }
];

function main () {
  let options = commandLineArgs(optionDefinitions);

  if (options.help) {
    console.log(commandLineUsage(optionsDef));
    return;
  }

  if (isNaN(options.width) || options.width <= 0) {
    console.log('Invalid width');
    return;
  }
  if (isNaN(options.height) || options.height <= 0) {
    console.log('Invalid height');
    return;
  }

  if (isNaN(options.pathWidth) || options.pathWidth <= 0) {
    console.log('Invalid path width');
    return;
  }
  if (isNaN(options.pathHeight) || options.pathHeight <= 0) {
    console.log('Invalid path height');
    return;
  }

  let maze = new Maze(options);
  let rb = new RecursiveBacktracking(maze);
  rb.carve(0, 0);
  console.log(maze.toString());
}

main();
