import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import './styles.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Footer = ({ copyrightYear = new Date().getFullYear(), appName = 'Student Feedback App', additionalLinks = [] }) => {
  return (
    <footer className="bg-secondary text-white text-center py-3 mt-auto">
      <p>&copy; {copyrightYear} {appName}. All rights reserved.</p>
      {additionalLinks.length > 0 && (
        <ul className="list-inline">
          {additionalLinks.map((link, index) => (
            <li key={index} className="list-inline-item">
              <a href={link.url} className="text-white">{link.text}</a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
};

function App() {
  const footerProps = {
    copyrightYear: new Date().getFullYear(),
    appName: 'Student Feedback App',
    additionalLinks: []
  };

  return (
    <Router>
      <div className="d-flex flex-column bg-light min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm">
          <div className="container">
            <Link className="navbar-brand text-white" to="/">Student Feedback App</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom text-white" to="/">Rate Course</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom text-white" to="/dashboard">View Feedback</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom text-white" to="/analytics">Dashboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container my-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <Footer {...footerProps} />
      </div>
    </Router>
  );
}

export default App;