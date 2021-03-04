import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/dijkstra";
import { astar, getNodesInShortestPathOrderOfAstar } from "../Algorithms/astar";
import { bfs, getNodesInShortestPathOrderOfBFS } from "../Algorithms/BFS";
import Button from "../components/Button";
import "./PathfindingVisualizer.css";
import "./Node/Node.css";

const height = window.innerHeight;
const width = window.innerWidth;
const maxRow = height / 40;
const maxCol = width / 30;
const START_NODE_ROW = Math.floor(maxRow * 0.5);
const START_NODE_COL = Math.floor(maxCol * 0.25);
const FINISH_NODE_ROW = Math.floor(maxRow * 0.5);
const FINISH_NODE_COL = Math.floor(maxCol * 0.75);

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = GetInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualize(name) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    if (name === "Dijkstra") {
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    if (name === "astar") {
      const visitedNodesInOrder = astar(grid, startNode, finishNode);
      const NodesInShortestPathOrderOfAstar = getNodesInShortestPathOrderOfAstar(
        finishNode
      );
      this.animateAlgorithm(
        visitedNodesInOrder,
        NodesInShortestPathOrderOfAstar
      );
    }
    if (name === "bfs") {
      const visitedNodesInOrder = bfs(grid, startNode, finishNode);
      const NodesInShortestPathOrderOfBFS = getNodesInShortestPathOrderOfBFS(
        finishNode
      );
      this.animateAlgorithm(visitedNodesInOrder, NodesInShortestPathOrderOfBFS);
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div>
        <header>
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1 className="title">Pathfinding Visualizer</h1>
              <div className="row operation-panel">
                <Button
                  name="Dijkstra"
                  className="btn btn-primary"
                  onClick={() => this.visualize("Dijkstra")}
                ></Button>
                <Button
                  name="A*"
                  className="btn btn-primary"
                  onClick={() => this.visualize("astar")}
                ></Button>
                <Button
                  name="BFS"
                  className="btn btn-primary"
                  onClick={() => this.visualize("bfs")}
                ></Button>
                <Button
                  name="Clear Board"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    window.location.reload();
                  }}
                ></Button>
              </div>
            </div>
            <div className="instruction">
              <ul>
                <li>
                  <div class="node-start"></div>Start Node
                </li>
                <li>
                  <div class="node-finish"></div>Target Node
                </li>
                <li>
                  <div class="unvisited"></div>Unvisited Node
                </li>
                <li>
                  <div class="node-visited"></div>Visited Nodes
                </li>
                <li>
                  <div class="node-shortest-path"></div>Shortest-path Node
                </li>
                <li>
                  <div class="node-wall"></div>Wall Node
                </li>
              </ul>
            </div>
            <p>Drag the mouse to add wall blocks!</p>
          </div>
        </header>

        <table className="grid">
          <tbody className="grid-body">
            {grid.map((row, rowIdx) => {
              return (
                <tr className="board-row" key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                      ></Node>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const GetInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < maxRow; row++) {
    const currentRow = [];
    for (let col = 0; col < maxCol; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    hDistance: Infinity,
    gDistance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
