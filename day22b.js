const fs = require('fs');

class Node {
  constructor(row, col, char, id) {
    this.id = id;
    this.r = row;
    this.c = col;
    this.char = char;
    this.up = null;
    this.down = null;
    this.right = null;
    this.left = null;
  }

  stepLeft = () => {
    if(this.id === 6) {
      return this.up;
    }
    return this.left;
  }

  stepUp = () => {
    if (this.id === 6) {
      return this.right;
    }
    return this.up;
  }

  stepRight = () => {
    if (this.id === 6) {
      return this.down;
    }
    return this.right;
  }

  stepDown = () => {
    if (this.id === 6) {
      return this.left;
    }
    return this.down;
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
    case LEFT: return '<';
    case RIGHT: return '>';
    case UP: return '^';
    case DOWN: return 'v';
  }
}

const mod = (x, m) => (x % m + m) % m;

const changeDirection = (oldDirection, directionStr) => {
  let newDirection = '';

  switch (oldDirection) {
    case LEFT:
      newDirection = (directionStr === LEFT) ? DOWN : UP;
      break;
    case RIGHT:
      newDirection = (directionStr === LEFT) ? UP : DOWN;
      break;
    case UP:
      newDirection = (directionStr === LEFT) ? LEFT : RIGHT;
      break;
    case DOWN:
      newDirection = (directionStr === LEFT) ? RIGHT : LEFT;
      break;
  }

  return newDirection;
}

const day22b = () => {
  const [grid, instructions, sq1] = buildCubeGridSmall('./data/day22test.txt');
  console.log(instructions);
  
  // You begin the path in the leftmost open tile of the top row of tiles. 
  // Initially, you are facing to the right (from the perspective of how the map is drawn).
  let ptr = sq1[0][0];
  let direction = RIGHT;

  grid[ptr.r][ptr.c] = '>';

  let moveStr = '';
  let stepsToTake = 0;
  try {
    while (instructions.length > 0) {
      const inst = instructions.shift();
      if ([LEFT, RIGHT, END].includes(inst)) {
        // move
        stepsToTake = +moveStr;
        // console.log(direction, stepsToTake)
        switch (direction) {
          case LEFT:
            while (stepsToTake > 0) {
              if (ptr.left.char === '#') break;
              grid[ptr.r][ptr.c] = '<';
              ptr = ptr.stepLeft();
              stepsToTake -= 1;
            }
            break;
          case RIGHT:
            while (stepsToTake > 0) {
              if (ptr.right.char === '#') break;
              grid[ptr.r][ptr.c] = '>';
              ptr = ptr.stepRight();
              stepsToTake -= 1;
            }
            break;
          case UP:
            while (stepsToTake > 0) {
              if (ptr.up.char === '#') break;
              grid[ptr.r][ptr.c] = '^';
              ptr = ptr.stepUp();
              stepsToTake -= 1;
            }
            break;
          case DOWN:
            while (stepsToTake > 0) {
              if (ptr.down.char === '#') break;
              grid[ptr.r][ptr.c] = 'v';
              ptr = ptr.stepDown();
              stepsToTake -= 1;
            }
            break;
        }

        if (inst === END) break;  // exit end of instruction.

        // update direction
        direction = changeDirection(direction, inst, [ptr.r, ptr.c], grid);
        grid[ptr.r][ptr.c] = character(direction);
        // console.log(pos, direction);
        moveStr = '';
      } else {
        moveStr += inst;
      }
    }
  } catch (ex) {
    console.log(ptr.id, ex)
  }

  prettyPrint(grid)
}

