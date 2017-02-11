import Maze from '../maze/maze';

const Directions = Maze.directions();

// A algorithm that carve the grid to create a maze.
class RecursiveBacktracking {
  constructor (maze) {
    this.maze = maze;
  }

  carve (cx, cy) {
    let maze = this.maze;

    // Randomize the directions to carve.
    let directions = Directions.shuffleDirections(
      maze.getWallsForBlock(cx, cy)
    );

    for (let direct of directions) {
      let nextBlock = this._getNextBlock(cx, cy, direct);

      if (nextBlock.validBlock) {
        let nx = nextBlock.x;
        let ny = nextBlock.y;

        // Break the wall to next block.
        maze.setCarvedDirection(cx, cy, direct);
        maze.setCarvedDirection(nx, ny, Directions.oppositeDirection(direct));
        // Whether or not should keeo going.
        if (nextBlock.canGoForward) {
          this.carve(nx, ny);
        }
      }
    }
  }

  _getNextBlock (cx, cy, direction) {
    let maze = this.maze;
    let nextBlock = {validBlock: false};

    // Get the next location.
    let nx = maze.nextX(cx, direction);
    let ny = maze.nextY(cy, direction);

    if (this._isUncarveBlock(nx, ny)) {
      nextBlock = {
        validBlock: true, x: nx, y: ny, direction: direction, canGoForward: true
      };
    } else if (maze.braided && this._isValidBlockForBraided(cx, cy, nx, ny)) {
      nextBlock = {
        validBlock: true, x: nx, y: ny, direction: direction, canGoForward: false
      };
    }

    return nextBlock;
  }

  _isValidBlock (x, y) {
    return this.maze.isValidBlock(x, y);
  }

  _isUncarveBlock (x, y) {
    return this._isValidBlock(x, y) && this.maze.getBlockValue(x, y) === 0;
  }

  _isValidBlockForBraided (cx, cy, nx, ny) {
    return this._isValidBlock(nx, ny) && this._isDeadEnd(cx, cy);
  }

  _isDeadEnd (x, y) {
    // If there's only one path to the current block, and next block is invalid,
    // then the current block will be an dead end.
    return this.maze.getWallsForBlock(x, y).length >= 3;
  }
}

export default RecursiveBacktracking;
