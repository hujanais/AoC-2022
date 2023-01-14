const fs = require('fs');

const day8a = () => {
  // const grid = readGrid('./data/day8test.txt');
  const grid = readGrid('./data/day8.txt');
  const numRows = grid.length;
  const numCols = grid[0].length;

  let answer = 0;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const testValue = grid[row][col];
      let result = false;
      result ||= walkUp(grid, row, col, testValue, true);
      result ||= walkDown(grid, row, col, testValue, true);
      result ||= walkLeft(grid, row, col, testValue, true);
      result ||= walkRight(grid, row, col, testValue, true);
      if (result) answer += 1;
      // console.log(result, row, col);
    }
  }

  console.log('day8a result = ', answer);
}

const walkLeft = (grid, row, col, testValue, firstTime) => {
  if (col === -1) return true;
  if (!firstTime && grid[row][col] >= testValue) return false;

  return walkLeft(grid, row, col - 1, testValue, false);
}

const walkRight = (grid, row, col, testValue, firstTime) => {
  if (col === grid[0].length) return true;
  if (!firstTime && grid[row][col] >= testValue) return false;

  return walkRight(grid, row, col + 1, testValue, false);
}

const walkUp = (grid, row, col, testValue, firstTime) => {
  if (row === -1) return true;
  if (!firstTime && grid[row][col] >= testValue) return false;

  return walkUp(grid, row - 1, col, testValue, false);
}

const walkDown = (grid, row, col, testValue, firstTime) => {
  if (row === grid.length) return true;
  if (!firstTime && grid[row][col] >= testValue) return false;

  return walkDown(grid, row + 1, col, testValue, false);
}

const day8b = () => {
  // const grid = readGrid('./data/day8test.txt');
  const grid = readGrid('./data/day8.txt');
  const numRows = grid.length;
  const numCols = grid[0].length;

  let maxScore = 0;
  
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const testValue = grid[row][col];
      
      let leftScore = lookLeft(grid, row, col, testValue, true);
      let rightScore = lookRight(grid, row, col, testValue, true);
      let upScore = lookUp(grid, row, col, testValue, true);
      let downScore = lookDown(grid, row, col, testValue, true);
      let sceneryScore = leftScore * rightScore * upScore * downScore;
      // console.log(row, col, leftScore, rightScore, upScore, downScore, sceneryScore);
      maxScore = Math.max(maxScore, sceneryScore);
    }
  }

  console.log('day8b result = ', maxScore);
}

const lookLeft = (grid, row, col, testValue, firstTime) => {
  if (col === -1) return -1;
  if (!firstTime && grid[row][col] >= testValue) return 0;
    
  let score = 0;
  score = 1 + lookLeft(grid, row, col - 1, testValue, false);
  return score;
}

const lookRight = (grid, row, col, testValue, firstTime) => {
  if (col === grid[0].length) return -1;
  if (!firstTime && grid[row][col] >= testValue) return 0;

  let score = 0;
  score = 1 + lookRight(grid, row, col + 1, testValue, false);
  return score;
}

const lookUp = (grid, row, col, testValue, firstTime) => {
  if (row === -1) return -1;
  if (!firstTime && grid[row][col] >= testValue) return 0;

  let score = 0;
  score = 1 + lookUp(grid, row-1, col, testValue, false);
  return score;
}

const lookDown = (grid, row, col, testValue, firstTime) => {
  if (row === grid.length) return -1;
  if (!firstTime && grid[row][col] >= testValue) return 0;

  let score = 0;
  score = 1 + lookDown(grid, row+1, col, testValue, false);
  return score;
}

// returns 2d array.
const readGrid = (filename) => {
  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const grid = [];
  instructions.forEach(line => {
    grid.push(line.split('').map(d => +d));
  });

  // console.log(grid);
  return grid;
}

module.exports = { day8a, day8b };