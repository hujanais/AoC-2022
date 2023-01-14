const fs = require('fs');

const COLWIDTH = 7;

const day17a = () => {
  // const filename = './data/day17test.txt';  // 3068
  const filename = './data/day17.txt'; // 3124
  const line = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const windArr = line.split('');
  let startPt = [0, 0];
  let idx = 0;
  let floorTerrain = [0, 0, 0, 0, 0, 0, 0];

  let grid = [['o', 'o', 'o', 'o', 'o', 'o', 'o']];

  // 2022
  for (let round = 0; round < 2022; round++) {
    // reset the startpt based on the new floor.
    let shape;
    let rowBase;
    let rowMax = 0;
    // get next shape.
    switch (round % 5) {
      case 0:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0];
        grid = grid.slice(0, rowMax + 1);
        shape = new HLine(startPt, grid, floorTerrain);
        break;
      case 1:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [5 + rowBase, 2];
        rowMax = startPt[0] + 2;
        grid = grid.slice(0, rowMax + 1);
        shape = new Cross(startPt, grid, floorTerrain);
        break;
      case 2:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 2;
        grid = grid.slice(0, rowMax + 1);
        shape = new L(startPt, grid, floorTerrain);
        break;
      case 3:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 3;
        grid = grid.slice(0, rowMax + 1);
        shape = new VLine(startPt, grid, floorTerrain);
        break;
      case 4:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 1;
        grid = grid.slice(0, rowMax + 1);
        shape = new Box(startPt, grid, floorTerrain);
        break;
    }

    // console.log(startPt);

    // play
    let isCanMove = false;
    do {
      const wind = windArr[idx];
      idx += 1;
      if (idx === windArr.length) {
        idx = 0;
      }
      if (wind === '>') {
        shape.stepRight();
      } else {
        shape.stepLeft();
      }
      isCanMove = shape.stepDown();
    } while (isCanMove);

    shape.end();
  }

  console.log(floorTerrain.join());
  prettyPrint(grid);

  const answer = Math.max(...floorTerrain);
  console.log('day17a = ', answer);
}

const day17b = () => {
  // const filename = './data/day17test.txt';  // 3068
  const filename = './data/day17.txt'; // 3124
  const line = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const windArr = line.split('');
  let startPt = [0, 0];
  let idx = 0;
  let height = 1;
  let floorTerrain = [0, 0, 0, 0, 0, 0, 0];

  let grid = [['o', 'o', 'o', 'o', 'o', 'o', 'o']];
  let lastCheckedRow = 0;

  // 2022
  // 1000000000000
  for (let round = 0; round < 5; round++) {
    // reset the startpt based on the new floor.
    let shape;
    let rowBase;
    let rowMax = 0;
    // get next shape.
    switch (round % 5) {
      case 0:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0];
        grid = grid.slice(0, rowMax + 1);
        shape = new HLine(startPt, grid, floorTerrain);
        break;
      case 1:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [5 + rowBase, 2];
        rowMax = startPt[0] + 2;
        grid = grid.slice(0, rowMax + 1);
        shape = new Cross(startPt, grid, floorTerrain);
        break;
      case 2:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 2;
        grid = grid.slice(0, rowMax + 1);
        shape = new L(startPt, grid, floorTerrain);
        break;
      case 3:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 3;
        grid = grid.slice(0, rowMax + 1);
        shape = new VLine(startPt, grid, floorTerrain);
        break;
      case 4:
        grid.push(...[['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.']]);
        rowBase = Math.max(...floorTerrain);
        startPt = [4 + rowBase, 2];
        rowMax = startPt[0] + 1;
        grid = grid.slice(0, rowMax + 1);
        shape = new Box(startPt, grid, floorTerrain);
        break;
    }

    // play
    let isCanMove = false;
    do {
      const wind = windArr[idx];
      idx += 1;
      if (idx === windArr.length) {
        idx = 0;
      }
      if (wind === '>') {
        shape.stepRight();
      } else {
        shape.stepLeft();
      }
      isCanMove = shape.stepDown();
    } while (isCanMove);

    shape.end();

    // look for the lowest rock and throw everything underneath.
    let optimize = false;
    const newFloorLevel = Math.min(...floorTerrain);
    
    if (!optimize) {
      prettyPrint(grid);
      const peak = Math.max(...floorTerrain);
      console.log(lastCheckedRow, peak);
      lastCheckedRow = peak;
      // for (let i = lastCheckedRow; i < peak)
      // if (round > 356) {
      //   console.log(round, floorTerrain.join(','), Math.max(...floorTerrain));
      //   prettyPrint(grid.slice(530));
      // }
    } else
      if (newFloorLevel > 0) {
        height += newFloorLevel - 1;
        grid = grid.slice(newFloorLevel);
        grid.unshift(['o', 'o', 'o', 'o', 'o', 'o', 'o']);  // keeping the lower bound intact.
        floorTerrain = floorTerrain.map(l => l - newFloorLevel + 1);
        if (round > 356) {
          const answer = Math.max(...floorTerrain) + height;
          console.log(round, height, floorTerrain.join(','), answer);
          prettyPrint(grid);
        }
      }
  }

  const answer = Math.max(...floorTerrain) + height;
  console.log('day17b = ', answer);
}

