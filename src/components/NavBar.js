import { useState, useEffect } from 'react';
import '../styles/NavBar.css';

function NavBar({ setPage, goToWork }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (nextPage, callback) => {
    setPage(nextPage);
    if (callback) {
      callback();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`nav-bar ${isMenuOpen ? 'nav-bar--open' : ''}`}>
      <button
        className='nav-bar-button nav-bar-brand'
        onClick={() => handleNavigation('about')}
      >
        Quenton Ni
      </button>
      <button
        className={`nav-toggle ${isMenuOpen ? 'nav-toggle--open' : ''}`}
        aria-expanded={isMenuOpen}
        aria-controls='nav-links'
        aria-label='Toggle navigation menu'
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className='nav-toggle-line' />
        <span className='nav-toggle-line' />
        <span className='nav-toggle-line' />
      </button>
      <div id='nav-links' className={`nav-links ${isMenuOpen ? 'nav-links--visible' : ''}`}>
        <button className='nav-bar-button' onClick={() => handleNavigation('experience')}>
          Projects
        </button>
        <button className='nav-bar-button' onClick={() => handleNavigation('work', goToWork)}>
          Work
        </button>
        <button className='nav-bar-button' onClick={() => handleNavigation('contact')}>
          Contact Me
        </button>
      </div>
    </nav>
  );
}

export default NavBar;