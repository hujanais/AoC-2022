const fs = require('fs');

const day2a = () => {
  //const filename = './data/day2test.txt';
  const filename = './data/day2.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const rounds = data.split('\n');
  let totalScore = 0;
  rounds.forEach(round => {
    const score = playRound(round);
    totalScore += score;
    // console.log(score, totalScore);
  });

  console.log('2a answer = ', totalScore);
}

// X means you need to lose, 
// Y means you need to draw
// Z means you need to win.
const day2b = () => {
  //const filename = './data/day2test.txt';
  const filename = './data/day2.txt';
  const data = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' });

  const rounds = data.split('\n');
  let totalScore = 0;
  rounds.forEach(round => {
    const score = playRound2(round);
    totalScore += score;
    // console.log(score, totalScore);
  });

  console.log('2b answer = ', totalScore);
}

// input = 'A Y'
// A for Rock, B for Paper, and C for Scissors.
// X for Rock - 1pt
// Y for Paper - 2pt
// Z for Scissors - 3pt
// lose - 0pts, draw - 3pts, win - 6pts
const playRound = (input) => {
  let score = 0;
  const items = input.split(' ');

  const shapeMap = { 'X': 1, 'Y': 2, 'Z': 3 };
  score = shapeMap[items[1]];

  // check for draw first.
  switch (items[0]) {
    case 'A':
      if (items[1] === 'Y') {
        score += 6;
      } else if (items[1] === 'X') {
        score += 3;
      }
      break;
    case 'B':
      if (items[1] === 'Z') {
        score += 6;
      } else if (items[1] === 'Y') {
        score += 3;
      }
      break;
    case 'C':
      if (items[1] === 'X') {
        score += 6;
      } else if (items[1] === 'Z') {
        score += 3;
      }
      break;
  }

  return score;
}

const gameMap = {
  'A': { draw: 1, win: 2, lose: 3 },
  'B': { draw: 2, win: 3, lose: 1 },
  'C': { draw: 3, win: 1, lose: 2 }
};

// X means you need to lose, 
// Y means you need to draw
// Z means you need to win.
const playRound2 = (input) => {
  let score = 0;
  const items = input.split(' ');

  // check outcome.
  switch (items[1]) {
    case 'X':
      score = 0 + gameMap[items[0]].lose;
      break;
    case 'Y':
      score = 3 + gameMap[items[0]].draw;
      break;
    case 'Z':
      score = 6 + gameMap[items[0]].win;
      break;
  }

  // console.log(score);
  return score;
}

module.exports = { day2a, day2b };