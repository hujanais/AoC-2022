const fs = require('fs');

const day19a = () => {
  const MAXTIME = 24;

  // const filename = './data/day19test.txt';  // 33
  const filename = './data/day19.txt';         // 1589
  const blueprints = buildGame(filename);

  // part 1 was just brute force dfs.
  let answer = 0;
  for (let i = 0; i < blueprints.length; i++) {
    const geodes = dfs([MAXTIME, 0, 0, 0, 0, 1, 0, 0, 0], blueprints[i]);
    // console.log(i, geodes);
    answer += (geodes * (i + 1));
  }

  console.log('day19a = ', answer);
}

const day19b = () => {
  const MAXTIME = 32;

  // part-b required tree trimming and got some ideas from the internet.
  // const filename = './data/day19test.txt';  // 108
  const filename = './data/day19.txt';         // 29348
  const blueprints = buildGame(filename);

  let answer = 1;
  for (let i = 0; i < 3; i++) {
    const geodes = dfs([MAXTIME, 0, 0, 0, 0, 1, 0, 0, 0], blueprints[i]);
    // console.log(i, geodes);
    answer *= geodes
  }

  console.log('day19b = ', answer);
}

const key = (state) => {
  return state.join('-');
}

// state = [time, ores, clays, obsidians, geodes, ore-robots, clay-robots, obsidian-robots, geode-robots]
const dfs = (state, blueprint, memo = new Map()) => {
  const [oreCost, clayCost, [obsidianCost_ore, obsidianCost_clay], [geodeCost_ore, geodeCost_obsidian]] = blueprint;
  const [timeLeft, ores, clays, obsidians, geodes, oreRobots, clayRobots, obsidianRobots, geodeRobots] = state;

  if (timeLeft === 0) return geodes;

  if (memo.has(key(state))) {
    return memo.get(key(state));
  }

  let maxGeodes = 0;

  // optimization tricks for part b.
  // if we can build a geode or obsidian robot, just assume this is the best path forward.  ignore the other branches.
  // there is no point to building more robots than each round can consume.

  // can we build geode robot?
  if (ores >= geodeCost_ore && obsidians >= geodeCost_obsidian) {
    const newState = [...state];
    newState[0] -= 1;
    newState[1] += oreRobots;
    newState[2] += clayRobots;
    newState[3] += obsidianRobots;
    newState[4] += geodeRobots;

    newState[1] -= geodeCost_ore;
    newState[3] -= geodeCost_obsidian;
    newState[8] += 1;

    maxGeodes = Math.max(maxGeodes, dfs(newState, blueprint, memo));
  }
  // can we build an obsidian robot? 
  else if (ores >= obsidianCost_ore && clays >= obsidianCost_clay) {
    if (obsidianRobots < geodeCost_obsidian) {
      const newState = [...state];
      newState[0] -= 1;
      newState[1] += oreRobots;
      newState[2] += clayRobots;
      newState[3] += obsidianRobots;
      newState[4] += geodeRobots;

      newState[1] -= obsidianCost_ore;
      newState[2] -= obsidianCost_clay;
      newState[7] += 1;
      maxGeodes = Math.max(maxGeodes, dfs(newState, blueprint, memo));
    }
  }
  else {
    // can we build a clay robot? 
    if (ores >= clayCost && clayRobots < obsidianCost_clay) {
      const newState = [...state];
      newState[0] -= 1;
      newState[1] += oreRobots;
      newState[2] += clayRobots;
      newState[3] += obsidianRobots;
      newState[4] += geodeRobots;

      newState[1] -= clayCost;
      newState[6] += 1;
      maxGeodes = Math.max(maxGeodes, dfs(newState, blueprint, memo));
    }

    // can we build an ore robot?
    if (ores >= oreCost && oreRobots < Math.max(...[clayCost, obsidianCost_ore, geodeCost_ore])) {
      const newState = [...state];
      newState[0] -= 1;
      newState[1] += oreRobots;
      newState[2] += clayRobots;
      newState[3] += obsidianRobots;
      newState[4] += geodeRobots;

      newState[1] -= oreCost;
      newState[5] += 1;
      maxGeodes = Math.max(maxGeodes, dfs(newState, blueprint, memo));
    }

    // do nothing.
    const newState = [...state];
    newState[0] -= 1;
    newState[1] += oreRobots;
    newState[2] += clayRobots;
    newState[3] += obsidianRobots;
    newState[4] += geodeRobots;
    maxGeodes = Math.max(maxGeodes, dfs(newState, blueprint, memo));
  }

  memo.set(key(state), maxGeodes);

  return maxGeodes;
}

const buildGame = (filename) => {
  let arr = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  let robotIdx = 0, ores, clays, obsidians;
  const blueprints = [];
  for (let line of arr) {
    const matches = line.match(/\d+/g);
    blueprints.push([+matches[1], +matches[2], [+matches[3], +matches[4]], [+matches[5], +matches[6]]]);
  }

  return blueprints;
}

module.exports = { day19a, day19b };