// #### [0,1,2,3]
class HLine {
  constructor(lowerLeftPt, grid, floorTerrain) {
    const [r, c] = lowerLeftPt;
    this.arr = [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]];
    this.grid = grid;
    this.floorTerrain = floorTerrain;
  }

  stepLeft() {
    const [r, c] = this.arr[0];
    if (c === 0 || this.grid[r][c - 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] - 1]);
    return true;
  }

  stepRight() {
    const [r, c] = this.arr[3];
    if (c === COLWIDTH - 1 || this.grid[r][c + 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] + 1]);
    return true;
  }

  stepDown() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];
    if (r0 === 0 || r1 === 0 || r2 === 0 || r3 === 0) return false;
    if (this.grid[r0 - 1][c0] === 'o') return false;
    if (this.grid[r1 - 1][c1] === 'o') return false;
    if (this.grid[r2 - 1][c2] === 'o') return false;
    if (this.grid[r3 - 1][c3] === 'o') return false;

    this.arr = this.arr.map(pt => [pt[0] - 1, pt[1]]);
    return true;
  }

  // update the grid and update the floor terrain.
  end() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    this.grid[r0][c0] = 'o';
    this.grid[r1][c1] = 'o';
    this.grid[r2][c2] = 'o';
    this.grid[r3][c3] = 'o';

    this.floorTerrain[c0] = Math.max(this.floorTerrain[c0], r0);
    this.floorTerrain[c1] = Math.max(this.floorTerrain[c1], r1);
    this.floorTerrain[c2] = Math.max(this.floorTerrain[c2], r2);
    this.floorTerrain[c3] = Math.max(this.floorTerrain[c3], r3);
  }

  toString() {
    return this.arr;
  }
}

/*
# [3]
# [2]
# [1]
# [0]
*/
class VLine {
  constructor(lowerLeftPt, grid, floorTerrain) {
    const [r, c] = lowerLeftPt;
    this.arr = [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]];
    this.grid = grid;
    this.floorTerrain = floorTerrain;
  }

  stepLeft() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    if (c0 === 0) return false;
    if (this.grid[r0][c0 - 1] === 'o') return false;
    if (this.grid[r1][c1 - 1] === 'o') return false;
    if (this.grid[r2][c2 - 1] === 'o') return false;
    if (this.grid[r3][c3 - 1] === 'o') return false;

    this.arr = this.arr.map(pt => [pt[0], pt[1] - 1]);
    return true;
  }

  stepRight() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    if (c0 === COLWIDTH - 1) return false;
    if (this.grid[r0][c0 + 1] === 'o') return false;
    if (this.grid[r1][c1 + 1] === 'o') return false;
    if (this.grid[r2][c2 + 1] === 'o') return false;
    if (this.grid[r3][c3 + 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] + 1]);
    return true;
  }

  stepDown() {
    const [r0, c0] = this.arr[0];
    if (r0 === 0) return false;
    if (this.grid[r0 - 1][c0] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0] - 1, pt[1]]);
    return true;
  }

  // update the grid and update the floor terrain.
  end() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    this.grid[r0][c0] = 'o';
    this.grid[r1][c1] = 'o';
    this.grid[r2][c2] = 'o';
    this.grid[r3][c3] = 'o';

    this.floorTerrain[c3] = Math.max(this.floorTerrain[c3], r3);
  }

  toString() {
    return this.arr;
  }
}

/*
    [3]
  [0]X[2]  // we don't care about the center point.
    [1]
*/
class Cross {
  constructor(lowerLeftPt, grid, floorTerrain) {
    const [r, c] = lowerLeftPt;
    this.arr = [[r, c], [r - 1, c + 1], [r, c + 2], [r + 1, c + 1]];
    this.grid = grid;
    this.floorTerrain = floorTerrain;
  }

  stepLeft() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r3, c3] = this.arr[3];

    if (c0 === 0) return false;
    if (this.grid[r0][c0 - 1] === 'o') return false;
    if (this.grid[r1][c1 - 1] === 'o') return false;
    if (this.grid[r3][c3 - 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] - 1]);
    return true;
  }

  stepRight() {
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    if (c2 === COLWIDTH - 1) return false;
    if (this.grid[r1][c1 + 1] === 'o') return false;
    if (this.grid[r2][c2 + 1] === 'o') return false;
    if (this.grid[r3][c3 + 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] + 1]);
    return true;
  }

  stepDown() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    if (r0 === 0 || r1 === 0 || r2 === 0) return false;
    if (this.grid[r0 - 1][c0] === 'o') return false;
    if (this.grid[r1 - 1][c1] === 'o') return false;
    if (this.grid[r2 - 1][c2] === 'o') return false;

    this.arr = this.arr.map(pt => [pt[0] - 1, pt[1]]);
    return true;
  }

  // update the grid and update the floor terrain.
  end() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    this.grid[r0][c0] = 'o';
    this.grid[r1][c1] = 'o';
    this.grid[r2][c2] = 'o';
    this.grid[r3][c3] = 'o';

    this.floorTerrain[c0] = Math.max(this.floorTerrain[c0], r0);
    this.floorTerrain[c2] = Math.max(this.floorTerrain[c2], r2);
    this.floorTerrain[c3] = Math.max(this.floorTerrain[c3], r3);
  }

  toString() {
    return this.arr;
  }
}

