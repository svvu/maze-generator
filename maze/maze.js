import Grid from './grid';
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

  constructor (
    {
      width = 1, height = 1, pathWidth = 1, pathHeight = 1,
      braided = false, weave = false
    } = {}
  ) {
    super(width, height);

    this.pathWidth = parseInt(pathWidth, 10) || 1;
    this.pathHeight = parseInt(pathHeight, 10) || 1;
    this.braided = braided;
    this.weave = weave;
  }

  // Check whether or not a block is valid.
  isValidBlock (x, y) {
    return this.isBlockInGrid(x, y);
  }

  // Set the carve direction for the block.
  setCarvedDirection (x, y, direction) {
    this.blocks[y][x] |= direction;
  }

  // Check whether or not the current block is dead end.
  // If there's only one path to the current block, then its a dead end.
  isDeadEnd (x, y) {
    return this.getWallsForBlock(x, y).length >= 3;
  }

  // Check whether or not the current block has wall in the direction.
  hasWallInDirection (x, y, direction) {
    return !(this.getBlockValue(x, y) & direction);
  }

  // Convert the maze to a string which can be used to print the maze.
  toString () {
    return new Stringifier(this).stringify();
  }
}

export default Maze;
