import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardList from "./components/BoardList";
import BoardWrite from "./components/BoardWrite";
import BoardDetail from "./components/BoardDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1
            onClick={() => (window.location.href = "/")}
            style={{ cursor: "pointer" }}
          >
            Cloud Board System
          </h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<BoardList />} />
            <Route path="/write" element={<BoardWrite />} />
            <Route path="/detail/:boardId" element={<BoardDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Cloud Board Project. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
