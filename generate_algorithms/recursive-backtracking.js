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
      // Get the next location.
      let nx = maze.nextX(cx, direct);
      let ny = maze.nextY(cy, direct);

      if (this.isValidBlock(nx, ny)) {
        // Update the value for the block with the direction.
        maze.setCarvedDirection(cx, cy, direct);
        maze.setCarvedDirection(nx, ny, Directions.oppositeDirection(direct));

        this.carve(nx, ny);
      }
    }
  }

  isValidBlock (nx, ny) {
    let maze = this.maze;
    return maze.isValidBlock(nx, ny) && maze.getBlockValue(nx, ny) === 0;
  }
}

export default RecursiveBacktracking;
