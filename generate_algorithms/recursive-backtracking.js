import Maze from '../maze/maze';

const Directions = Maze.directions();

// A algorithm that carve the grid to create a maze.
class RecursiveBacktracking {
  constructor (maze) {
    this.maze = maze;
  }

  carve (cx, cy) {
    // Randomize the directions to carve.
    let directions = Directions.shuffleDirections(
      this.maze.getWallsForBlock(cx, cy)
    );

    for (let direct of directions) {
      // Get the next location.
      let nx = this.maze.nextX(cx, direct);
      let ny = this.maze.nextY(cy, direct);

      if (this.maze.isValidBlock(nx, ny)) {
        // Update the value for the block with the direction.
        this.maze.setCarvedDirection(cx, cy, direct);
        this.maze.setCarvedDirection(nx, ny, Directions.oppositeDirection(direct));

        this.carve(nx, ny);
      }
    }
  }
}

export default RecursiveBacktracking;
