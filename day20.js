const fs = require('fs');

/*
  I had to watch and used code from https://www.youtube.com/watch?v=QgS36OQxAgE to check my result because I wasn't sure what exactly the question wanted.  
*/

const day20a = () => {
  // const filename = './data/day20test.txt'; // 3
  const filename = './data/day20.txt';        // 13289
  let arr = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n').map((v, index) => [index, +v]);

  for (let i = 0; i < arr.length; i++) {
    swap(arr, i);
  }

  // get the index of the 0.
  const zero_idx = arr.map(a => a[1]).indexOf(0);
  // console.log('zero-index ', zero_idx);

  const len = arr.length;
  const value_at_1000 = arr[(zero_idx + 1000) % len][1];
  const value_at_2000 = arr[(zero_idx + 2000) % len][1];
  const value_at_3000 = arr[(zero_idx + 3000) % len][1];

  // console.log(value_at_1000, value_at_2000, value_at_3000)
  let answer = value_at_1000 + value_at_2000 + value_at_3000;
  console.log('day20a = ', answer);
}

const day20b = () => {
  // const filename = './data/day20test.txt'; // 3
  const filename = './data/day20.txt';        // 13289
  const decryption_key = 811589153;           // 2865721299243
  let arr = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n').map((v, index) => [index, +v * decryption_key]);

  // console.log(arr.map(v => v[1]).join(','));

  for (let round = 0; round < 10; round++) {
    for (let i = 0; i < arr.length; i++) {
      swap(arr, i);
    }
    // console.log(arr.map(a => a[1]).join(','));
  }

  // get the index of the 0.
  const zero_idx = arr.map(a => a[1]).indexOf(0);
  // console.log('zero-index ', zero_idx);

    const len = arr.length;
  const value_at_1000 = arr[(zero_idx + 1000) % len][1];
  const value_at_2000 = arr[(zero_idx + 2000) % len][1];
  const value_at_3000 = arr[(zero_idx + 3000) % len][1];

  // The grove coordinates can still be found in the same way. Here, the 1000th number after 0 is 811589153, the 2000th is 2434767459, and the 3000th is -1623178306; adding these together produces 1623178306.
  
  // console.log(value_at_1000, value_at_2000, value_at_3000)
  let answer = value_at_1000 + value_at_2000 + value_at_3000;
  console.log('day20b = ', answer);
}

const swap = (arr, i) => {
  const idx = arr.findIndex(p => p[0] === i);
  const swapValue = arr[idx][1];
  if (swapValue === 0) {
    // console.log('do nothing');
  }
  else if (swapValue > 0) {
    swapRight(arr, idx, swapValue);
  }
  else {
    swapLeft(arr, idx, Math.abs(swapValue));
  }
}

const swapRight = (arr, idx, steps) => {
  const len = arr.length;
  steps %= (len - 1);
  while (steps > 0) {
    let targetIdx = (idx + 1) % len;
    const prev = arr[idx];
    arr[idx] = arr[targetIdx];
    arr[targetIdx] = prev;
    idx = targetIdx;
    steps -= 1;
  }
}

const swapLeft = (arr, idx, steps) => {
  const len = arr.length;
  steps %= (len-1);
  while (steps > 0) {
    let nextIdx = idx - 1;
    if (nextIdx < 0) nextIdx = len + nextIdx;
    const prev = arr[idx];
    arr[idx] = arr[nextIdx];
    arr[nextIdx] = prev;
    idx = nextIdx;
    steps -= 1;
  }
}


module.exports = { day20a, day20b };