// A-star's algorithm
// return all nodes in the order of visited.
// Make nodes point back to their previous node, which allows us to get the shortest path by backtracking from the finish node.
var Heap = require("heap");

export function astar(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  const visitedNodesInOrder = [];
  startNode.gDistance = 0;
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid, finishNode);

  unvisitedNodes.push(startNode);
  console.log(unvisitedNodes);
  while (!!unvisitedNodes.size()) {
    // "!!" converts Object to boolean.
    //sortNodesByDistance(unvisitedNodes); //could implement minheap heap for better porformance
    unvisitedNodes.heapify();
    const closestNode = unvisitedNodes.pop();
    // console.log(unvisitedNodes);
    // handle walls
    if (closestNode.isWall) continue;
    // handle conorcase: trapped inside the wall
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbors(closestNode, grid, unvisitedNodes);
  }
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.gDistance = node.gDistance + 1;
    neighbor.distance = neighbor.hDistance + neighbor.gDistance;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid, finishNode) {
  var nodes = new Heap(function (a, b) {
    return a.distance - b.distance;
  });
  for (const row of grid) {
    for (const node of row) {
      node.hDistance = manhattanDistance(node, finishNode);
      nodes.push(node);
    }
  }
  return nodes;
}

function manhattanDistance(one, two) {
  let colOne = one.col;
  let rowOne = one.row;
  let colTwo = two.col;
  let rowTwo = two.row;
  let deltaCol = Math.abs(colOne - colTwo);
  let deltaRow = Math.abs(rowOne - rowTwo);
  return (deltaCol + deltaRow) * 2;
}

// function euclideanDistance(one, two) {
//   let colOne = one.col;
//   let rowOne = one.row;
//   let colTwo = two.col;
//   let rowTwo = two.row;
//   let deltaCol = Math.abs(colOne - colTwo);
//   let deltaRow = Math.abs(rowOne - rowTwo);
//   return Math.sqrt(deltaCol * deltaCol + deltaRow * deltaRow);
// }

export function getNodesInShortestPathOrderOfAstar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
