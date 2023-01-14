const fs = require('fs');

class Monkey {
  constructor(id, neighbors, operation) {
    this.id = id;
    this.neighbors = [...neighbors];
    this.operation = operation;
  }

  get isInteger() {
    return !this.operation;
  }

  getValue(dict) {
    if (!this.operation) return this.neighbors[0];

    let key1 = this.neighbors[0];
    let key2 = this.neighbors[1];
    let value1 = dict[key1].getValue(dict);
    let value2 = dict[key2].getValue(dict);

    switch (this.operation) {
      case '+': return value1 + value2;
      case '-': return value1 - value2;
      case '*': return value1 * value2;
      case '/': return value1 / value2;
    }
  }

  toString() {
    if (!this.operation) return this.neighbors[0];

    let key1 = this.neighbors[0];
    let key2 = this.neighbors[1];

    return `${key1} ${this.operation} ${key2}`;
  }
}

const day21a = () => {
  // const filename = './data/day21test.txt';  // 152
  const filename = './data/day21.txt';         // 84244467642604
  const dict = buildGraph(filename);
  console.log('day21a = ', dict['root'].getValue(dict));
}

const day21b = () => {
  // const filename = './data/day21test.txt';  // 152
  const filename = './data/day21.txt';         // 84244467642604
  const dict = buildGraph(filename);

  // generate the path to humn
  let root = 'root';
  const paths = dfs(root, 'humn', dict);
  let path = paths[0];
  // console.log(path);

  let rootNode, targetKey, targetValue;
  for (const neighbor of dict['root'].neighbors) {
    if (path.includes(neighbor)) {
      rootNode = neighbor;
    } else {
      targetValue = dict[neighbor].getValue(dict);
    }
  }
  // console.log(`set ${rootNode} to ${targetValue}`);

  dict['humn'].neighbors = ['???'];
  dict['humn'].operation = '???';
  const queue = [[dict[rootNode], targetValue]];

  while (queue.length > 0) {
    [rootNode, targetValue] = queue.pop();

    targetKey = rootNode.neighbors.find(n => path.includes(n));
    [rootNode, targetValue] = solve(rootNode, targetKey, targetValue, dict);

    if (rootNode.id === 'humn') {
      console.log('day21b = ', targetValue);
      return;
    }

    queue.push([rootNode, targetValue]);
  }
}

const solve = (rootNode, targetKey, targetValue, dict) => {
  const operation = rootNode.operation;
  const nodeA = dict[rootNode.neighbors[0]];
  const nodeB = dict[rootNode.neighbors[1]];
  let newValue = 0;
  
  let nodePtr;

  switch (operation) {
    case '+':
      if (nodeA.id === targetKey) {
        newValue = targetValue - nodeB.getValue(dict);
        nodePtr = nodeA;
      } else {
        newValue = targetValue - nodeA.getValue(dict);
        nodePtr = nodeB;
      }
      break;
    case '-':
      if (nodeA.id === targetKey) {
        newValue = targetValue + nodeB.getValue(dict);
        nodePtr = nodeA;
      } else {
        newValue = nodeA.getValue(dict) - targetValue;
        nodePtr = nodeB;
      }
      break;
    case "*":
      if (nodeA.id === targetKey) {
        newValue = targetValue / nodeB.getValue(dict);
        nodePtr = nodeA;
      } else {
        newValue = targetValue / nodeA.getValue(dict);
        nodePtr = nodeB;
      }
      break;
    case "/":
      if (nodeA.id === targetKey) {
        newValue = targetValue * nodeB.getValue(dict);
        nodePtr = nodeA;
      } else {
        newValue = targetValue / nodeA.getValue(dict);
        nodePtr = nodeB;
      }
      break;
  }

  return [nodePtr, newValue];
}

const dfs = (start, end, dict) => {
  if (start === end) return [[]];
  if (dict[start].isInteger) return null;

  const paths = [];

  for (let neighbor of dict[start].neighbors) {
    const localPaths = dfs(neighbor, end, dict);
    if (localPaths !== null) {
      for (const path of localPaths) {
        paths.push([...path, neighbor]);
      }
    }
  }

  return paths;
}


const buildGraph = (filename) => {
  const dict = {};
  let arr = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  for (let line of arr) {
    const key = line.split(':')[0];
    const value = line.split(':')[1];
    if (Number.isInteger(+value)) {
      dict[key] = new Monkey(key, [+value], null);
    } else {
      const components = value.trimStart().split(' ');
      const comp1Key = components[0];
      const operation = components[1];
      const comp2Key = components[2];
      dict[key] = new Monkey(key, [comp1Key, comp2Key], operation);
    }
  }

  return dict;
}

module.exports = { day21a, day21b };