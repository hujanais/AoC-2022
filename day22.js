const fs = require('fs');

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
 
const day22a = () => {
  // const filename = './data/day22test.txt';               // 6032
  const filename = './data/day22.txt';                // 191010
  const [grid, instructions] = buildGrid(filename);

  // prettyPrint(grid);
  // console.log(instructions);

  // You begin the path in the leftmost open tile of the top row of tiles. 
  // Initially, you are facing to the right (from the perspective of how the map is drawn).
  pos = [0, grid[0].indexOf('.')];
  let direction = RIGHT;

  grid[pos[0]][pos[1]] = '>';
  
  let moveStr = '';
  let stepsToTake = 0;
  let count = 0;
  while (instructions.length > 0) {
    const inst = instructions.shift();
    if ([LEFT, RIGHT, END].includes(inst)) {      
      // move
      stepsToTake = +moveStr;
      // console.log(direction, stepsToTake)
      switch(direction) {
        case LEFT:
          pos = stepLeft(pos, stepsToTake, grid);
          break;
        case RIGHT:
          pos = stepRight(pos, stepsToTake, grid);
          break;
        case UP:
          pos = stepUp(pos, stepsToTake, grid);
          break;
        case DOWN:
          pos = stepDown(pos, stepsToTake, grid);
          break;
      }

      if(inst === END) break;  // exit end of instruction.
      
      // update direction
      direction = changeDirection(direction, inst, pos, grid);
      grid[pos[0]][pos[1]] = character(direction);
      // console.log(pos, direction);
      moveStr = '';
      count += 1;
    } else {
      moveStr += inst;
    }
  }

  // The final password is the sum of 1000 times the row, 4 times the column, and the facing.
  // Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
  let directionValue;
  switch(direction) {
    case RIGHT: directionValue = 0; break;
    case DOWN: directionValue = 1; break;
    case LEFT: directionValue = 2; break;
    case UP: directionValue = 3; break;
  }
  const answer = (1000 * (pos[0] + 1)) + (4 * (pos[1]+1)) + directionValue;
  console.log('day22a = ', answer);

  // prettyPrint(grid);
}

const stepRight = (pos, steps, grid) => {
  let [row, col] = pos;
  let newCol = col;
  const len = grid[0].length;
  while(steps > 0) {
    let testCol = mod((col+1), len);
    if (grid[row][testCol] === '#') {
      break;
    } else if (grid[row][testCol] === ' ') {
      col = testCol;
    } else {
      grid[row][testCol] = '>';
      col = testCol;
      newCol = testCol;
      steps -= 1;
    }  
  }

  return [row, newCol];
}

const stepLeft = (pos, steps, grid) => {
  let [row, col] = pos;
  let newCol = col;
  const len = grid[0].length;
  while(steps > 0) {
    let testCol = mod((col-1), len);
    if (grid[row][testCol] === '#') {
      break;
    } else if (grid[row][testCol] === ' ') {
      col = testCol;
    } else {
      grid[row][testCol] = '<';
      col = testCol;
      newCol = testCol;
      steps -= 1;
    }  
  }

  return [row, newCol];
}

const stepUp = (pos, steps, grid) => {
  let [row, col] = pos;
  let newRow = row;
  const len = grid.length;
  while(steps > 0) {
    let testRow = mod(row-1, len);
    if (grid[testRow][col] === '#') {
      break;
    } else if (grid[testRow][col] === ' ') {
      row = testRow;
    } else {
      grid[testRow][col] = '^';
      row = testRow;
      newRow = testRow;
      steps -= 1;
    }  
  }

  return [newRow, col];
}

const stepDown = (pos, steps, grid) => {
  let [row, col] = pos;
  let newRow = row;
  const len = grid.length;
  while(steps > 0) {
    let testRow = mod(row + 1, len);
    if (grid[testRow][col] === '#') {
      break;
    } else if (grid[testRow][col] === ' ') {
      row = testRow;
    } else {
      grid[testRow][col] = 'v';
      row = testRow;
      newRow = testRow;
      steps -= 1;
    }  
  }

  return [newRow, col];
}

const changeDirection = (oldDirection, directionStr) => {
  let newDirection = '';
  
  switch (oldDirection) {
    case LEFT:
      newDirection = (directionStr === LEFT)?DOWN:UP;
      break;
    case RIGHT:
      newDirection = (directionStr === LEFT)?UP:DOWN;
      break;
    case UP:
      newDirection = (directionStr === LEFT)?LEFT:RIGHT;
      break;
    case DOWN:
      newDirection = (directionStr === LEFT)?RIGHT:LEFT;
      break;
  }
  
  return newDirection;
}

const buildGrid = (filename) => {
    let arr = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // get the width of the board.
  const width = Math.max(...arr.slice(0, -2).map(l => l.length));  
  const grid = [];
  
  // build the grid.
  for (let line of arr.slice(0,-2)) {
    line = line.padEnd(width, ' ');
    grid.push([...line]);
  }
    
  // extract the move instructions.
  const instructions = Array.from(arr.slice(-1)[0]);
  
  // add an END cap.
  instructions.push(END);
  
  return [grid, instructions];
}

prettyPrint = (grid) => {
  grid.forEach(row => {
    console.log(row.join(''));
  });
}

module.exports = { day22a };