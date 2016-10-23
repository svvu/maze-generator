import Grid from './grid';
import BlockValidator from './block-validator';
import Stringifier from './stringifier';
import {oppositeDirection, shuffleDirections} from './directions';

class Maze extends Grid {
  // Use to export the direction helper functions.
  static directions () {
    return {
      oppositeDirection: oppositeDirection,
      shuffleDirections: shuffleDirections
    };
  }

  constructor ({width = 1, height = 1, pathWidth = 1, pathHeight = 1} = {}) {
    super(width, height);

    this.pathWidth = parseInt(pathWidth, 10) || 1;
    this.pathHeight = parseInt(pathHeight, 10) || 1;
    this.validator = new BlockValidator(this);
  }

  // Check whether or not a block is valid base on the configuration.
  // Default is in the grid and has all the walls.
  isValidBlock (x, y) {
    return this.validator.unCave(x, y);
  }

  // Convert the maze to a string which can be used to print the maze.
  toString () {
    return new Stringifier(this).stringify();
  }
}

export default Maze;
