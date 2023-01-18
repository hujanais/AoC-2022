const fs = require('fs');

/*
  This is not a generic solution. I had to stitch the face transitions specifically for this cube.
*/

class Cell {
  constructor(r, c, face, char) {
    this.r = r;
    this.c = c;
    this.face = face;
    this.char = char;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
  }
}

/*
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        .#......
        ......#.
*/

const END = 'E';
const LEFT = 'L';
const UP = 'U';
const RIGHT = 'R';
const DOWN = 'D';

const character = (direction) => {
  switch (direction) {
    case LEFT:
      return '<';
    case RIGHT:
      return '>';
    case UP:
      return '^';
    case DOWN:
      return 'v';
  }
};

const day22b = () => {
  // let [cell, grid, directionMap, instructions] = buildTestCube(); // 5031
  let [cell, grid, directionMap, instructions] = buildCube(); // 109022 too high, 73238 wrong, 55364

  // test to see if we can go around the cube N-S and S-W
  // let dir;
  // cell.char = 'S';
  // [cell, dir] = step(cell, 200, UP, directionMap);
  // cell.char = 'E';

  // prettyPrint(grid);
  // return;

  // You begin the path in the leftmost open tile of the top row of tiles.
  // Initially, you are facing to the right (from the perspective of how the map is drawn).
  let direction = RIGHT;

  cell.char = character(RIGHT);

  let moveStr = '';
  let stepsToTake = 0;
  while (instructions.length > 0) {
    const inst = instructions.shift();
    // console.log(inst);
    if ([LEFT, RIGHT, END].includes(inst)) {
      // move
      stepsToTake = +moveStr;
      [cell, direction] = step(cell, stepsToTake, direction, directionMap);
      if (inst === END) {
        // exit end of instruction.
        cell.char = 'E';
        // prettyPrint(grid);
        break;
      }

      // update direction
      direction = changeDirection(direction, inst);
      cell.char = character(direction);
      // prettyPrint(grid);
      moveStr = '';
    } else {
      moveStr += inst;
    }
  }

  // The final password is the sum of 1000 times the row, 4 times the column, and the facing.
  // Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
  let directionValue;
  switch (direction) {
    case RIGHT:
      directionValue = 0;
      break;
    case DOWN:
      directionValue = 1;
      break;
    case LEFT:
      directionValue = 2;
      break;
    case UP:
      directionValue = 3;
      break;
  }
  const answer = 1000 * (cell.r + 1) + 4 * (cell.c + 1) + directionValue;
  console.log('day22b = ', answer);
};

const step = (cell, steps, direction, directionMap) => {
  if (steps === 0) {
    return [cell, direction];
  }

  cell.char = character(direction);

  let neighbor;
  switch (direction) {
    case LEFT:
      neighbor = cell.left;
      break;
    case UP:
      neighbor = cell.up;
      break;
    case RIGHT:
      neighbor = cell.right;
      break;
    case DOWN:
      neighbor = cell.down;
      break;
  }

  if (neighbor.char === '#') {
    return [cell, direction];
  }

  if (neighbor.face !== cell.face) {
    let newDirection = directionMap.find((p) => p.from === cell.face && p.to === neighbor.face);
    return step(neighbor, steps - 1, newDirection.newDir, directionMap);
  } else {
    return step(neighbor, steps - 1, direction, directionMap);
  }
};

const changeDirection = (oldDirection, directionStr) => {
  let newDirection = '';

  switch (oldDirection) {
    case LEFT:
      newDirection = directionStr === LEFT ? DOWN : UP;
      break;
    case RIGHT:
      newDirection = directionStr === LEFT ? UP : DOWN;
      break;
    case UP:
      newDirection = directionStr === LEFT ? LEFT : RIGHT;
      break;
    case DOWN:
      newDirection = directionStr === LEFT ? RIGHT : LEFT;
      break;
  }

  return newDirection;
};

