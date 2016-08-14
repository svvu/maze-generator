import {N, S, W, E} from './directions';

// A Class represent a grid for the maze.
class Grid {
  constructor (width, height) {
    this.blocks = [];
    this.width = width;
    this.height = height;

    // Grid represent in a 2D array.
    // The first level of the array is rows, which is y x-axis.
    for (let h = height; h > 0; h--) {
      let row = [];

      for (let w = width; w > 0; w--) {
        row.push(0);
      }

      this.blocks.push(row);
    }
  }

  // Check whether or not the block is out of grid or uncarve.
  isValidBlock (x, y) {
    let validX = x >= 0 && x < this.width;
    let validY = y >= 0 && y < this.height;
    let inGrid = validX && validY;
    return inGrid && this.blocks[y][x] === 0;
  }

  // Set the carve direction for the block.
  setCarvedDirection (x, y, direction) {
    this.blocks[y][x] |= direction;
  }

  // Get the next x coordinate.
  nextX (cx, direction) {
    switch (direction) {
      case N:
        return cx;
      case S:
        return cx;
      case E:
        return cx + 1;
      case W:
        return cx - 1;
    }
  }

  // Get the next y coordinate.
  nextY (cy, direction) {
    switch (direction) {
      case N:
        return cy - 1;
      case S:
        return cy + 1;
      case E:
        return cy;
      case W:
        return cy;
    }
  }

  // Get the directions that have walls.
  unCarveWall (x, y) {
    let block = this.blocks[y][x];

    return [N, S, E, W].filter((v) => {
      return !(block & v);
    });
  }

  // Generate the string representation for the grid.
  toString () {
    let result = [' _'.repeat(this.width)];

    for (let rows of this.blocks) {
      let blockWall = '|';

      for (let block of rows) {
        blockWall += this._getSWall(block);
        blockWall += this._getEWall(block);
      }

      result.push(blockWall);
    }

    return result.join('\n');
  }

  _getSWall (block) {
    if ((block & S) === 0) {
      return '_';
    } else {
      return ' ';
    }
  }

  _getEWall (block) {
    if ((block & E) === 0) {
      return '|';
    } else {
      return ' ';
    }
  }
}

export default Grid;
