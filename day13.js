const fs = require('fs');

const GOOD = 'GOOD';
const EQUAL = 'EQUAL';
const BAD = 'BAD';

const day13a = () => {

  // console.log(exp([[],1],[[],2]));
  // return;

  //const filename = './data/day13test.txt'; // 13
  const filename = './data/day13.txt';  // 6568
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  let idx = 1;
  let answer = 0;
  while (lines.length > 0) {
    const leftStr = lines.shift();
    const rightStr = lines.shift();
    const leftArr = JSON.parse(leftStr);
    const rightArr = JSON.parse(rightStr);
    lines.shift();

    let res = exp(leftArr, rightArr);
    // console.log(idx, res);
    if (res === GOOD) {
      answer += idx;
    }
    idx += 1;
  }

  console.log('day13a = ', answer);
}

const exp = (leftItem, rightItem) => {
  const leftArrLevel = getArrLevel(leftItem);
  const rightArrLevel = getArrLevel(rightItem);
  // console.log('test', leftItem, rightItem, leftArrLevel, rightArrLevel);

  // base cases
  if (leftArrLevel === 0 && rightArrLevel === 0) {
    let res;
    if (leftItem === rightItem) {
      res = EQUAL;
    } else if (leftItem < rightItem) {
      res = GOOD;
    } else {
      res = BAD;
    }

    // console.log(`${leftItem} <= ${rightItem} ==> ${res}`);
    return res;
  }

  // change single numbers to depth-1 array.
  if (leftArrLevel === 0) {
    leftItem = [leftItem];
  }
  if (rightArrLevel === 0) {
    rightItem = [rightItem];
  }

  let res = BAD;
  const len = Math.max(leftItem.length, rightItem.length);

  // special situation when [] compares to [] -> EQUAL
  if (leftItem.length === 0 && rightItem.length === 0) return EQUAL;

  for (let i = 0; i < len; i++) {
    if (i >= leftItem.length) {
      // console.log('true because Left side ran out of items');
      return GOOD;
    } else if (i >= rightItem.length) {
      // console.log('false because Right side ran out of items');
      return BAD;
    }

    res = exp(leftItem[i], rightItem[i]);
    if (res !== EQUAL) return res;
  }

  return res;
}

// 0 means integer
// 1 => [], [1,2,3]
// 2 => [1, [2,3]] ...
const getArrLevel = (arr) => {
  if (!Array.isArray(arr)) return 0;

  let levels = 1;
  for (let i = 0; i < arr.length; i++) {
    levels = Math.max(levels, 1 + getArrLevel(arr[i]));
  }

  return levels;
}

const day13b = () => {
  // const filename = './data/day13test.txt';  // 140
  const filename = './data/day13.txt';         // 19493
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const arr = [];
  while (lines.length > 0) {
    const line1 = lines.shift();
    const line2 = lines.shift();
    lines.shift();

    arr.push(JSON.parse(line1));
    arr.push(JSON.parse(line2));
  }

  // push the decoder packets.
  arr.push([[2]]);
  arr.push([[6]]);

  // sort
  const sortedArr = arr.sort((a, b) => {
    if (exp(a, b) === BAD) return 1;
    else return -1;
  });

  const idx1 = sortedArr.findIndex(i => JSON.stringify(i) === '[[2]]') + 1; // +1 because it is 1-index
  const idx2 = sortedArr.findIndex(i => JSON.stringify(i) === '[[6]]') + 1;

  const answer = idx1 * idx2;

  // console.log(sortedArr, idx1, idx2);
  console.log('day13b = ', answer);
}

module.exports = { day13a, day13b }