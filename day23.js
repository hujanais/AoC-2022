const fs = require('fs');

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;
const SEARCHDIRS = [NORTH, SOUTH, WEST, EAST];


const day23a = () => {
  // const filename = './data/day23test.txt'; // 110
  const filename = './data/day23.txt'; // 3925
  let cells = buildGrid(filename);

  // prettyPrint(cells);

  let direction = NORTH;

  proposedMap = new Map();
  for (let round = 0; round < 10; round++) {
    direction = SEARCHDIRS[round % 4];
    proposedMap.clear();

    // generate the proposed move
    for (let cell of cells) {
      if (cell.propose(cells, direction)) {
        // console.log(`propose ${cell.id} : [${cell.row}-${cell.col}] to [${cell.newPos}]. ${direction}`);
        const newKey = key(cell.newPos);
        if (!proposedMap.has(newKey)) {
          proposedMap.set(newKey, 1);
        } else {
          proposedMap.set(newKey, proposedMap.get(newKey) + 1);
        }
      }
    }

    // do the move.
    for (let cell of cells) {
      if (cell.canMove && proposedMap.get(key(cell.newPos)) === 1) {
        cell.move();
      }
    }

    // prettyPrint(cells);
  }

  // prettyPrint(cells);

  // calculate the empty space.
  const minRow = Math.min(...cells.map((c) => c.row));
  const maxRow = Math.max(...cells.map((c) => c.row));
  const minCol = Math.min(...cells.map((c) => c.col));
  const maxCol = Math.max(...cells.map((c) => c.col));

  const totalSpaces = (maxRow - minRow + 1) * (maxCol - minCol + 1);
  console.log(`day23a = ${totalSpaces} - ${cells.length} = ${totalSpaces - cells.length}`);
}

// this takes several minutes to complete.
const day23b = () => {
   // const filename = './data/day23test.txt'; // 20
  const filename = './data/day23.txt'; // 903
  let cells = buildGrid(filename);

  // prettyPrint(cells);

  let direction = NORTH;

  proposedMap = new Map();
  for (let round = 0; round < 1000; round++) {
    direction = SEARCHDIRS[round % 4];
    proposedMap.clear();

    // generate the proposed move
    for (let cell of cells) {
      if (cell.propose(cells, direction)) {
        // console.log(`propose ${cell.id} : [${cell.row}-${cell.col}] to [${cell.newPos}]. ${direction}`);
        const newKey = key(cell.newPos);
        if (!proposedMap.has(newKey)) {
          proposedMap.set(newKey, 1);
        } else {
          proposedMap.set(newKey, proposedMap.get(newKey) + 1);
        }
      }
    }

    // do the move.
    let hasMoves = false;
    for (let cell of cells) {
      if (cell.canMove && proposedMap.get(key(cell.newPos)) === 1) {
        hasMoves = true;
        cell.move();
      }
    }

    if (!hasMoves) {
      console.log('day23b = ', round + 1);
      return;
    }
    
    // prettyPrint(cells);
  }

  console.log('day23b failed to find solution');
}

const prettyPrint = (cells) => {
  const minRow = Math.min(...cells.map((c) => c.row));
  const maxRow = Math.max(...cells.map((c) => c.row));
  const minCol = Math.min(...cells.map((c) => c.col));
  const maxCol = Math.max(...cells.map((c) => c.col));

  const grid = [];
  for (let r = minRow; r <= maxRow; r++) {
    grid.push(Array.from(Array(maxCol - minCol + 1)).map((i) => '.'));
  }

  cells.forEach((v) => {
    grid[v.row - minRow][v.col - minCol] = '#';
  });

  grid.forEach((line) => {
    console.log(line.join(''));
  });

  console.log();
};

const buildGrid = (filename) => {
  const cells = [];

  let arr = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');

  for (let row = 0; row < arr.length; row++) {
    for (let col = 0; col < arr[row].length; col++) {
      if (arr[row][col] === '#') {
        cells.push(new Cell(row, col, arr[row][col]));
      }
    }
  }

  return cells;
};

module.exports = { day23a, day23b };

const key = (pos) => {
  return pos.join('-');
};

class Cell {
  constructor(row, col, char) {
    this.row = row;
    this.col = col;
    this.char = char;

    this.canMove = false;
    // the proposed move position
    this.newPos = [0, 0];
  }

  propose = (cells, direction) => {
    this.canMove = false;

    // condition 1.  no neighbor, no moving.
    const dN = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let [dr, dc] of dN) {
      if (cells.find((c) => c.row === this.row + dr && c.col === this.col + dc)) {
        this.canMove = true;
        break;
      }
    }
    if (!this.canMove) return false;

    // condition 2.
    for (let dir = direction; dir < direction + 4; dir++) {
      switch (dir % 4) {
        case NORTH:
          if (
            !cells.find(
              (c) =>
                (c.row === this.row - 1 && c.col === this.col - 1) ||
                (c.row === this.row - 1 && c.col === this.col) ||
                (c.row === this.row - 1 && c.col === this.col + 1)
            )
          ) {
            this.canMove = true;
            this.newPos = [this.row - 1, this.col];
            return true;
          }
          break;
        case SOUTH:
          if (
            !cells.find(
              (c) =>
                (c.row === this.row + 1 && c.col === this.col - 1) ||
                (c.row === this.row + 1 && c.col === this.col) ||
                (c.row === this.row + 1 && c.col === this.col + 1)
            )
          ) {
            this.canMove = true;
            this.newPos = [this.row + 1, this.col];
            return true;
          }
          break;
        case EAST:
          if (
            !cells.find(
              (c) =>
                (c.row === this.row - 1 && c.col === this.col + 1) ||
                (c.row === this.row && c.col === this.col + 1) ||
                (c.row === this.row + 1 && c.col === this.col + 1)
            )
          ) {
            this.canMove = true;
            this.newPos = [this.row, this.col + 1];
            return true;
          }
          break;
        case WEST:
          if (
            !cells.find(
              (c) =>
                (c.row === this.row - 1 && c.col === this.col - 1) ||
                (c.row === this.row && c.col === this.col - 1) ||
                (c.row === this.row + 1 && c.col === this.col - 1)
            )
          ) {
            this.canMove = true;
            this.newPos = [this.row, this.col - 1];
            return true;
          }
          break;
      }
    }

    this.canMove = false;
    return false;
  };

  move = () => {
    this.row = this.newPos[0];
    this.col = this.newPos[1];
    this.canMove = false;
  };
}