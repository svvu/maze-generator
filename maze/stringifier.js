import {N, S, W, E} from './directions';

class Block {
  constructor (value, pathHeight, pathWidth) {
    this.value = value;
    this.walls = this._getWalls(pathHeight, pathWidth);
  }

  _getWalls (pathHeight, pathWidth) {
    let nWall = this._getNWall();
    let wWall = this._getWWall();
    let eWall = this._getEWall();
    let sWall = this._getSWall();

    let walls = [];

    walls.push(
      this._getTopConner(N, W) + nWall.repeat(pathWidth) + this._getTopConner(N, E)
    );
    for (let i = 0; i < pathHeight - 1; i++) {
      walls.push(wWall + ' '.repeat(pathWidth) + eWall);
    }
    walls.push(
      this._getBottomConner(S, W) + sWall.repeat(pathWidth) + this._getBottomConner(S, E)
    );
    return walls;
  }

  _getSWall () {
    if (this.value & S) {
      return ' ';
    } else {
      return '_';
    }
  }

  _getNWall () {
    if (this.value & N) {
      return ' ';
    } else {
      return '_';
    }
  }

  _getEWall () {
    if (this.value & E) {
      return ' ';
    } else {
      return '|';
    }
  }

  _getWWall () {
    if (this.value & W) {
      return ' ';
    } else {
      return '|';
    }
  }

  _getTopConner (vDirection, hDirection) {
    if (this.value & vDirection) {
      return '|';
    } else if (this.value & hDirection) {
      return '_';
    } else {
      return ' ';
    }
  }

  _getBottomConner (vDirection, hDirection) {
    if (this.value & vDirection && this.value & hDirection) {
      return ' ';
    } else if (this.value & hDirection) {
      return '_';
    } else {
      return '|';
    }
  }
}

class BlockBuilder {
  constructor () {
    this.rows = [];
    this.previousBlock = null;
    this.blocksAbove = [];
    this.colIndex = 0;
  }

  walls () {
    let result = [];
    for (let row of this.rows) {
      result = result.concat(row);
    }
    return result;
  }

  addBlock (block) {
    let lastRow = this.rows[this._currentRowIndex()];

    if (lastRow.length === 0) {
      this.rows[this._currentRowIndex()] = lastRow.concat(block.walls);
    } else {
      let throughLeft = this._passingThroughPreviousBlock(block);

      for (let i = 0, h = lastRow.length; i < h; i++) {
        if (i === 0) {
          // If its the top wall, update the conner base on the top block
          let throughTop = this._passingThroughAboveBlock(block);
          let newWalls = this._updateConnerWall(throughTop, block.walls[i]);
          lastRow[i] += this._getGapBetweenWall(throughLeft) + newWalls;
        } else if (i === h - 1) {
          lastRow[i] += this._getGapBetweenWall(throughLeft) + block.walls[i];
        } else {
          lastRow[i] += ' ' + block.walls[i];
        }
      }
    }

    this.previousBlock = block;
    this.blocksAbove[this.colIndex] = block;
    this.colIndex += 1;
  }

  newRow () {
    this.rows.push([]);
    this.previousBlock = null;
    this.colIndex = 0;
  }

  _getGapBetweenWall (throughLeft) {
    if (throughLeft) {
      return '_';
    }

    return ' ';
  }

  _updateConnerWall (throughTop, currentWalls) {
    if (throughTop) {
      currentWalls = '|' +
                     currentWalls.substring(1, currentWalls.length - 1) +
                     '|';
    }

    return currentWalls;
  }

  _passingThroughPreviousBlock (block) {
    if (!this.previousBlock) {
      return false;
    }

    return this.previousBlock.value & E || block.value & W;
  }

  _passingThroughAboveBlock (block) {
    const blockAbove = this.blocksAbove[this.colIndex];
    if (!blockAbove) {
      return false;
    }

    return blockAbove.value & S || block.value & N;
  }

  _currentRowIndex () {
    if (this.rows.length - 1 <= 0) {
      return 0;
    }

    return this.rows.length - 1;
  }
}

class Stringifier {
  // Blocks are composed by cells.
  // Number of cells for each block = pathWidth * pathHeight.
  constructor (maze) {
    this.maze = maze;
    this.pathHeight = parseInt(maze.pathHeight, 10);
    this.pathWidth = parseInt(maze.pathWidth, 10);
  }

  stringify () {
    let rbuilder = new BlockBuilder();
    for (let rows of this.maze.blocks) {
      rbuilder.newRow();
      for (let block of rows) {
        let b = new Block(block, this.pathHeight, this.pathWidth);
        rbuilder.addBlock(b);
      }
    }

    return rbuilder.walls().join('\n');
  }
}

export default Stringifier;
