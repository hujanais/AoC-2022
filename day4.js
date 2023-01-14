const fs = require('fs');

const day4a = () => {
  let result = 0;
  // const filename = './data/day4test.txt';
  const filename = './data/day4.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const lines = data.split('\n');
  lines.forEach(line => {
    const arr = line.split(',');
    const elf1 = arr[0].split('-').map(v => +v);
    const elf2 = arr[1].split('-').map(v => +v);
    if (isEncapsulated(elf1, elf2)) {
      result += 1;
    }
    // console.log(elf1, elf2, isEncapsulated(elf1, elf2));
  });

  console.log('4a answer = ', result);
}

// arr1 = [5,7], arr2 = [7,9]
const isEncapsulated = (arr1, arr2) => {
  let isEncapsulated = false;
  let min1, max1, min2, max2;

  min1 = arr1[0];
  max1 = arr1[arr1.length - 1];
  min2 = arr2[0];
  max2 = arr2[arr2.length - 1];
  // case 1. [1,2,3,4] [2,3]
  isEncapsulated ||= (min1 <= min2 && max1 >= max2);
  // case 2. [2,3] [1,2,3,4] 
  isEncapsulated ||= (min1 >= min2 && max1 <= max2);

  return isEncapsulated;
}

/*
....567..  5-7
......789  7-9
*/
const isOverlapped = (arr1, arr2) => {
  let isOverlapped = false;
  let min1, max1, min2, max2;

  min1 = arr1[0];
  max1 = arr1[arr1.length - 1];
  min2 = arr2[0];
  max2 = arr2[arr2.length - 1];

  // case 1. [5,6,7] [7,8,9]
  isOverlapped ||= (min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2);

  // case 2. [7,8,9] [5,6,7]
  isOverlapped ||= (min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1);

  return isOverlapped;
}

const day4b = () => {
  let result = 0;
  // const filename = './data/day4test.txt';
  const filename = './data/day4.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const lines = data.split('\n');
  lines.forEach(line => {
    const arr = line.split(',');
    const elf1 = arr[0].split('-').map(v => +v);
    const elf2 = arr[1].split('-').map(v => +v);
    if (isOverlapped(elf1, elf2)) {
      result += 1;
    }
    // console.log(elf1, elf2, isOverlapped(elf1, elf2));

  });
  console.log('4b answer = ', result);
}

module.exports = { day4a, day4b };