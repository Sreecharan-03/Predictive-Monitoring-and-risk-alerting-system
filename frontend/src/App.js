import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Task1 from './pages/Task1';
import Task2 from './pages/Task2';
import Task3 from './pages/Task3';
import Task4 from './pages/Task4';
import Task5 from './pages/Task5';
import Task6 from './pages/Task6';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/equipment-failure" element={<Task1 />} />
            <Route path="/system-performance" element={<Task2 />} />
            <Route path="/student-analyzer" element={<Task3 />} />
            <Route path="/health-tracker" element={<Task4 />} />
            <Route path="/logistics" element={<Task5 />} />
            <Route path="/quality-control" element={<Task6 />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
