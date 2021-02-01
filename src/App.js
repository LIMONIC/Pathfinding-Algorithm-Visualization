import React from "react";
import Header from "./components/Header";
// import "./App.css";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";

function App() {
  return (
    <div className="App body-style">
      <Header />
      <PathfindingVisualizer />
    </div>
  );
}

export default App;
