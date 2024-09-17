import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Game from './components/Game';
import Puzzles from './components/Puzzles';
import Profile from './components/Profile'; // Import Profile

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
      </Routes>
    </Router>
  );
}

export default App;