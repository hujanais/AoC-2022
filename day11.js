const fs = require('fs');

const NODAMAGE = true;
const DAMAGE = false;

class Monkey {
  constructor(idx, noDamage = true) {
    this.idx = idx;
    this.items = [];
    this.divideByStep = 0;
    this.throwToIfTrueStep = 0;    // monkey index
    this.throwToIfFalseStep = 0;   // monkey index
    this.operationStep = [];      // ['+-/*', '19 or old']
    this.numOfInspections = 0;
    this.noDamage = noDamage;
  }

  addItem(worryValue) {
    this.items.push(worryValue);
  }

  // return the throw command [{monkeyIdx: 0, worryValue: 0}]
  playRound() {
    const actions = [];
    // the monkey always throws the item way so let's just use a stack.
    while (this.items.length > 0) {
      const oldValue = this.items.shift();         // start from the top.
      this.numOfInspections += 1;
      let worryValue = this.doOperation(oldValue);  // adjust worry-value
      worryValue = this.doInspectStep(worryValue);  // damage
      const actionObj = this.doTest(worryValue);    // mod operation
      actions.push(actionObj);
    }

    return actions;
  }

  doTest(worryValue) {
    if (worryValue % this.divideByStep === 0) {
      return { monkeyIdx: this.throwToIfTrueStep, worryValue };
    } else {
      return { monkeyIdx: this.throwToIfFalseStep, worryValue };
    }
  }

  doInspectStep(worryValue) {
    if (this.noDamage) {
      return Math.floor(worryValue / 3);
    }

    return worryValue;
  }

  doOperation(oldValue) {
    let newValue = 0;
    let [oper, value] = this.operationStep;
    if (value === 'old') {
      value = oldValue;
    } else {
      value = +value;
    }

    switch (oper) {
      case '+':
        newValue = oldValue + value;
        break;
      case '-':
        newValue = oldValue - value;
        break;
      case '/':
        newValue = oldValue / value;
        break;
      case '*':
        // we need some magic here to keep the numbers small.
        newValue = oldValue * value;
        // newValue = (oldValue % this.divideByStep) * value;
        // if ((newValue % this.divideByStep) === 0) {
        //   console.log('reset', newValue);
        //   newValue = this.divideByStep;
        // }

        // console.log(`${this.idx} : ${oldValue} x ${value} % ${this.divideByStep} | ${oldValue * value} ==>${newValue}`)
        break;
    }

    if (newValue > Number.MAX_SAFE_INTEGER) {
      throw new Exception('out of bound')
    }
    return newValue;
  }

  set startingItems(line) {
    const arr = line.split(':');
    const arr2 = arr[1].split(',').map(v => +v);
    this.items = [...arr2];
    // console.log(this.items);
  }

  set operation(line) {
    const arr = line.split('Operation: new = old ');
    const [oper, value] = arr[1].split(' ');
    this.operationStep = [oper, value];
    // console.log(this.operationStep);
  }

  set test(line) {
    const arr = line.split('Test: divisible by');
    this.divideByStep = +arr[1];
    // console.log(this.divideByStep);
  }

  set ifTrue(line) {
    const arr = line.split('If true: throw to monkey');
    this.throwToIfTrueStep = +arr[1];
    // console.log('if true throw to monkey: ', this.throwToIfTrueStep);
  }

  set ifFalse(line) {
    const arr = line.split('If false: throw to monkey');
    this.throwToIfFalseStep = +arr[1];
    // console.log('if false throw to monkey: ', this.throwToIfFalseStep);
  }
}

const day11a = () => {
  const filename = './data/day11test.txt';      // 10605
  // const filename = './data/day11.txt';             // 120056
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // data prep
  const monkeys = [];
  let monkeyIdx = 0;
  for (const line of lines) {
    if (line.includes('Monkey')) {
      let arr = line.split(' ');
      monkeyIdx = +arr[1].split(':')[0];
      monkeys.push(new Monkey(monkeyIdx, NODAMAGE));
      // console.log('start monkey')
    } else if (line.includes('Starting')) {
      monkeys[monkeyIdx].startingItems = line;
    } else if (line.includes('Operation')) {
      monkeys[monkeyIdx].operation = line;
    } else if (line.includes('Test')) {
      monkeys[monkeyIdx].test = line;
    } else if (line.includes('If true')) {
      monkeys[monkeyIdx].ifTrue = line;
    } else if (line.includes('If false')) {
      monkeys[monkeyIdx].ifFalse = line;
    }
    else if (line === '') {
      // console.log('end monkey');
    }
  }

  for (let round = 0; round < 20; round++) {
    // play the game
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      const actions = monkey.playRound();
      for (let action of actions) {
        monkeys[action.monkeyIdx].addItem(action.worryValue);
      }
    }
  }

  /*
    After round 20, the monkeys are holding items with these worry levels:
    Monkey 0: 10, 12, 14, 26, 34     101 times
    Monkey 1: 245, 93, 53, 199, 115  95 times
    Monkey 2:                        7 times
    Monkey 3:                        105 times
  */
  monkeys.sort((a, b) => b.numOfInspections - a.numOfInspections);
  // monkeys.forEach(monkey => {
  //   console.log(monkey.idx, monkey.items, monkey.numOfInspections);
  // });

  const answer = monkeys[0].numOfInspections * monkeys[1].numOfInspections;

  console.log('day11a = ', answer);
}

const day11b = () => {
  const filename = './data/day11test.txt';      // 10605
  // const filename = './data/day11.txt';
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  // data prep
  const monkeys = [];
  let monkeyIdx = 0;
  for (const line of lines) {
    if (line.includes('Monkey')) {
      let arr = line.split(' ');
      monkeyIdx = +arr[1].split(':')[0];
      monkeys.push(new Monkey(monkeyIdx, NODAMAGE));
      // console.log('start monkey')
    } else if (line.includes('Starting')) {
      monkeys[monkeyIdx].startingItems = line;
    } else if (line.includes('Operation')) {
      monkeys[monkeyIdx].operation = line;
    } else if (line.includes('Test')) {
      monkeys[monkeyIdx].test = line;
    } else if (line.includes('If true')) {
      monkeys[monkeyIdx].ifTrue = line;
    } else if (line.includes('If false')) {
      monkeys[monkeyIdx].ifFalse = line;
    }
    else if (line === '') {
      // console.log('end monkey');
    }
  }

  for (let round = 0; round < 3; round++) {
    // play the game
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      const actions = monkey.playRound();
      for (let action of actions) {
        monkeys[action.monkeyIdx].addItem(action.worryValue);
      }
    }
    // console.log('round -', round);
    // monkeys.forEach(monkey => {
    //   console.log(monkey.idx, monkey.items, monkey.numOfInspections);
    // })
  }

  /*
    After round 20, the monkeys are holding items with these worry levels:
    Monkey 0: 10, 12, 14, 26, 34     101 times
    Monkey 1: 245, 93, 53, 199, 115  95 times
    Monkey 2:                        7 times
    Monkey 3:                        105 times
  */
  monkeys.sort((a, b) => b.numOfInspections - a.numOfInspections);
  monkeys.forEach(monkey => {
    console.log(monkey.idx, monkey.items, monkey.numOfInspections);
  });

  const answer = monkeys[0].numOfInspections * monkeys[1].numOfInspections;

  console.log('day11b = ', answer);
}

module.exports = { day11a, day11b };