const buildCubeGridSmall = () => {
  let arr = fs.readFileSync('./data/day22test.txt',
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // get the width of the board.
  const width = Math.max(...arr.slice(0, -2).map(l => l.length));
  const grid = [];

  // build the grid.
  for (let line of arr.slice(0, -2)) {
    line = line.padEnd(width, ' ');
    grid.push([...line]);
  }

  // generate the 6 50x50 grid and then unpack into a 4 x 4 50x50 grid.
  /*
          |1|
      |2|3|4|
          |5|6|
  */
  const sq1 = [];
  const sq2 = [];
  const sq3 = [];
  const sq4 = [];
  const sq5 = [];
  const sq6 = [];

  for (let r = 0; r < 4; r++) {
    const newRow = [];
    for (let c = 8; c < 12; c++) {
      newRow.push(new Node(r, c, arr[r][c], 1));
    }
    sq1.push(newRow);
  }

  for (let r = 4; r < 8; r++) {
    const newRow2 = [];
    const newRow3 = [];
    const newRow4 = [];
    for (let c = 0; c < 4; c++) {
      newRow2.push(new Node(r, c, arr[r][c], 2));
      newRow3.push(new Node(r, c + 4, arr[r][c + 4], 3));
      newRow4.push(new Node(r, c + 8, arr[r][c + 8], 4));
    }
    sq2.push(newRow2);
    sq3.push(newRow3);
    sq4.push(newRow4);
  }

  for (let r = 8; r < 12; r++) {
    const newRow5 = [];
    const newRow6 = [];
    for (let c = 8; c < 12; c++) {
      newRow5.push(new Node(r, c, arr[r][c], 5));
      newRow6.push(new Node(r, c + 4, arr[r][c], 6));
    }
    sq5.push(newRow5);
    sq6.push(newRow6);
  }

  // build the 4 x 4 blocks.
  /*
     |2v|
  |3>|1^|6v|5v|
     |4^|
     |5^|
  */

  bfs(sq1);
  bfs(sq2);
  bfs(sq3);
  bfs(sq4);
  bfs(sq5);
  bfs(sq6);

  // stitch 1 vertical
  const len = sq1[0].length;
  for (let c = 0; c < len; c++) {
    sq1[0][c].up = sq2[0][len - c - 1];
    sq2[0][len - c - 1].up = sq1[0][c];

    sq1[len - 1][c].down = sq4[0][c];
    sq4[0][c].up = sq1[len - 1][c];

    sq5[0][c].up = sq4[len - 1][c];
    sq4[len - 1][c].down = sq5[0][c];

    sq5[len - 1][c].down = sq2[len - 1][len - c - 1];
    sq2[len - 1][len - c - 1].down = sq5[len - 1][c];
  }

  // stitch 1 horizontal
  for (let r = 0; r < len; r++) {
    sq1[r][0].left = sq3[0][r];
    sq3[0][r].up = sq1[r][0];

    sq1[r][len - 1].right = sq6[len - r - 1][len - 1];
    sq6[len - r - 1][len - 1].right = sq1[r][len - 1];

    sq6[r][0].left = sq5[r][len - 1];
    sq5[r][len - 1].right = sq6[r][0];

    sq5[r][0].left = sq3[len - 1][len - 1 - r];
    sq3[len - 1][len - 1 - r].down = sq5[r][0];
  }

  // stitch 4 horizontal
  for (let r = 0; r < len; r++) {
    sq4[r][len - 1].right = sq6[0][len - 1 - r];
    sq6[0][len - 1 - r].up = sq4[r][len - 1];

    sq6[len - 1][len - 1 - r].down = sq2[r][0];
    sq2[r][0].left = sq6[len - 1][len - 1 - r];

    sq2[r][len - 1].right = sq3[r][0];
    sq3[r][0].left = sq2[r][len - 1];

    sq3[r][len - 1].right = sq4[r][0];
    sq4[r][0].left = sq3[r][len - 1];
  }

  // extract the move instructions.
  const instructions = Array.from(arr.slice(-1)[0]);

  // add an END cap.
  instructions.push(END);

  return [grid, instructions, sq1];
}

const key = (r, c) => `${r}-${c}`;

const bfs = (square) => {
  const queue = [[0, 0]];
  const visited = new Set();
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    visited.add(key(r, c));
    if (c - 1 >= 0 && !visited.has(key(r, c - 1))) {
      // left
      square[r][c].left = square[r][c - 1];
      square[r][c - 1].right = square[r][c];
      queue.push([r, c - 1]);
    }
    if (c + 1 < square[0].length && !visited.has(key(r, c + 1))) {
      // right
      square[r][c].right = square[r][c + 1];
      square[r][c + 1].left = square[r][c];
      queue.push([r, c + 1]);
    }
    if (r - 1 >= 0 && !visited.has(key(r - 1, c))) {
      // up
      square[r][c].up = square[r - 1][c];
      square[r - 1][c].down = square[r][c];
      queue.push([r - 1, c]);
    }
    if (r + 1 < square.length && !visited.has(key(r + 1, c))) {
      // down
      square[r][c].down = square[r + 1][c];
      square[r + 1][c].up = square[r][c];
      queue.push([r + 1, c]);
    }
  }
}

prettyPrint = (grid) => {
  grid.forEach(row => {
    console.log(row.join(''));
  });
}

module.exports = { day22b };