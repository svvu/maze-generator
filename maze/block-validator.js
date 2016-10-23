class BlockValidator {
  constructor (maze) {
    this.maze = maze;
  }

  // Check the block in the grid, and value is 0 means has all 4 walls.
  unCave (x, y) {
    return this.maze.isBlockInGrid(x, y) && this.maze.getBlockValue(x, y) === 0;
  }
}

export default BlockValidator;
