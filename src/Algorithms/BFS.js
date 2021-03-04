// BFS's algorithm
// return all nodes in the order of visited.
// Make nodes point back to their previous node, which allows us to get the shortest path by backtracking from the finish node.

export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const dx = [0, 0, 1, -1];
  const dy = [1, -1, 0, 0];
  startNode.distance = 0;
  const queue = [];
  grid[startNode.row][startNode.col].distance = 0;
  grid[startNode.row][startNode.col].isVisited = true;
  queue.push(grid[startNode.row][startNode.col]);
  //const unvisitedNodes = getAllNodes(grid);
  while (queue.length !== 0) {
    let size = queue.length;

    // console.log(size + " " + queue.length);
    for (var i = 0; i < size; i++) {
      // console.log(queue.length + " i:" + i);

      let closestNode = queue.shift();
      console.log(closestNode.row * grid.length + closestNode.col);
      // handle walls
      if (closestNode.isWall) continue;
      // handle conorcase: trapped inside the wall
      visitedNodesInOrder.push(closestNode);

      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      if (closestNode === finishNode) {
        return visitedNodesInOrder;
      }

      for (var j = 0; j < 4; j++) {
        const { row, col } = closestNode;
        const newX = row + dx[j];
        const newY = col + dy[j];

        if (isValid(newX, newY, grid) && !grid[newX][newY].isVisited) {
          grid[newX][newY].distance = 1;
          grid[newX][newY].previousNode = closestNode;
          console.log(grid[newX][newY].isVisited);
          grid[newX][newY].isVisited = true;
          queue.push(grid[newX][newY]);
        }
      }
    }
  }
}

function isValid(x, y, grid) {
  return x < grid.length && x >= 0 && y < grid[0].length && y >= 0;
}

export function getNodesInShortestPathOrderOfBFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
