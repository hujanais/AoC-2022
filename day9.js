const fs = require('fs');

const day9a = () => {
  let answer = 0;
  //const filename = './data/day9atest.txt';
  const filename = './data/day9.txt';
  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const tailSet = new Set();
  let head = [0, 0];
  let tail = [0, 0];
  const snake = [[0, 0], [0, 0]];
  tailSet.add(`${0}-${0}`);
  for (let instruction of instructions) {
    // move(head, tail, instruction, tailSet);  // specialized solution
    moveSnake(snake, instruction, tailSet);    // generalized solution
  }

  answer = tailSet.size;
  console.log('day9a = ', answer);
}

// head = [row, col]
// tail = [row, col]
const move = (head, tail, instruction, tailSet) => {
  const [dir, steps] = instruction.split(' ');
  let nSteps = +steps;
  let dX = 0, dY = 0;

  switch (dir) {
    case 'R':
      dX = 1;
      break;
    case 'L':
      dX = -1;
      break;
    case 'U':
      dY = 1;
      break;
    case 'D':
      dY = -1;
      break;
    default: throw new Exception('fubar');
  }

  for (let i = 0; i < nSteps; i++) {
    const newHead = [head[0] + dX, head[1] + dY];
    if (canMove(newHead, tail)) {
      tail[0] = head[0];
      tail[1] = head[1];
      tailSet.add(`${tail[0]}-${tail[1]}`)
      // console.log(newHead, tail);
    } else {
      // console.log(`skip tail move ${newHead}`);
    }
    head[0] = newHead[0];
    head[1] = newHead[1];
  }
}

const getDistance = (head, tail) => {
  const [hX, hY] = head;
  const [tX, tY] = tail;
  const absX = Math.abs(hX - tX);
  const absY = Math.abs(hY - tY);
  const mag = Math.sqrt(absX * absX + absY * absY);
  return mag;
}

const canMove = (head, tail) => {
  if (getDistance(head, tail) <= Math.sqrt(2)) return false;
  return true;
}

const day9b = () => {
  let answer = 0;
  //const filename = './data/day9atest.txt';
  // const filename = './data/day9btest.txt';    // 36
  const filename = './data/day9.txt';

  const instructions = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const tailSet = new Set();
  const snake = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  tailSet.add(`${0}-${0}`);

  for (let instruction of instructions) {
    moveSnake(snake, instruction, tailSet);
  }

  answer = tailSet.size;

  console.log('day9b = ', answer);
}

const moveSnake = (snake, instruction, tailSet) => {
  const [dir, steps] = instruction.split(' ');
  let nSteps = +steps;
  let dX = 0, dY = 0;

  switch (dir) {
    case 'R':
      dX = 1;
      break;
    case 'L':
      dX = -1;
      break;
    case 'U':
      dY = 1;
      break;
    case 'D':
      dY = -1;
      break;
    default: throw new Exception('fubar');
  }

  // console.log('------', instruction);
  for (let i = 0; i < nSteps; i++) {
    let head = snake[0];
    head[0] += dX;
    head[1] += dY;
    for (let j = 0; j < snake.length - 1; j++) {
      let head = snake[j];
      let tail = snake[j + 1];
      if (canMove(head, tail)) {
        snake[j + 1] = moveToHole(head, tail);
      } else {
        // no point checking the rest.
        //break;
      }
    }

    // update tail position.
    tail = snake[snake.length - 1];
    tailSet.add(`${tail[0]}-${tail[1]}`);
  }

  // console.log(snake.join(' '));
}

// when the 2 points are within 1 unit away, they are in 
// equilibrium
const moveToHole = (head, tail) => {
  let [tx, ty] = tail;
  let minDistance = Infinity;
  let newPosition;
  const deltas = [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]];
  for (let delta of deltas) {
    const dist = getDistance(head, [tx + delta[0], ty + delta[1]]);
    if (dist < minDistance) {
      minDistance = dist;
      newPosition = [tx + delta[0], ty + delta[1]];
    }
  }
    return newPosition;
}

module.exports = { day9a, day9b }