import {oppositeDirection, shuffleDirections} from './directions';
import Grid from './grid';

// A algorithm that carve the grid to create a maze.
class RecursiveBacktracking {
  static carveBlock (grid, cx, cy) {
    if (!(grid instanceof Grid)) {
      return false;
    }
    // Randomize the directions to carve.
    let directions = shuffleDirections(grid.unCarveWall(cx, cy));

    for (let direct of directions) {
      // Get the next location.
      let nx = grid.nextX(cx, direct);
      let ny = grid.nextY(cy, direct);

      if (grid.isValidBlock(nx, ny)) {
        // Update the value for the block with the direction.
        grid.setCarvedDirection(cx, cy, direct);
        grid.setCarvedDirection(nx, ny, oppositeDirection(direct));

        this.carveBlock(grid, nx, ny);
      }
    }
    return true;
  }
}

export default RecursiveBacktracking;
