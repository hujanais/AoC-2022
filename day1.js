const fs = require('fs');

const day1a = () => {
  // const filename = './data/day1test.txt';
  const filename = './data/day1.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const lines = data.split('\n\n');
  let maxCount = 0;
  lines.forEach(line => {
    const items = line.split('\n').map(i => +i);
    const foodCount = items.reduce((prev, curr) => prev + curr);
    maxCount = Math.max(maxCount, foodCount);
  });

  console.log('1a answer = ', maxCount);
}

const day1b = () => {
  // const filename = './data/day1test.txt';
  const filename = './data/day1.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const lines = data.split('\n\n');
  let foodArr = [];

  lines.forEach(line => {
    const items = line.split('\n').map(i => +i);
    const foodCount = items.reduce((prev, curr) => prev + curr);
    foodArr.push(foodCount);
  });

  const sortedArr = foodArr.sort((a, b) => b - a);
  // console.log(sortedArr);

  console.log('1b answer = ', sortedArr[0] + sortedArr[1] + sortedArr[2]);
}

module.exports = { day1a, day1b }


