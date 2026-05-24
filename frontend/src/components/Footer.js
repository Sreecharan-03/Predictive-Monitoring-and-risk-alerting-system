import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaRobot, FaArrowRight } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h3>
              <span className="footer-logo">
                <FaRobot />
              </span>
              Predictive AI
            </h3>
            <p>Professional AI dashboards for operational risk, health, quality, and logistics decisions.</p>
            <div className="footer-pill">Fast predictions. Clear outcomes. Better decisions.</div>
          </div>

          <div className="footer-section">
            <h4>Tasks</h4>
            <ul>
              <li><Link to="/equipment-failure">Machine Failure Prediction <FaArrowRight /></Link></li>
              <li><Link to="/system-performance">Server Downtime Prediction <FaArrowRight /></Link></li>
              <li><Link to="/student-analyzer">Student Dropout Monitoring <FaArrowRight /></Link></li>
              <li><Link to="/health-tracker">Hospital Readmission Risk <FaArrowRight /></Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>More Tasks</h4>
            <ul>
              <li><Link to="/logistics">Supply Chain Risk <FaArrowRight /></Link></li>
              <li><Link to="/quality-control">Quality Defect Warning <FaArrowRight /></Link></li>
            </ul>
          </div>

          <div className="footer-section social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Predictive Monitoring & Risk Alerting System. Built for clear, real-time prediction workflows.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
