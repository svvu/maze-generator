export const N = 1; // 0001
export const S = 2; // 0010
export const E = 4; // 0100
export const W = 8; // 1000

// Get the opposite direction for a given single direction, if not found, default itself.
export function oppositeDirection (direction) {
  switch (direction) {
    case N:
      return S;
    case S:
      return N;
    case E:
      return W;
    case W:
      return E;
    default:
      return direction;
  }
}

export function shuffleDirections (array) {
  let arrLength = array.length;

  // While there are elements in the array
  while (arrLength > 0) {
      // Pick a random index
    let index = Math.floor(Math.random() * arrLength);
    arrLength--;

      // And swap the last element with it
    let temp = array[arrLength];
    array[arrLength] = array[index];
    array[index] = temp;
  }

  return array;
}
