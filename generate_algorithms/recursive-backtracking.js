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
      this._carveBlockInDirection(cx, cy, direct);
    }
  }

  _carveBlockInDirection (cx, cy, direction) {
    let nextBlock = this._getNextBlock(cx, cy, direction);

    if (nextBlock.validBlock) {
      // Break the wall to next block.
      this.maze.setCarvedDirection(cx, cy, direction);
      this.maze.setCarvedDirection(
        nextBlock.x, nextBlock.y, Directions.oppositeDirection(direction)
      );

      // Whether or not should keeo going.
      if (nextBlock.canGoForward) {
        this.carve(nextBlock.x, nextBlock.y);
      }
    }
  }

  _getNextBlock (cx, cy, direction) {
    let maze = this.maze;

    // Get the next location.
    let nx = maze.nextX(cx, direction);
    let ny = maze.nextY(cy, direction);
    let nextBlock = {
      x: nx,
      y: ny,
      direction: direction,
      validBlock: false,
      canGoForward: false
    };

    if (this._isUncarveBlock(nx, ny)) {
      nextBlock.validBlock = nextBlock.canGoForward = true;
    } else if (maze.weave && this._canGoUnderNextBlock(cx, cy, nx, ny, direction)) {
      nextBlock = this._getNextWeaveBlock(nx, ny, direction);
    } else if (maze.braided && this._canConnectNextBlockForBraided(cx, cy, nx, ny)) {
      nextBlock.validBlock = true;
    }

    return nextBlock;
  }

  _getNextWeaveBlock (cx, cy, direction) {
    let nx = this.maze.nextX(cx, direction);
    let ny = this.maze.nextY(cy, direction);

    return {
      x: nx,
      y: ny,
      direction: direction,
      validBlock: this._isValidBlock(nx, ny),
      canGoForward: this._isUncarveBlock(nx, ny)
    };
  }

  _isValidBlock (x, y) {
    return this.maze.isValidBlock(x, y);
  }

  _isUncarveBlock (x, y) {
    return this._isValidBlock(x, y) && this.maze.getBlockValue(x, y) === 0;
  }

  _canConnectNextBlockForBraided (cx, cy, nx, ny) {
    return this._isValidBlock(nx, ny) && this.maze.isDeadEnd(cx, cy);
  }

  _canGoUnderNextBlock (cx, cy, nx, ny, direction) {
    return this._isValidBlock(nx, ny) && this.maze.isDeadEnd(cx, cy) &&
            this.maze.hasWallInDirection(nx, ny, direction);
  }
}

export default RecursiveBacktracking;