const buildCube = () => {
  const filename = './data/day22.txt';
  let arr = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');

  // get the width of the board.
  const width = Math.max(...arr.slice(0, -2).map((l) => l.length));
  const grid = [];

  const face1 = [];
  const face2 = [];
  const face3 = [];
  const face4 = [];
  const face5 = [];
  const face6 = [];

  for (let row = 0; row < arr.length - 2; row++) {
    grid.push(Array.from(Array(width).keys()).map((col) => new Cell(row, col, 0, arr[row][col] ? arr[row][col] : '')));
    // grid.push(Array.from(Array(width).keys()).map((col) => new Cell(row, col, 0, arr[row][col] ? '.' : '')));
  }

  // build the cube faces
  for (let row = 0; row < 50; row++) {
    face1.push([]);
    face2.push([]);
    for (let col = 0; col < 50; col++) {
      grid[row][col + 50].face = 1;
      grid[row][col + 100].face = 2;
      face1[row].push(grid[row][col + 50]);
      face2[row].push(grid[row][col + 100]);
    }
  }

  for (let row = 50; row < 100; row++) {
    face3.push([]);
    for (let col = 0; col < 50; col++) {
      grid[row][col + 50].face = 3;
      face3[row - 50].push(grid[row][col + 50]);
    }
  }

  for (let row = 100; row < 150; row++) {
    face4.push([]);
    face5.push([]);
    for (let col = 0; col < 50; col++) {
      grid[row][col].face = 4;
      grid[row][col + 50].face = 5;

      face4[row - 100].push(grid[row][col]);
      face5[row - 100].push(grid[row][col + 50]);
    }
  }

  for (let row = 150; row < 200; row++) {
    face6.push([]);
    for (let col = 0; col < 50; col++) {
      grid[row][col].face = 6;
      face6[row - 150].push(grid[row][col]);
    }
  }

  // build link-list
  buildLinks(face1);
  buildLinks(face2);
  buildLinks(face3);
  buildLinks(face4);
  buildLinks(face5);
  buildLinks(face6);

  // link the faces
  linkFaces(grid, face1, face4, LEFT, face6, LEFT, face2, LEFT, face3, UP);
  linkFaces(grid, face2, face1, RIGHT, face6, DOWN, face5, RIGHT, face3, RIGHT);
  linkFaces(grid, face3, face4, UP, face1, DOWN, face2, DOWN, face5, UP);
  linkFaces(grid, face4, face1, LEFT, face3, LEFT, face5, LEFT, face6, UP);
  linkFaces(grid, face5, face4, RIGHT, face3, DOWN, face2, RIGHT, face6, RIGHT);
  linkFaces(grid, face6, face1, UP, face4, DOWN, face5, DOWN, face2, UP);

  // generate direction map.
  const directionMap = [
    { from: 1, to: 4, direction: LEFT, newDir: RIGHT },
    { from: 1, to: 6, direction: UP, newDir: RIGHT },
    { from: 1, to: 2, direction: RIGHT, newDir: RIGHT },
    { from: 1, to: 3, direction: DOWN, newDir: DOWN },
    { from: 2, to: 1, direction: LEFT, newDir: LEFT },
    { from: 2, to: 6, direction: UP, newDir: UP },
    { from: 2, to: 5, direction: RIGHT, newDir: LEFT },
    { from: 2, to: 3, direction: DOWN, newDir: LEFT },
    { from: 3, to: 4, direction: LEFT, newDir: DOWN },
    { from: 3, to: 1, direction: UP, newDir: UP },
    { from: 3, to: 2, direction: RIGHT, newDir: UP },
    { from: 3, to: 5, direction: DOWN, newDir: DOWN },
    { from: 4, to: 1, direction: LEFT, newDir: RIGHT },
    { from: 4, to: 3, direction: UP, newDir: RIGHT },
    { from: 4, to: 5, direction: RIGHT, newDir: RIGHT },
    { from: 4, to: 6, direction: DOWN, newDir: DOWN },
    { from: 5, to: 4, direction: LEFT, newDir: LEFT },
    { from: 5, to: 3, direction: UP, newDir: UP },
    { from: 5, to: 2, direction: RIGHT, newDir: LEFT },
    { from: 5, to: 6, direction: DOWN, newDir: LEFT },
    { from: 6, to: 1, direction: LEFT, newDir: DOWN },
    { from: 6, to: 4, direction: UP, newDir: UP },
    { from: 6, to: 5, direction: RIGHT, newDir: UP },
    { from: 6, to: 2, direction: DOWN, newDir: DOWN },
  ];

  // extract the move instructions.
  const instructions = Array.from(arr.slice(-1)[0]);

  // add an END cap.
  instructions.push(END);

  return [face1[0][0], grid, directionMap, instructions];
};

