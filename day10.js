const fs = require('fs');

const day10a = () => {
  let answer = 0;
  
  // const filename = './data/day10test.txt'; // 13140
  const filename = './data/day10.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // every addx operation takes 2 clock cycles so let's inject a no-op header.
  let instructions = [];
  let register = 1;
  for (let item of data) {
    if (item.includes('addx')) {
      instructions.push('noop');
    }
    instructions.push(item);
  }

  let cycle = 0;
  const arr = [20, 60, 100, 140, 180, 220];
  
  while(instructions.length > 0) {
    const op = instructions.shift();
    const [command, valStr] = op.split(' ');
    let val;
    cycle += 1;

    // read the data during the middle of the cycle, 
    // so we are interested in the register value from the previous cycle
    if (arr.includes(cycle)) {
      answer += (cycle * register);
    }
    
    switch (command) {
      case 'noop': break;
      case 'addx':
        val = +valStr;
        register += val;
        break;
    }
  }
  
  console.log('day10a = ', answer);
}

const day10b = () => {
let answer = 0;
  
  //const filename = './data/day10test.txt'; // 13140
  const filename = './data/day10.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // every addx operation takes 2 clock cycles so let's inject a no-op header.
  let instructions = [];
  let register = 1;
  for (let item of data) {
    if (item.includes('addx')) {
      instructions.push('noop');
    }
    instructions.push(item);
  }

  // CRT: 40 wide and 6 high.
  // to simplify, lets just use a 1-d array first.
  const CRT = [
    Array.from(Array(40).keys()).map(x => ' '),
    Array.from(Array(40).keys()).map(x => ' '),
    Array.from(Array(40).keys()).map(x => ' '),
    Array.from(Array(40).keys()).map(x => ' '),
    Array.from(Array(40).keys()).map(x => ' '),
    Array.from(Array(40).keys()).map(x => ' '),
  ];
  
  let cycle = 0;

  let sprite = [0,1,2];
  while(instructions.length > 0) {
    const op = instructions.shift();
    const [command, valStr] = op.split(' ');
    let val;
    cycle += 1;

    // the cycle number is the location of the center of the 3-length sprite.
    let column = (cycle-1)%40;
    let row = Math.floor((cycle-1) / 40);
    sprite = [column-1, column, column+1];
    if (sprite.includes(register)) {
      CRT[row][column] = '#';
    }
    
    switch (command) {
      case 'noop': break;
      case 'addx':
        val = +valStr;
        register += val;
        break;
    }
  }

  console.log('day10b = ');
  prettyPrint(CRT);
}

// print into 40 x 6 CRT display.
const prettyPrint = (crt) => {
  let strLine = '';
  for (let line of crt) {
    strLine = '';
    for (let char of line) {
      strLine += char;
    }
    console.log(strLine);
  }
}

module.exports = {day10a, day10b};