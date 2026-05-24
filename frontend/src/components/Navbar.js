import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot } from 'react-icons/fa';
import './Navbar.css';
import axios from 'axios';
import { apiUrl } from '../config/api';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [status, setStatus] = useState({ count: 0, models: [] });
  const [evals, setEvals] = useState({});

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    let mounted = true;
    const fetchStatus = () => {
      axios.get(apiUrl('/api/status/models'))
        .then(res => {
          if (!mounted) return;
          const data = res.data || { count: 0, models: [] };
          setStatus(data);
        })
        .catch(() => {
          setStatus({ count: 0, models: [] });
        });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // poll every 30s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (!showStatusMenu) return;
    // fetch evaluation for each model shown
    status.models && status.models.forEach(m => {
      if (evals[m.id]) return; // already fetched
      axios.get(apiUrl(`/api/eval/${m.id}`))
        .then(res => {
          setEvals(prev => ({ ...prev, [m.id]: res.data }));
        })
        .catch(() => {
          setEvals(prev => ({ ...prev, [m.id]: { error: true } }));
        });
    });
  }, [showStatusMenu, status.models, evals]);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">
            <FaRobot className="logo-icon" />
          </span>
          <span className="logo-copy">
            <strong>Predictive Analytics</strong>
            <small>Risk intelligence suite</small>
          </span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/equipment-failure" className="nav-link" onClick={closeMenu}>
            Equipment Failure
          </Link>
          <Link to="/system-performance" className="nav-link" onClick={closeMenu}>
            System Performance
          </Link>
          <Link to="/student-analyzer" className="nav-link" onClick={closeMenu}>
            Student Analyzer
          </Link>
          <Link to="/health-tracker" className="nav-link" onClick={closeMenu}>
            Health Tracker
          </Link>
          <Link to="/logistics" className="nav-link" onClick={closeMenu}>
            Logistics
          </Link>
          <Link to="/quality-control" className="nav-link" onClick={closeMenu}>
            Quality Control
          </Link>
        </div>

        <div className="nav-actions">
          <div className="nav-status-wrapper">
            <div className="nav-status" aria-live="polite" onClick={() => setShowStatusMenu(!showStatusMenu)} role="button" tabIndex={0}>
              <span className="status-dot" style={{ background: status.count > 0 ? '#16a34a' : '#f59e0b' }} />
              <span className="status-text">{status.count} models</span>
            </div>
            {showStatusMenu && (
              <div className="nav-status-dropdown">
                {status.models && status.models.length ? status.models.map(m => (
                  <div key={m.id} className="nav-status-item">
                    <div className="nav-status-item-left">
                      <div className="status-dot" style={{ width:10, height:10, background: m.available ? '#16a34a' : '#ef4444' }} />
                      <div style={{ marginLeft: 8 }}>
                        <div style={{ fontWeight: 800 }}>{m.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{m.description}</div>
                        {evals[m.id] ? (
                          <div style={{ marginTop:6, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            <strong>Overfitting:</strong> {evals[m.id].overfitting ? 'Yes' : 'No'} •
                            <span style={{ marginLeft:6 }}><strong>Train:</strong> {evals[m.id].train_score_mean.toFixed(3)}</span>
                            <span style={{ marginLeft:6 }}><strong>Test:</strong> {evals[m.id].test_score_mean.toFixed(3)}</span>
                          </div>
                        ) : (
                          <div style={{ marginTop:6, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Evaluation: —</div>
                        )}
                      </div>
                    </div>
                  </div>
                )) : <div className="nav-status-item">No models</div>}
              </div>
            )}
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
