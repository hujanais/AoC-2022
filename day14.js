const fs = require('fs');

const CONTINUE = 'continue';
const OVERFLOW = 'overflow';
const FUBAR = 'FUBAR';

const day14a = () => {
  // const filename = './data/day14test.txt';   // 24
  const filename = './data/day14.txt';          // 808
  const [cs, ce, grid] = createGrid(filename);
  
  // The sand is pouring into the cave from point 500,0
  const sandStartRow = 0
  const sandStartCol = 500;
  
  let step = 1;
  let result, r, c;
  while (true) {
    [result, [r, c]] = exp(sandStartRow, sandStartCol, grid);
    grid[r][c] = 'o';
    
    if (result === OVERFLOW) break;
    if (result === FUBAR) {
      // something wrong!
      console.log(result);
      prettyPrint(grid);
      break;
    }
    step += 1;
  }

  console.log('day14a = ', step - 1);
  
}

const exp = (r, c, grid) => {  
  // overflow state when sand gets to the last row.
  const extrarows = 2;  // this is the last 2 rows added for question b.
  if (r === grid.length-1-extrarows) return [OVERFLOW, [r,c]];
  
  // dead-end state
  if (grid[r + 1][c - 1] !== '.' &&
    grid[r + 1][c] !== '.' &&
    grid[r + 1][c + 1] !== '.') return [CONTINUE, [r, c]];

  
  if (grid[r + 1][c] === '.') {
    return (exp(r + 1, c, grid));
  } else if (grid[r + 1][c - 1] === '.') {
    return (exp(r + 1, c - 1, grid));
  } else if (grid[r + 1][c + 1] === '.') {
    return (exp(r + 1, c + 1, grid));
  }
 
  return false;
}

const expB = (r, c, grid) => {

  // base-case
  if (grid[0][500] !== '.') return [OVERFLOW, [r,c]];
  
  // dead-end state
  if (grid[r + 1][c - 1] !== '.' &&
    grid[r + 1][c] !== '.' &&
    grid[r + 1][c + 1] !== '.') return [CONTINUE, [r, c]];

  
  if (grid[r + 1][c] === '.') {
    return (expB(r + 1, c, grid));
  } else if (grid[r + 1][c - 1] === '.') {
    return (expB(r + 1, c - 1, grid));
  } else if (grid[r + 1][c + 1] === '.') {
    return (expB(r + 1, c + 1, grid));
  }
 
  return false;
}

const day14b = () => {
  // const filename = './data/day14test.txt';    // 93
  const filename = './data/day14.txt';           // 26625
  const [cs, ce, grid] = createGrid(filename);

  // The sand is pouring into the cave from point 500,0
  const sandStartRow = 0
  const sandStartCol = 500;
  
  let step = 1;
  let result, r, c;
  while (true) {
    [result, [r, c]] = expB(sandStartRow, sandStartCol, grid);
    grid[r][c] = 'o';
    // prettyPrint(grid, cs-1, ce+1);
    if (result === OVERFLOW) break;
    if (result === FUBAR) {
      // something wrong!
      console.log(result);
      prettyPrint(grid);
      break;
    }
    step += 1;
  }

  console.log('day14b = ', step - 1);
}

const createGrid = (filename) => {
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  let cs, ce;
  let minR = Infinity, maxR = 0, minC = Infinity, maxC = 0;
  const arr = [];
  lines.forEach(line => {

    const ptStrs = line.split('->');
    let subArr = [];
    ptStrs.forEach(ptStr => {
      c = +ptStr.split(',')[0];
      r = +ptStr.split(',')[1];

      minR = 0;
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);

      subArr.push([r, c]);
    });
    arr.push(subArr);
  });

  cs = minC;
  ce = maxC;
  
  // increase the row by 2
  // double the width.
  minC = 0;    // set the minimum C to 0
  maxC *= 2;   // increase the width of the column.
  maxR += 2;   // add the 2 extra rows for 2nd question but this will not affect question 1.

 const grid = [];
  for (let row = 0; row <= maxR; row++) {
    // fill the floor.
    if (row === maxR) {
      grid.push(Array(maxC - minC + 1).fill('#'));
    }
    else {
      grid.push(Array(maxC - minC + 1).fill('.'));
    }
  }
  
  // fill the board.
  for (let i = 0; i < arr.length; i++) {
    let [r0, c0] = arr[i][0];
    for (let j = 0; j < arr[i].length - 1; j++) {
      const [r1, c1] = arr[i][j + 1]
      // horizontal
      if (r0 === r1) {
        let cs = Math.min(c0, c1);
        let ce = Math.max(c0, c1);
        for (let y = cs; y <= ce; y++) {
          grid[r0][y - minC] = '#';
        }
      }

      // vertical
      if (c0 === c1) {
        let rs = Math.min(r0, r1);
        let re = Math.max(r0, r1);
        for (let x = rs; x < re; x++) {
          grid[x][c0 - minC] = '#';
        }
      }

      r0 = r1;
      c0 = c1;
    }
  }
  
  return [cs, ce, grid];
  
}

// prints inclusive of [colStart, colEnd]
prettyPrint = (grid, colStart, colEnd) => {
  grid.forEach(row => {
    console.log(row.slice(colStart, colEnd+1).join(''));
  });
}

module.exports = { day14a, day14b }