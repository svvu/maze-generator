import {N, S, W, E} from './directions';

// A Class represent a grid for the maze.
class Grid {
  // The grid is composed by blocks.
  // Number of blocks = width * height.
  // Blocks are composed by cells.
  // Number of cells for each block = pathWidth * pathHeight.
  constructor (width, height, pathWidth = 1, pathHeight = 1) {
    this.blocks = [];
    this.width = parseInt(width, 10);
    this.height = parseInt(height, 10);
    this.pathHeight = parseInt(pathHeight, 10);
    this.pathWidth = parseInt(pathWidth, 10);

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
    let result = [];

    for (let rows of this.blocks) {
      // Create one row for the maze.
      // One element in the array represent 1 cell row of the path.
      // Add one row for the top wall.
      // Ex: For block of 2 * 2 with 2 blocks.
      //  __   __ <- cell rows
      // |  | |  |<- cell rows
      // |__| |__|<- cell rows
      // One extra rows for the top walls.
      let blockWalls = Array(this.pathHeight + 1).fill('');

      for (let block of rows) {
        // Get the cell rows for block.
        // Each element represent the walls for the path.
        // If the path has height 2, then there are 3 elements, 1 extra for the
        //  top wall.
        let walls = this._getBlockWalls(block);
        for (let i = 0, length = blockWalls.length; i < length; i++) {
          blockWalls[i] += walls[i];
        }
      }

      result = result.concat(blockWalls);
    }

    return result.join('\n');
  }

  _getBlockWalls (block) {
    // Create one block for the maze.
    // One element in the array represent 1 cell of the path.
    // Add one cell for the top wall.
    // Ex: For block of 2 * 2 with 2 blocks.
    //  __   __  <- cell rows
    // |  | |  | <- cell rows
    // |__| |__| <- cell rows
    //     ^
    //     |
    // horizontal gaps
    let blockWalls = Array(this.pathHeight + 1).fill('');

    let nWall = this._getNWall(block);
    let wWall = this._getWWall(block);
    let eWall = this._getEWall(block);
    let sWall = this._getSWall(block);

    // Get the horizontal gaps.
    let horizontalGaps = this._getWallHorizontalGap(block);

    // Add the top wall.
    // Gap + conner + block width's north wall + conner.
    blockWalls[0] +=
      horizontalGaps[0] + this._getConnerlGapSideWall(wWall, nWall) +
      nWall.repeat(this.pathWidth) +
      this._getConnerlGapSideWall(eWall, nWall);

    let lastWallIndex = blockWalls.length - 1;
    // For each cell row (except last row) of the block add an data.
    for (let i = 1, length = lastWallIndex; i < length; i++) {
      // Gap + west wall + block width's white space + east wall.
      blockWalls[i] += horizontalGaps[i] + wWall + ' '.repeat(this.pathWidth) + eWall;
    }

    // Add the bottom row cell and bottom wall to the block.
    // Gap + conner + block width's south wall + conner.
    blockWalls[lastWallIndex] +=
      horizontalGaps[lastWallIndex] +
      this._getConnerlGapTopWall(wWall, sWall) +
      sWall.repeat(this.pathWidth) +
      this._getConnerlGapTopWall(eWall, sWall);

    return blockWalls;
  }

  _getSWall (block) {
    if ((block & S) === 0) {
      return '_';
    } else {
      return ' ';
    }
  }

  _getNWall (block) {
    if ((block & N) === 0) {
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

  _getWWall (block) {
    if ((block & W) === 0) {
      return '|';
    } else {
      return ' ';
    }
  }

  // For conner gap:
  // If connect horizontally, the gap should only connect horizontally.
  // If connect vertically, the gap should only connect vertically.
  // If both, the gap should not connect at all.
  // If both no connect, the gap should connect both.
  //
  // X in the example below is what the functions try to make.
  // Ex:
  // Assume path height and weight is 1.
  // Case1:     Case2:     Case3:     Case4:
  //  __   __    __   __    _______    _______  <- 1st row
  // |__| |__|  |  | |  |  |_______|  |   _   | <- 1st row
  //  __ X __   |  |X|  |   ___X___   |  |_|  | <- 2nd row
  // |__| |__|  |__| |__|  |_______|  |_______| <- 2nd row
  // This build the left and right part of X when creating the 2nd row.
  _getConnerlGapSideWall (hBlock, vBlock) {
    if (hBlock === '|' && vBlock === '_') {
      return ' ';
    } else if (hBlock === '|') {
      return '|';
    } else if (vBlock === '_') {
      return '_';
    } else {
      return '|';
    }
  }

  // This build the top part of X when creating 1st row.
  _getConnerlGapTopWall (hBlock, vBlock) {
    if (hBlock === '|') {
      return '|';
    } else if (vBlock === '_') {
      return '_';
    } else {
      return ' ';
    }
  }

  // This build the top part of X when creating 2nd row.
  _getConnerlGapBottonWall (hBlock, _vBlock) {
    if (hBlock === '|') {
      return ' ';
    } else {
      return '_';
    }
  }

  // This build the gap between two blocks.
  // The white space above X and below X between 2 blocks.
  _getWallHorizontalGap (block) {
    let wWall = this._getWWall(block);
    let gapB = wWall === '|' ? ' ' : '_';
    let gaps = [this._getConnerlGapBottonWall(wWall)];
    gaps = gaps.concat(Array(this.pathHeight - 1).fill(' '));
    gaps.push(gapB);
    return gaps;
  }

  _getWallVerticalGap (block) {
  }
}

export default Grid;
