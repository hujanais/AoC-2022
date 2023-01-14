const fs = require('fs');

const day15a = () => {
  // const filename = './data/day15test.txt';  // 26
  // const targetRow = 10;
  const filename = './data/day15.txt';         // 5461729
  const targetRow = 2000000;
  const arr = buildGridLite(filename);

  // get all the sensors and beacons on the target row.
  const sbSet = new Set();
  for (let item of arr) {
    const sPt = item['sensor'];
    const bPt = item['beacon'];
    if (sPt[0] === targetRow) {
      sbSet.add(key(sPt[0], sPt[1]));
    }
    if (bPt[0] === targetRow) {
      sbSet.add(key(bPt[0], bPt[1]));
    }
  }

  // all deadzones. 
  const deadZones = [];
  for (const item of arr) {
    const [sensorRow, sensorCol] = item['sensor'];
    const manhattanDist = item['manhattanDist'];
    const mD = minDistance(item['sensor'], targetRow);
    if (mD <= manhattanDist) {
      exploreDeadZones([sensorRow, sensorCol], manhattanDist, targetRow, deadZones);
    } else {
      // console.log('skipped this because outside range');
    }
  }

  // deadzones - sensors/beacons on the target row.
  const deadzoneCount = overlap(deadZones);
  console.log('day15a = ', deadzoneCount - sbSet.size);
}

const exploreDeadZones = (sensorPt, manhattanDist, targetRow, deadZones) => {
  const [r, c] = sensorPt;
  const mDist = minDistance(sensorPt, targetRow);
  const delta = manhattanDist - mDist;
  const range = [c - delta, c + delta];
  deadZones.push(range);
}

// find overlapping values in array.
const overlap = (v) => {
  // sort the input by minimums.
  v.sort((a, b) => a[0] - b[0]);
  // console.log(v);

  let [min, max] = v[0];
  for (let i = 1; i < v.length; i++) {
    // console.log(`compare. ${v[i][0]} >= ${min} && ${v[i][0]} <= ${max}`);
    if (v[i][0] >= min && v[i][0] <= max) {
      // console.log(v[i]);
      min = Math.min(min, v[i][0]);
      max = Math.max(max, v[i][1]);
    } else {
      console.log('start new range.  implementation incomplete but luckily not needed');
    }
  }

  // console.log(min, max);
  return max - min + 1; // inclusive of max
}

const minDistance = (pt, targetRow) => {
  return Math.abs(pt[0] - targetRow);
}

const key = (r, c) => {
  return `${r},${c}`;
}

const day15b = () => {
  // const filename = './data/day15test.txt';  // x =14, y = 11 ==> 56000011
  // const maxRange = 20;

  const filename = './data/day15.txt';    // 10621647166538
  const maxRange = 4000000;
  const arr = buildGridLite(filename);
  for (let row = 0; row < maxRange; row++) {
    let segments = [];
    for (let item of arr) {
      const sensorPt = item['sensor'];
      const manhattanDist = item['manhattanDist'];

      let distToRow = minDistance(sensorPt, row);
      let remainingDist = manhattanDist - distToRow;
      if (remainingDist >= 0) {
        let minC = sensorPt[1] - remainingDist;
        let maxC = sensorPt[1] + remainingDist;
        segments.push([minC, maxC]);
      }
    }

    let missingCol = findMissingValue(segments, maxRange);
    if (missingCol >= 0)
    {
      const answer = 4000000 * missingCol + row;
      console.log(`Mystery beacon located at ${row},${missingCol}`);
      console.log('day15b = ', answer);
      return;
    }
    // console.log(row, segments);
  }
}

const findMissingValue = (v, maxRange) => {
  v.sort((a, b) => a[0] - b[0]);
  v.map(segment => {
    if (segment[0] < 0) segment[0] = 0;
    if (segment[1] > maxRange) segment[1] = maxRange;
  });

  let [min, max] = v[0];
  for (let i = 1; i < v.length; i++) {
    // console.log(`compare. ${v[i][0]} >= ${min} && ${v[i][0]} <= ${max}`);
    if (v[i][0] >= min && v[i][0] <= max) {
      // console.log(v[i]);
      min = Math.min(min, v[i][0]);
      max = Math.max(max, v[i][1]);
    } else {
      console.log(`there is a break between ${v[i-1][1]} - ${v[i][0]}`);
      return v[i-1][1] + 1;
    }
  }

  return -1;  // all segments are overlapping.  
}

const calculateManhattanDist = (pt1, pt2) => {
  const dR = Math.abs(pt2[0] - pt1[0]);
  const dC = Math.abs(pt2[1] - pt1[1]);
  return dR + dC;
}

const buildGridLite = (filename) => {
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const grid = [];
  const arr = [];
  lines.forEach(line => {
    const matches = line.match(/-?\d+/g);
    const sr = +matches[1];
    const sc = +matches[0];
    const br = +matches[3];
    const bc = +matches[2];

    arr.push({ sensor: [sr, sc], beacon: [br, bc], manhattanDist: calculateManhattanDist([sr, sc], [br, bc]) });
  });

  return arr;
}

module.exports = { day15a, day15b }