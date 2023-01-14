const fs = require('fs');

// Sabqponm
// abcryxxl 
// accszExk
// acctuvwj
// abdefghi

const day12a = () => {
  // const filename = './data/day12test.txt'; // [0,0] => [2,5] 31
  const filename = './data/day12.txt'; // [20,0] -> [20, 138] 534
  const [startPt, endPt, grid] = readGrid(filename);
  const displayGrid = JSON.parse(JSON.stringify(grid));
  const answer = bfs(startPt, endPt, grid, displayGrid);
  
  console.log('day12a = ', answer);
}

const day12b = () => {
  let minDistance = Infinity;
  // const filename = './data/day12test.txt'; // 29
  const filename = './data/day12.txt'; // 
  const [_u, endPt, grid] = readGrid(filename);
  const displayGrid = JSON.parse(JSON.stringify(grid));

  // find all the 'a'.
  const numOfRows = grid.length;
  const numOfCols = grid[0].length;
  for (let r = 0; r < numOfRows; r++) {
    for (let c = 0; c < numOfCols; c++) {
      if (grid[r][c] === 'a') {
        let distance = bfs([r,c], endPt, grid, displayGrid);
        minDistance = Math.min(minDistance, distance);
      }
    }
  }
  
  
  console.log('day12b = ', minDistance);
}

const getKey = (pt) => {
  return `${pt[0]}-${pt[1]}`;
}

const bfs = (start, end, grid, displayGrid) => {
  const numCells = grid.length * grid[0].length;
  const visited = new Set();
  const queue = [[start, 0]];
  visited.add(getKey(start));
  
  let newPt;
  while (queue.length > 0) {
    const [pt, steps] = queue.shift();
    const [row, col] = pt;
    displayGrid[row][col] = ' ';
    if (row === end[0] && col === end[1]) {
      return steps;
    }

    let isDeadEnd = true;
    const neighbors = [[row, col-1], [row, col+1], [row-1, col], [row+1, col]];
    for (let newPt of neighbors) {      
      if (!visited.has(getKey(newPt)) && canMove(pt, newPt, grid)) {
        isDeadEnd = false;
        visited.add(getKey(newPt));
        queue.push([newPt, steps + 1]);
      }
    }

    // if (isDeadEnd) {
    //   prettyPrint(displayGrid);
    // }
   }

  return Infinity; // not-found
}

const canMove = (curr, target, grid) => {

  const numOfRows = grid.length;
  const numOfCols = grid[0].length;
  const [r, c] = curr;
  const [tr, tc] = target;

  if (tr < 0 || tr >= numOfRows) return false;
  if (tc < 0 || tc >= numOfCols) return false;

  const delta = grid[tr][tc].charCodeAt(0) - grid[r][c].charCodeAt(0);
  if (delta <= 1) return true;

  return false;
}

const readGrid = (filename) => {

  // Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');
  
  let row = 0;
  let startPt, endPt;
  const grid = [];
  for (const line of lines) {
    const arr = line.split('').map(v => {
      if (v === 'S') {
        let col = line.indexOf(v);
        startPt = [row, col];
        v = 'a';
      } else if (v === 'E') {
        let col = line.indexOf(v);
        endPt = [row, col];
        v = 'z';
      }
      return v;
    });
    grid.push(arr);

    row += 1;
  }

  return [startPt, endPt, grid];
}

prettyPrint = (grid) => {
  for (const line of grid) {
    console.log(line.join(''));
  }
}

module.exports = { day12a, day12b };