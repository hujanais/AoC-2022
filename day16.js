const fs = require('fs');

const day16a = () => {
  const MAXTIME = 30;
  const filename = './data/day16test.txt';    // 1651
  // const filename = './data/day16.txt';        // 2056

  const [nodesWithValves, rawGraph] = buildGraph(filename);

  // find the shortest path from AA to all valves.
  // then find the shortest path from individual valves to other valves.
  let graph = [];
  for (let node of ['AA', ...nodesWithValves]) {
    for (let valveNode of nodesWithValves) {
      if (node !== valveNode) {
        const [path, distance] = shortestPath(node, valveNode, rawGraph);
        graph.push({
          src: node,
          target: valveNode,
          distance,
          flowrate: rawGraph[valveNode].maxFlowRate
        });
      }
    }
  }
   
  const allValves = Array.from(new Set(graph.map(g => g.target)));
  console.log(dfs2('AA', graph, allValves, 0, MAXTIME));
  const answer = dfs1('AA', graph, allValves, 0, MAXTIME);
  console.log('day16a = ', answer);
}

// this returns just the maxvalue.
const dfs1 = (src, graph, allValves, flowRate, timeLeft, visited = new Set()) => {
  if (timeLeft <= 0) {
    // console.log('out of time');
    return 0;
  }

  visited.add(src);
  
  if (allValves.every(v => visited.has(v))) {
    visited.delete(src);
    return timeLeft * flowRate;
  }
  
  let maxTotal = 0;
  for (let neighbor of allValves) {
    if (visited.has(neighbor)) continue;
    const valvePath = graph.find(p => 
      p.src === src && p.target === neighbor);
    const newVolume = Math.min((valvePath.distance + 1), timeLeft) * flowRate;
    // console.log('exploring neighbor', neighbor, timeLeft, flowRate, valvePath, newVolume);

    const tmpValue = newVolume + dfs1(neighbor, graph, allValves,
      flowRate + valvePath.flowrate,
      timeLeft - valvePath.distance - 1,
      visited);

    if (tmpValue > maxTotal) {
      maxTotal = tmpValue;
      // console.log(timeLeft, flowRate, maxTotal, visited);
    }
  }

  // console.log('delete', src);
  visited.delete(src);
  return maxTotal;
}

// this returns just the maxvalue and the best path.
const dfs2 = (src, graph, allValves, flowRate, timeLeft = MAXTIME, visited = new Set()) => {
  if (timeLeft <= 0) {
    // console.log('out of time');
    return [[[], 0]];
  }

  visited.add(src);
  
  if (allValves.every(v => visited.has(v))) {
    visited.delete(src);
      return [[[], timeLeft * flowRate]];
  }
  
  let allPaths = [];
  let maxTotal = 0;
  for (let neighbor of allValves) {
    if (visited.has(neighbor)) continue;    
    
    const valvePath = graph.find(p => p.src === src && p.target === neighbor);
const newVolume = Math.min((valvePath.distance + 1), timeLeft) * flowRate;    
    // const newVolume = (valvePath.distance + 1) * flowRate;

    const paths = dfs2(neighbor, graph, allValves,
      flowRate + valvePath.flowrate,
      timeLeft - valvePath.distance - 1,
      visited);

    // for all paths.
    // for (let path of paths) {
    //   allPaths.push([[neighbor, ...path[0]], newVolume + path[1]]);
    // }

    // only keep the best path.
    for (let path of paths) {
      if ((newVolume + path[1]) > maxTotal) {
        maxTotal = newVolume + path[1];
        allPaths.length = 0;
        allPaths.push([[neighbor, ...path[0]], newVolume + path[1]]);
      }
    }
  }

  visited.delete(src); 
  return allPaths;
}

const day16b = () => {
  const filename = './data/day16small.txt';
  const MAXTIME = 5;
  
  const [nodesWithValves, rawGraph] = buildGraph(filename);

  // find the shortest path from AA to all valves.
  // then find the shortest path from individual valves to other valves.
  let graph = [];
  for (let node of ['AA', ...nodesWithValves]) {
    for (let valveNode of nodesWithValves) {
      if (node !== valveNode) {
        const [path, distance] = shortestPath(node, valveNode, rawGraph);
        graph.push({
          src: node,
          target: valveNode,
          distance,
          flowrate: rawGraph[valveNode].maxFlowRate
        });
      }
    }
  }
   
  const allValves = Array.from(new Set(graph.map(g => g.target)));
  console.log(dfs3('AA', graph, allValves, 0, MAXTIME) );
}

const dfs3 = (src, graph, allValves, flowRate, timeLeft = MAXTIME, visited = new Set()) => {
  if (timeLeft <= 0) {
    // console.log('out of time');
    return [[[], 0]];
  }

  visited.add(src);
  
  if (allValves.every(v => visited.has(v))) {
    visited.delete(src);
    return [[[], timeLeft * flowRate]];
  }
    
  let allPaths = [];
  let maxTotal = 0;
  for (let neighbor of allValves) {
    if (visited.has(neighbor)) continue;    
    
    const valvePath = graph.find(p => p.src === src && p.target === neighbor);
const newVolume = Math.min((valvePath.distance + 1), timeLeft) * flowRate;    
    // const newVolume = (valvePath.distance + 1) * flowRate;

    const paths = dfs3(neighbor, graph, allValves,
      flowRate + valvePath.flowrate,
      timeLeft - valvePath.distance - 1,
      visited);

    // for all paths.
    for (let path of paths) {
      allPaths.push([[neighbor, ...path[0]], newVolume + path[1]]);
    }

    // only keep the best path.
    // for (let path of paths) {
    //   if ((newVolume + path[1]) > maxTotal) {
    //     maxTotal = newVolume + path[1];
    //     allPaths.length = 0;
    //     allPaths.push([[neighbor, ...path[0]], newVolume + path[1]]);
    //   }
    // }
  }

  visited.delete(src);
  return allPaths;
}

// use bfs to find the shortest path.
const shortestPath = (src, target, graph) => {
  const queue = [[src, 0, [src]]];
  const visited = new Set();

  while (queue.length > 0) {
    const [node, distance, path] = queue.shift();
    visited.add(node);
    if (node === target) {
      return [path, distance];
    }

    for (let neighbor of graph[node].neighbors) {
      if (!visited.has(neighbor)) {
        queue.push([neighbor, distance + 1, [...path, neighbor]]);
      }
    }
  }
}

const buildGraph = (filename) => {
  const lines = fs.readFileSync(filename,
    { encoding: 'utf8', flag: 'r' }).split('\n');

  const graph = {};
  const nodesWithValves = [];
  lines.forEach(line => {
    let nodes = line.match(/[A-Z]\w+/g);  // get all the nodes.
    let flowrates = line.match(/\d+/g);

    let source = nodes[1];
    let neighbors = nodes.slice(2);
    let flowrate = +flowrates[0];

    if (!(source in graph)) graph[source] = { maxFlowRate: 0, neighbors: [] };
    if (flowrate > 0) nodesWithValves.push(source);
    graph[source]['maxFlowRate'] = flowrate;
    graph[source]['neighbors'].push(...neighbors);
  })

  return [nodesWithValves, graph];
}

module.exports = { day16a, day16b }