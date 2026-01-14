import React from 'react';
import '../styles/Footer.css';

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-info">
          <p className="footer-copyright">Quenton Ni</p>
          <p className="footer-updated">Last updated: January 2026</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
