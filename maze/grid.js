import {N, S, W, E} from './directions';

// A Class represent a grid for the maze.
class Grid {
  // The grid is composed by blocks.
  // Number of blocks = width * height.
  constructor (width, height) {
    this.blocks = [];
    this.width = parseInt(width, 10);
    this.height = parseInt(height, 10);
    this._fillGridWithZeroValue();
  }

  // Get the value in coordinate x and y.
  // If the coordinate is out of the gird, -1 will be return.
  getBlockValue (x, y) {
    if (this.isBlockInGrid(x, y)) {
      return this.blocks[y][x];
    } else {
      return -1;
    }
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
  getWallsForBlock (x, y) {
    let block = this.getBlockValue(x, y);

    return [N, S, E, W].filter((v) => {
      return !(block & v);
    });
  }

  // Check whether or not the block is out of grid.
  isBlockInGrid (x, y) {
    let validX = x >= 0 && x < this.width;
    let validY = y >= 0 && y < this.height;
    return validX && validY;
  }

  // Fill the grid with default value 0.
  _fillGridWithZeroValue () {
    // Grid represent in a 2D array.
    // The first level of the array is rows, which is y x-axis.
    for (let h = this.height; h > 0; h--) {
      let row = [];

      for (let w = this.width; w > 0; w--) {
        row.push(0);
      }

      this.blocks.push(row);
    }
  }
}

export default Grid;
