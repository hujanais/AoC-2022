const fs = require('fs');

/* test data
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
*/
const testdata = [
  ['Z', 'N'],
  ['M', 'C', 'D'],
  ['P']
];

/*  puzzle data
            [L] [M]         [M]    
        [D] [R] [Z]         [C] [L]
        [C] [S] [T] [G]     [V] [M]
[R]     [L] [Q] [B] [B]     [D] [F]
[H] [B] [G] [D] [Q] [Z]     [T] [J]
[M] [J] [H] [M] [P] [S] [V] [L] [N]
[P] [C] [N] [T] [S] [F] [R] [G] [Q]
[Z] [P] [S] [F] [F] [T] [N] [P] [W]
 1   2   3   4   5   6   7   8   9 
*/
const data = [['Z', 'P', 'M', 'H', 'R'],
['P', 'C', 'J', 'B'],
['S', 'N', 'H', 'G', 'L', 'C', 'D'],
['F', 'T', 'M', 'D', 'Q', 'S', 'R', 'L'],
['F', 'S', 'P', 'Q', 'B', 'T', 'Z', 'M'],
['T', 'F', 'S', 'Z', 'B', 'G'],
['N', 'R', 'V'],
['P', 'G', 'L', 'T', 'D', 'V', 'C', 'M'],
['W', 'Q', 'N', 'J', 'F', 'M', 'L']
];

const day5a = () => {
  let result = '';
  // let crates = JSON.parse(JSON.stringify(testdata));
  // const filename = './data/day5test.txt';

  let crates = JSON.parse(JSON.stringify(data));
  const filename = './data/day5.txt';

  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const steps = instructions.split('\n');
  steps.forEach(step => doMove(step, crates, false));
  // console.log(crates);

  // create result.
  crates.forEach(stack => {
    result += stack[stack.length - 1];
  });

  console.log('5a answer = ', result);
}

const prettyPrint = (stacks) => {
  stacks.forEach(stack => {
    console.log(stack.join(''));
  });
}

const doMove = (instruction, crates, multiCrates) => {
  const regExpLiteral = /\d+/g;
  const matches = instruction.match(regExpLiteral);
  const numOfCrates = matches[0];

  const origin = matches[1] - 1; // make this 0-based index
  const target = matches[2] - 1; // make this 0-based index

  const len = crates[origin].length;
  let stack;
  if (multiCrates) {
    // move all crates at time. question 2 using the CrateMover 9001 model.
    stack = crates[origin].slice(-numOfCrates);
  } else {
    // move 1 crate a a time.  question 1.
    stack = crates[origin].slice(-numOfCrates).reverse(); // crate moved 1 at a time.    
  }
  crates[origin] = crates[origin].slice(0, len - numOfCrates);

  crates[target].push(...stack);

  // console.log(instruction);
  // prettyPrint(crates);
  // console.log('--------');
}

// NLCDCTVMD is incorrect.
// NLCDCLVMQ
const day5b = () => {
  let result = '';
  // let crates = JSON.parse(JSON.stringify(testdata));
  // const filename = './data/day5test.txt';

  let crates = JSON.parse(JSON.stringify(data));
  const filename = './data/day5.txt';

  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });
  
  const steps = instructions.split('\n');
  steps.forEach(step => doMove(step, crates, true));

  // create result.
  crates.forEach(stack => {
    result += stack[stack.length - 1];
  });

  console.log('5b answer = ', result);
}

module.exports = { day5a, day5b };