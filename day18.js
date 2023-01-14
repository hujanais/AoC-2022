const fs = require('fs');

class Box {
  constructor(x, y, z) {
    this.x0 = x;
    this.y0 = y;
    this.z0 = z;
    this.x1 = x + 1;
    this.y1 = y + 1;
    this.z1 = z + 1;
  }
}

const day18a = () => {
  // const filename = './data/day18test.txt';     // 64
  const filename = './data/day18.txt';      // 4548
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const boxes = [];
  lines.forEach(line => {
    const box = line.split(',').map(v => +v);
    boxes.push(box);
  });

  const xArr = boxes.map(b => b[0]);
  const yArr = boxes.map(b => b[1]);
  const zArr = boxes.map(b => b[2]);
  const minX = Math.min(...xArr);
  const maxX = Math.max(...xArr);
  const minY = Math.min(...yArr);
  const maxY = Math.max(...yArr);
  const minZ = Math.min(...zArr);
  const maxZ = Math.max(...zArr);

  const graph3d = [];
  for (let z = minZ; z <= maxZ; z++) {
    const square = [];
    for (let x = minX; x <= maxX; x++) {
      square.push(Array.from(Array(maxY - minY + 1).keys()).map(v => '.'));
    }

    graph3d.push(square);
  }

  boxes.forEach(box => {
    const [x, y, z] = box;
    graph3d[z - minZ][x - minX][y - minY] = 'o'
  });

  const numZ = maxZ - minZ + 1;
  const numY = maxY - minY + 1;
  const numX = maxX - minX + 1;

  let surfaces = 0;
  for (let z = 0; z < numZ; z++) {
    for (let y = 0; y < numY; y++) {
      for (let x = 0; x < numX; x++) {
        const deltas = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
        if (graph3d[z][x][y] === 'o') {
          surfaces += 6;
          for (let [dx, dy, dz] of deltas) {
            let newX = x + dx;
            let newY = y + dy;
            let newZ = z + dz;
            if (isInBounds(newX, newY, newZ, numX, numY, numZ) && graph3d[newZ][newX][newY] === 'o') {
              surfaces -= 1;
            }
          }
        }
      }
    }
  }

  console.log('day18a = ', surfaces);
}

const isInBounds = (x, y, z, numX, numY, numZ) => {
  if (x < 0 || (x === numX)) return false;
  if (y < 0 || (y === numY)) return false;
  if (z < 0 || (z === numZ)) return false;
  return true;
};

const key = (x, y, z) => `${x}-${y}-${z}`

const day18b = () => {
  // const filename = './data/day18test.txt';     // 64 - 6 = 58
  const filename = './data/day18.txt';      // 2588 // 4548 - 2186 = 2362  // too low
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const boxes = [];
  lines.forEach(line => {
    const box = line.split(',').map(v => +v);
    boxes.push(box);
  });

  const xArr = boxes.map(b => b[0]);
  const yArr = boxes.map(b => b[1]);
  const zArr = boxes.map(b => b[2]);
  const minX = Math.min(...xArr);
  const maxX = Math.max(...xArr);
  const minY = Math.min(...yArr);
  const maxY = Math.max(...yArr);
  const minZ = Math.min(...zArr);
  const maxZ = Math.max(...zArr);

  const graph3d = [];
  for (let z = minZ; z <= maxZ; z++) {
    const square = [];
    for (let x = minX; x <= maxX; x++) {
      square.push(Array.from(Array(maxY - minY + 1).keys()).map(v => '.'));
    }

    graph3d.push(square);
  }

  boxes.forEach(box => {
    const [x, y, z] = box;
    graph3d[z - minZ][x - minX][y - minY] = 'o'
  });

  const numZ = maxZ - minZ + 1;
  const numY = maxY - minY + 1;
  const numX = maxX - minX + 1;
  
  // get the number of air pockets surfaces
  let surfaces = 0;
  for (let z = 0; z < numZ; z++) {
    for (let y = 0; y < numY; y++) {
      for (let x = 0; x < numX; x++) {
        const deltas = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
        if (graph3d[z][x][y] === 'o') {
          surfaces += 6;
          for (let [dx, dy, dz] of deltas) {
            let newX = x + dx;
            let newY = y + dy;
            let newZ = z + dz;
            if (isInBounds(newX, newY, newZ, numX, numY, numZ)) {
              if (graph3d[newZ][newX][newY] === 'o') {
              surfaces -= 1;
              } else {
                // check to see if this void is not an air pocket.
                if (dfs(newX, newY, newZ, graph3d, numX, numY, numZ) === true) {
                  // if an air pocket, don't count this surface
                  surfaces -= 1;
                }
              }
            }
          }
        }
      }
    }
  }

  console.log('day 18b = ', surfaces);
}

// check if in an air pocket.
const dfs = (x,y,z,grid,numX,numY,numZ,visited=new Set()) => {
  const isEdgeX = (x === 0 || x === (numX - 1));
  const isEdgeY = (y === 0 || y === (numY - 1));
  const isEdgeZ = (z === 0 || z === (numZ - 1));
  if (isEdgeX || isEdgeY || isEdgeZ) return false;
  
  const deltas = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  
  for (let [dx, dy, dz] of deltas) {
    let newX = x + dx;
    let newY = y + dy;
    let newZ = z + dz;

    if (isInBounds(newX, newY, newZ, numX, numY, numZ) 
        && grid[newZ][newX][newY] === '.' 
        && !visited.has(key(newX, newY, newZ))) {
          visited.add(key(newX, newY, newZ));
          if (dfs(newX, newY, newZ, grid, numX, numY, numZ, visited) === false) return false;             }
  }
  
  return true;
}

module.exports = { day18a, day18b };