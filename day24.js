const fs = require('fs');

const day24a = () => {
  const filename = './data/day24test.txt';  // 18
  // const filename = './data/day24.txt';         // 373
  const grid = buildGrid(filename);
  const frames = buildFrames(grid);

  const nRows = grid.length;
  const nCols = grid[0].length;
  let start = [0, grid[0].findIndex(c => c.displayValue() === '.')];
  const target = [nRows - 1, grid[nRows - 1].findIndex(c => c.displayValue() === '.')];

  // for (let round = 0; round < frames.length; round++) {
  //   const grid = frames[round % frames.length];
  //   prettyPrint(grid, nRows, nCols, start);
  // }

  // prettyPrint(grid, nRows, nCols, start);
  // console.log(start, target, nRows, nCols);

  const [round, steps] = bfs(start, target, 0, frames);
  console.log('day24a = ', steps);
}

const day24b = () => {
  // const filename = './data/day24test.txt';  // 54
  const filename = './data/day24.txt';
  const grid = buildGrid(filename);
  const frames = buildFrames(grid);

  const nRows = grid.length;
  const nCols = grid[0].length;
  let start = [0, grid[0].findIndex(c => c.displayValue() === '.')];
  const target = [nRows - 1, grid[nRows - 1].findIndex(c => c.displayValue() === '.')];

  // console.log(start, target, nRows, nCols);

  let [round1, steps1] = bfs(start, target, 0, frames);
  let [round2, steps2] = bfs(target, start, round1 % frames.length, frames);
  let [round3, steps3] = bfs(start, target, round2 % frames.length, frames);

  console.log('day24b = ', steps1, steps2, steps3, steps1 + steps2 + steps3);
}

const key = (state) => JSON.stringify(state)

const MAXROUNDS = 1000;

const bfs = (src, target, frameStartIdx, frames) => {
  const bfsKey = (r, c, round) => `${r}-${c}-${round}`;

  visited = new Set();
  let grid = frames[0];
  const nRows = grid.length;
  const nCols = grid[0].length;
  const queue = [[frameStartIdx, src, 0]];

  while (queue.length > 0) {
    const [round, src, steps] = queue.shift();

    grid = frames[round % frames.length];
    // console.log(round, src, target);
    // prettyPrint(grid, nRows, nCols, src);

    const [sr, sc] = src;
    const [tr, tc] = target;

    // for debugging.
    if (grid[sr][sc].displayValue() !== '.') {
      console.log(steps, src, grid[sr][sc].displayValue());
      prettyPrint(grid, nRows, nCols, [0, 1]);
      process.exit();
    }

    if (steps > MAXROUNDS) {
      continue;
    }

    if (sr === tr && sc === tc) {
      return [round, steps];
    }

    grid = frames[(round + 1) % frames.length];
    const scanDirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    let [newR, newC] = [0, 0];
    for (let [dR, dC] of scanDirs) {
      [newR, newC] = [sr + dR, sc + dC];
      if (newR < 0 || newR > nRows - 1) continue;
      if (newC < 0 || newC > nCols - 1) continue;
      if (!visited.has(bfsKey(newR, newC, round % frames.length)) && grid[newR][newC].displayValue() === '.') {
        visited.add(bfsKey(newR, newC, round % frames.length));
        queue.push([round + 1, [newR, newC], steps + 1]);
      }
    }

    if (!visited.has(bfsKey(sr, sc, round % frames.length)) && grid[sr][sc].displayValue() === '.') {
      visited.add(bfsKey(sr, sc, round % frames.length));
      queue.push([round + 1, src, steps + 1]);
    }
  }

  return -1;
};

