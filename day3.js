const fs = require('fs');

const getCodePoint = (input) => {
  // A - Z ==> 65 - 90 ==> return 27-52
  // a - z ==> 97 - 122 ==> return 1-26
  const code = input.codePointAt();
  if (code >= 65 && code <= 90) {
    return (code - 65 + 27);
  } else if (code >= 97 && code <= 122) {
    return (code - 97 + 1);
  }

  throw new Exception('something wrong');
}

const day3a = () => {
  let result = 0;
  //const filename = './data/day3test.txt';
  const filename = './data/day3.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });
  const lines = data.split('\n');
  lines.forEach(line => {
    const len = line.length;
    const left = line.slice(0, len / 2);
    const right = line.slice(len / 2);

    let foundItem = '';
    for (let i = 0; i < left.length; i++) {
      const item = left[i];
      if (right.includes(item)) {
        foundItem = item;
        break;
      }
    }

    // console.log(left, right, foundItem, getCodePoint(foundItem));
    result += getCodePoint(foundItem);

  });

  console.log('3a answer = ', result);
}

const day3b = () => {
  let result = 0;
  // const filename = './data/day3test.txt';
  const filename = './data/day3.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const lines = data.split('\n');
  for (let i = 0; i < lines.length; i += 3) {
    const sack1 = lines[i];
    const sack2 = lines[i + 1];
    const sack3 = lines[i + 2];
    result += findBadge(sack1, sack2, sack3);
  }

  console.log('3b answer = ', result);
}

const findBadge = (sack1, sack2, sack3) => {
  let badge = '';
  const sacks = [sack1, sack2, sack3];

  // search using the smallest to largest sack.
  const sortedArr = sacks.sort((a, b) => a.length - b.length);
  const smallestSack = sortedArr[0];
  const middleSack = sortedArr[1];
  const largestSack = sortedArr[2];

  for (let i = 0; i < smallestSack.length; i++) {
    const item = smallestSack[i];
    if (middleSack.includes(item) && largestSack.includes(item)) {
      badge = item;
      break;
    }
  }

  // console.log(sortedArr, badge, getCodePoint(badge));
  return getCodePoint(badge);
}

module.exports = { day3a, day3b };