/*
  [2][3]
  [0][1]
*/
class Box {
  constructor(lowerLeftPt, grid, floorTerrain) {
    const [r, c] = lowerLeftPt;
    this.arr = [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]];
    this.grid = grid;
    this.floorTerrain = floorTerrain;
  }

  stepLeft() {
    const [r0, c0] = this.arr[0];
    const [r2, c2] = this.arr[2];
    if (c0 === 0) return false;
    if (this.grid[r0][c0 - 1] === 'o') return false;
    if (this.grid[r2][c2 - 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] - 1]);
    return true;
  }

  stepRight() {
    const [r1, c1] = this.arr[1];
    const [r3, c3] = this.arr[3];
    if (c1 === COLWIDTH - 1) return false;
    if (this.grid[r1][c1 + 1] === 'o') return false;
    if (this.grid[r3][c3 + 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] + 1]);
    return true;
  }

  stepDown() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    if (r0 === 0 || r1 === 0) return false;
    if (this.grid[r0 - 1][c0] === 'o') return false;
    if (this.grid[r1 - 1][c1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0] - 1, pt[1]]);
    return true;
  }

  // update the grid and update the floor terrain.
  end() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];

    this.grid[r0][c0] = 'o';
    this.grid[r1][c1] = 'o';
    this.grid[r2][c2] = 'o';
    this.grid[r3][c3] = 'o';

    this.floorTerrain[c2] = Math.max(this.floorTerrain[c2], r2);
    this.floorTerrain[c3] = Math.max(this.floorTerrain[c3], r3);
  }

  toString() {
    return this.arr;
  }
}

/*
      #        [4]
      #        [3]
    ###  [0][1][2]
*/
class L {
  constructor(lowerLeftPt, grid, floorTerrain) {
    const [r, c] = lowerLeftPt;
    this.arr = [[r, c], [r, c + 1], [r, c + 2], [r + 1, c + 2], [r + 2, c + 2]];
    this.grid = grid;
    this.floorTerrain = floorTerrain;
  }

  stepLeft() {
    const [r0, c0] = this.arr[0];
    const [r3, c3] = this.arr[3];
    const [r4, c4] = this.arr[4];
    if (c0 === 0) return false;
    if (this.grid[r0][c0 - 1] === 'o') return false;
    if (this.grid[r3][c3 - 1] === 'o') return false;
    if (this.grid[r4][c4 - 1] === 'o') return false;
    this.arr = this.arr.map(pt => [pt[0], pt[1] - 1]);
    return true;
  }
  stepRight() {
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];
    const [r4, c4] = this.arr[4];
    if (c4 === COLWIDTH - 1) return false;
    if (this.grid[r2][c2 + 1] === 'o') return false;
    if (this.grid[r3][c3 + 1] === 'o') return false;
    if (this.grid[r4][c4 + 1] === 'o') return false;

    this.arr = this.arr.map(pt => [pt[0], pt[1] + 1]);
    return true;
  }
  stepDown() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    if (r0 === 0 || r1 === 0 || r2 === 0) return false;
    if (this.grid[r0 - 1][c0] === 'o') return false;
    if (this.grid[r1 - 1][c1] === 'o') return false;
    if (this.grid[r2 - 1][c2] === 'o') return false;

    this.arr = this.arr.map(pt => [pt[0] - 1, pt[1]]);
    return true;
  }

  // update the grid and update the floor terrain.
  end() {
    const [r0, c0] = this.arr[0];
    const [r1, c1] = this.arr[1];
    const [r2, c2] = this.arr[2];
    const [r3, c3] = this.arr[3];
    const [r4, c4] = this.arr[4];

    this.grid[r0][c0] = 'o';
    this.grid[r1][c1] = 'o';
    this.grid[r2][c2] = 'o';
    this.grid[r3][c3] = 'o';
    this.grid[r4][c4] = 'o';

    this.floorTerrain[c0] = Math.max(this.floorTerrain[c0], r0);
    this.floorTerrain[c1] = Math.max(this.floorTerrain[c1], r1);
    this.floorTerrain[c4] = Math.max(this.floorTerrain[c4], r4);
  }

  toString() {
    return this.arr;
  }
}

prettyPrint = (grid) => {
  for (let idx = grid.length - 1; idx >= 0; idx--) {
    console.log(grid[idx].join(''));
  }
  console.log('');
}

module.exports = { day17a, day17b };