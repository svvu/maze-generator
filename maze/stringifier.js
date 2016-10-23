import {N, S, W, E} from './directions';

class Stringifier {
  // // Blocks are composed by cells.
  // Number of cells for each block = pathWidth * pathHeight.
  constructor (maze) {
    this.maze = maze;
    this.pathHeight = parseInt(maze.pathHeight, 10);
    this.pathWidth = parseInt(maze.pathWidth, 10);
  }

  // Generate the string representation for the maze.
  stringify () {
    let result = [];

    for (let rows of this.maze.blocks) {
      // Create one row for the maze.
      // One element in the array represent 1 cell row of the path.
      // Add one row for the top wall.
      // Ex: For block of 2 * 2 with 2 blocks.
      //  __   __ <- cell row
      // |  | |  |<- cell row
      // |__| |__|<- cell row
      // One extra rows for the top walls.
      let blockWalls = Array(this.pathHeight + 1).fill('');

      for (let block of rows) {
        // Get the cell rows for block.
        // Each element represent the walls for the path.
        // If the path has height 2, then there are 3 elements, 1 extra for the
        //  top wall.
        let walls = this._getBlockWalls(block);
        for (let i = 0, length = blockWalls.length; i < length; i++) {
          // Add the corresponding cell wall to the row.
          blockWalls[i] += walls[i];
        }
      }

      result = result.concat(blockWalls);
    }

    return result.join('\n');
  }

  _getBlockWalls (block) {
    // Create one block for the maze.
    // One element in the blockWalls represent 1 cell row of the path.
    // Add one cell for the top wall.
    // Ex: For block of 2 * 2 with 2 blocks.
    //  __ ab__c  <- cell row 1
    // |  |d|hi|f <- cell row 2
    // |__|e|__|g <- cell row 3
    //     ^
    //     |
    // horizontal gaps

    let blockWalls = Array(this.pathHeight + 1).fill('');

    let nWall = this._getNWall(block);
    let wWall = this._getWWall(block);
    let eWall = this._getEWall(block);
    let sWall = this._getSWall(block);

    // Get the horizontal gaps. Ex: a, d, e
    let horizontalGaps = this._getLeftHorizontalGap(block);

    // Add the top wall(cell row 1).
    // Gap(a) + conner(b) + block width's north wall ('_' between b and c) + conner(c).
    blockWalls[0] +=
      horizontalGaps[0] +
      this._getTopConnerlSideWallForBlock(wWall, nWall) +
      nWall.repeat(this.pathWidth) +
      this._getTopConnerlSideWallForBlock(eWall, nWall);

    let lastWallIndex = blockWalls.length - 1;
    // For each cell row (except last row) of the block add an data.
    // All the rows between (cell row 1 and 3 which is 2 in above example)
    for (let i = 1, length = lastWallIndex; i < length; i++) {
      // Gap(d) + west wall (right of d) + block width's white space(h and i) + east wall(right of f).
      blockWalls[i] += horizontalGaps[i] + wWall + ' '.repeat(this.pathWidth) + eWall;
    }

    // Add the bottom row cell and bottom wall to the block. (cell row 3)
    // Gap(e) + conner(right of e) + block width's south wall('_' between e and g) + conner(left of g).
    blockWalls[lastWallIndex] +=
      horizontalGaps[lastWallIndex] +
      this._getBottomConnerSideWallForBlock(wWall, sWall) +
      sWall.repeat(this.pathWidth) +
      this._getBottomConnerSideWallForBlock(eWall, sWall);

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

  // Conner gap which is the gap between 4 blocks, ex: X below.
  // If connect horizontally, the gap should only connect horizontally.
  // If connect vertically, the gap should only connect vertically.
  // If both, the gap should not connect at all.
  // If both no connect, the gap should connect both.
  //
  // X in the example below is what the functions try to make.
  // Ex:
  // Assume path height and width is 2.
  //    Case1:       Case2:     Case3:     Case4:
  //    a___b  ___    __   __    _______    _______  <- 1st row
  //    |   |g|   |  |  | |  |  |       |  |       | <- 1st row
  //    |_1_|h|_2_|  |  | |  |  |_______|  |   _   | <- 1st row
  //    c___dXe___f  |  |X|  |   ___X___   |  |_|  | <- 2nd row
  //    |   |i|   |  |  | |  |  |       |  |       | <- 2nd row
  //    |_3_|j|_4_|k |__| |__|  |_______|  |_______| <- 2nd row

  // This build the left and right part of X when creating the 2nd row.
  // Ex: e and f when at block 4.
  _getTopConnerlSideWallForBlock (sideWall, topWall) {
    if (sideWall === '|' && topWall === '_') {
      return ' ';
    } else if (sideWall === '|') {
      return '|';
    } else if (topWall === '_') {
      return '_';
    } else {
      return '|';
    }
  }

  // This build the top conner of X when creating 1st row.
  // Ex: left and right of h.
  // right of j and left of k when at block 4.
  _getBottomConnerSideWallForBlock (sideWall, bottomWall) {
    if (sideWall === '|') {
      return '|';
    } else if (bottomWall === '_') {
      return '_';
    } else {
      return ' ';
    }
  }

  // This build the bottom part of X which is also X when at block 4.
  _getConnerlGapBottonWall (hWall, _vWall) {
    if (hWall === '|') {
      return ' ';
    } else {
      return '_';
    }
  }

  // This build the gap between two blocks.
  // The white space above X and below X between 2 blocks.
  // Ex: X i and j when at block 4 for above exmaple.
  _getLeftHorizontalGap (block) {
    let wWall = this._getWWall(block);
    let gapB = wWall === '|' ? ' ' : '_';
    let gaps = [this._getConnerlGapBottonWall(wWall)];
    gaps = gaps.concat(Array(this.pathHeight - 1).fill(' '));
    gaps.push(gapB);
    return gaps;
  }
}

export default Stringifier;