const step = (grid) => {
  const nRows = grid.length;
  const nCols = grid[0].length;
  const proposedMoves = [];
  for (let r = 1; r < nRows - 1; r++) {
    for (let c = 1; c < nCols - 1; c++) {
      const cell = grid[r][c];
      for (let dir of cell.dirs) {
        let newR, newC;
        switch (dir) {
          case '^':
            newR = cell.r - 1;
            if (newR === 0) { newR = nRows - 2 }
            newC = cell.c;
            proposedMoves.push([[cell.r, cell.c], [newR, newC], dir]);
            break;
          case '>':
            newR = cell.r;
            newC = cell.c + 1;
            if (newC === nCols - 1) { newC = 1 };
            proposedMoves.push([[cell.r, cell.c], [newR, newC], dir]);
            break;
          case '<':
            newR = cell.r;
            newC = cell.c - 1;
            if (newC === 0) { newC = nCols - 2 }
            proposedMoves.push([[cell.r, cell.c], [newR, newC], dir]);
            break;
          case 'v':
            newR = cell.r + 1;
            newC = cell.c;
            if (newR === nRows - 1) { newR = 1 }
            proposedMoves.push([[cell.r, cell.c], [newR, newC], dir]);
            break;
        }
      }
    }
  }

  // commit the move.
  for (const [[pr, pc], [nr, nc], dir] of proposedMoves) {
    grid[pr][pc].subtract(dir);
    grid[nr][nc].add(dir);
  }

}

const stepAgent = (ptr, grid, nRows, nCols) => {
  const scanDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let [newR, newC] = [0, 0];
  for (const [dR, dC] of scanDirs) {
    [newR, newC] = [ptr[0] + dR, ptr[1] + dC];
    if (newR <= 0 || newR > nRows - 1) continue;
    if (newC <= 0 || newC > nCols - 1) continue;
    if (grid[newR][newC].displayValue() === '.') {
      return [newR, newC];
    }
  }

  return ptr;
}

// the frames are repeating so let's pre-save the frames.
const buildFrames = (grid) => {
  const frames = [];
  const frameDict = new Set();
  for (let round = 0; round < 10000; round++) {
    if (frameDict.has(key(grid))) {
      break;
    } else {
      frames.push(cloneGrid(grid));
      frameDict.add(key(grid));
    }

    step(grid);
  }

  return frames;
}

const buildGrid = (filename) => {
  const grid = [];

  let arr = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');
  for (let row = 0; row < arr.length; row++) {
    grid.push([]);
    for (let col = 0; col < arr[0].length; col++) {
      grid[row].push(new Cell(row, col, arr[row][col]));
    }
  }
  return grid;
}

const prettyPrint = (grid, nRows, nCols, agentPtr) => {
  const displayGrid = [];
  for (let r = 0; r < nRows; r++) {
    displayGrid.push(Array.from(Array(nCols).keys()).map(i => '.'));
  }

  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      displayGrid[r][c] = grid[r][c].displayValue();
    }
  }

  // overlay the agent position
  const [agentRow, agentCol] = agentPtr;
  displayGrid[agentRow][agentCol] = 'E';

  displayGrid.forEach(line => {
    console.log(line.join(''));
  });

  console.log();
}

const cloneGrid = (grid) => {
  const newGrid = [];
  for (let row = 0; row < grid.length; row++) {
    newGrid.push([]);
    for (let col = 0; col < grid[0].length; col++) {
      const newCell = new Cell(row, col, '.');
      newCell.dirs = [...grid[row][col].dirs];
      newGrid[row].push(newCell)
    }
  }

  return newGrid;
}

class Cell {
  constructor(r, c, dir) {
    this.r = r;
    this.c = c;

    // only allow valid directions to be added.
    if (['^', 'v', '<', '>', '#'].includes(dir)) {
      this.dirs = [dir];
    } else {
      this.dirs = [];
    }
  }

  displayValue = () => {
    if (this.dirs.length === 0) {
      return '.';
    }
    if (this.dirs.length === 1) {
      return this.dirs[0];
    } else {
      return this.dirs.length;
    }
  }

  isVaccant = () => {
    for (let c of ['^', 'v', '<', '>']) {
      if (this.dirs.includes(c)) {
        return false;
      }
    }

    return true;
  }

  subtract = (newDir) => {
    const idx = this.dirs.indexOf(newDir);
    if (idx >= 0) {
      this.dirs = [...this.dirs.slice(0, idx), ...this.dirs.slice(idx + 1)];
    }
  }

  add = (newDir) => {
    this.dirs.push(newDir);
  }
}

module.exports = { day24a, day24b }