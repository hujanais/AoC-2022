const { assert } = require('console');
const fs = require('fs');

const smallTest = [
  [1, '1'],
  [2, '2'],
  [3, '1='],
  [4, '1-'],
  [5, '10'],
  [6, '11'],
  [7, '12'],
  [8, '2='],
  [9, '2-'],
  [10, '20'],
  [15, '1=0'],
  [20, '1-0'],
  [2022, '1=11-2'],
  [12345, '1-0---0'],
  [314159265, '1121-1110-1=0'],
  [1747, '1=-0-2'],
  [906, '12111'],
  [198, '2=0='],
  [11, '21'],
  [201, '2=01'],
  [31, '111'],
  [1257, '20012'],
  [32, '112'],
  [353, '1=-1='],
  [107, '1-12'],
  [7, '12'],
  [3, '1='],
  [37, '122'],
];

day25a = () => {
  // const filename = './data/day25test.txt';  // 4890 => 2=-1=0
  const filename = './data/day25.txt';  // 33658310202841 2--1=0=-210-1=00=-=1
  let arr = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');

  // test decode
  for ([decimal, snafu] of smallTest) {
    assert(decode(snafu) === decimal);
  }

  // test encode
  for ([decimal, snafu] of smallTest) {
    assert(encode(decimal) === snafu);
  }

  let snafuDecimal = 0;
  for (let snafu of arr) {
    snafuDecimal += decode(snafu);
  }

  let answer = encode(snafuDecimal);

  console.log('day25a = ', snafuDecimal, answer);
};

day25b = () => {

}

const decode = (snafuStr) => {
  const snafu = snafuStr.split('');
  let power = snafu.length - 1;
  let result = 0;
  while (snafu.length > 0) {
    const item = snafu.shift();
    switch (item) {
      case '-':
        result -= 1 * Math.pow(5, power);
        break;
      case '=':
        result -= 2 * Math.pow(5, power);
        break;
      default:
        result += +item * Math.pow(5, power);
        break;
    }
    power -= 1;
  }

  return result;
};

const encode = (decimalStr) => {
  let decimal = +decimalStr;
  let intVal = -1;
  let remainder = 0;

  // step 1. generate decimal equilavent.
  let snafuArr = [];
  while (decimal > 0) {
    intVal = Math.floor(decimal / 5);
    remainder = decimal % 5;
    decimal = intVal;
    snafuArr.unshift(remainder);
  }
  // pad an extra 0 at the end.
  snafuArr.unshift(0);

  // step 2. encode 3 and 4.
  let pos = snafuArr.length - 1;
  while (pos >= 0) {
    const digit = snafuArr[pos];
    switch (digit) {
      case 3:
        snafuArr[pos] = '=';
        snafuArr[pos - 1] = snafuArr[pos - 1] + 1;
        break;
      case 4:
        snafuArr[pos] = '-';
        snafuArr[pos - 1] = snafuArr[pos - 1] + 1;
        break;
      case 5:
        snafuArr[pos] = 0;
        snafuArr[pos - 1] = snafuArr[pos - 1] + 1;
        break;
      default:
        break;
    }
    pos -= 1;
  }

  if (snafuArr[0] === 0) snafuArr = snafuArr.slice(1);
  return snafuArr.join('');
};

module.exports = { day25a, day25b };