const linkFaces = (grid, face, leftFace, leftFaceDirection, upFace, upFaceDirection, rightFace, rightFaceDirection, downFace, downFaceDirection) => {
  const len = face.length;
  switch (leftFaceDirection) {
    case UP:
      for (let row = 0; row < len; row++) {
        face[row][0].left = leftFace[0][row];
        leftFace[0][row].up = face[row][0];
      }
      break;
    case DOWN:
      for (let row = 0; row < len; row++) {
        face[row][0].left = leftFace[len - 1][len - 1 - row];
        leftFace[len - 1][len - 1 - row].down = face[row][0];
      }
      break;
    case RIGHT:
      for (let row = 0; row < len; row++) {
        face[row][0].left = leftFace[row][len - 1];
        leftFace[row][len - 1].right = face[row][0];
      }
      break;
    case LEFT:
      for (let row = 0; row < len; row++) {
        face[row][0].left = leftFace[len - 1 - row][0];
        leftFace[len - 1 - row][0].left = face[row][0];
      }
      break;
  }

  switch (upFaceDirection) {
    case UP:
      for (let col = 0; col < len; col++) {
        face[0][col].up = upFace[0][col];
        upFace[0][col].up = face[0][col];
      }
      break;
    case DOWN:
      for (let col = 0; col < len; col++) {
        face[0][col].up = upFace[len - 1][col];
        upFace[len - 1][col].down = face[0][col];
      }
      break;
    case RIGHT:
      for (let col = 0; col < len; col++) {
        face[0][col].up = upFace[len - 1 - col][len - 1];
        upFace[len - 1 - col][len - 1].right = face[0][col];
      }
      break;
    case LEFT:
      for (let col = 0; col < len; col++) {
        face[0][col].up = upFace[col][0];
        upFace[col][0].left = face[0][col];
      }
      break;
  }

  switch (rightFaceDirection) {
    case UP:
      for (let row = 0; row < len; row++) {
        face[row][len - 1].right = rightFace[row][0];
        rightFace[row][0].left = face[row][len - 1];
      }
      break;
    case DOWN:
      for (let row = 0; row < len; row++) {
        face[row][len - 1].right = rightFace[len - 1][row];
        rightFace[len - 1][row].bottom = face[row][len - 1];
      }
      break;
    case RIGHT:
      for (let row = 0; row < len; row++) {
        face[row][len - 1].right = rightFace[len - 1 - row][len - 1];
        rightFace[len - 1 - row][len - 1].right = face[row][len - 1];
      }
      break;
    case LEFT:
      for (let row = 0; row < len; row++) {
        face[row][len - 1].right = rightFace[row][0];
        rightFace[row][0].left = face[row][len - 1];
      }
      break;
  }

  switch (downFaceDirection) {
    case UP:
      for (let col = 0; col < len; col++) {
        face[len - 1][col].down = downFace[0][col];
        downFace[0][col].up = face[len - 1][col];
      }
      break;
    case DOWN:
      for (let col = 0; col < len; col++) {
        face[len - 1][col].down = downFace[len - 1][len - 1 - col];
        downFace[len - 1][len - 1 - col].down = face[len - 1][col];
      }
      break;
    case RIGHT:
      for (let col = 0; col < len; col++) {
        face[len - 1][col].down = downFace[col][len - 1];
        downFace[col][len - 1].right = face[len - 1][col];
      }
      break;
    case LEFT:
      for (let col = 0; col < len; col++) {
        face[len - 1][col].down = downFace[len - 1 - col][0];
        downFace[len - 1 - col][0].left = face[len - 1][col];
      }
      break;
  }
};

const buildLinks = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      if (row - 1 >= 0) {
        grid[row][col].up = grid[row - 1][col];
      }
      if (row + 1 < grid.length) {
        grid[row][col].down = grid[row + 1][col];
      }
      if (col - 1 >= 0) {
        grid[row][col].left = grid[row][col - 1];
      }
      if (col + 1 < grid[0].length) {
        grid[row][col].right = grid[row][col + 1];
      }
    }
  }
};

prettyPrint = (grid) => {
  for (let row of grid) {
    console.log(row.map((c) => c.char).join(''));
  }
  console.log('');
};

module.exports = { day22b };