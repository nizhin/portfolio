
import './App.css';
import { useRef, useState, useEffect } from 'react'
import Experience from './Pages/Experience';
import AboutMe from './Pages/AboutMe';
import Contact from './Pages/Contact'
import NavBar from './components/NavBar';
import Link from './components/Link'
import Footer from './components/Footer';
import ProjectData from './data/projects.json';
import WorkData from './data/work.json'
import StarsCanvas from './components/Stars';

function App() {
  const [page, setPage] = useState("about")
  const workRef = useRef(null);
  const [darkMode, setDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    if (page === "work" && workRef.current) {
      workRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }, [page]);
  const goToWork = () => {

    if (workRef.current) {
      workRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  };
  const dark_img_style = darkMode ? {
    height: "30px",
    filter: "invert(100%)",
  } : {
    height: "30px",
  };
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => setDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);



  const projects = ProjectData;
  const work = WorkData;
  return (

    <div className="app" data-theme={darkMode ? 'dark' : 'light'}>

      <div className='header'>
        <NavBar setPage={setPage} goToWork={goToWork}></NavBar>
        <div className='links'>
          <button className="mode-toggle" onClick={() => { setDarkMode(!darkMode) }} aria-label="Toggle Dark Mode">
            <img className={`darkmode-img ${darkMode ? 'dark-mode' : 'light-mode'}`} src={darkMode ? `${process.env.PUBLIC_URL}/light_mode1.png` : `${process.env.PUBLIC_URL}/dark_mode2.png`} style={dark_img_style} alt='Dark mode toggle icon'></img>
          </button>
          <Link linkaddr='https://linkedin.com/in/quenton-ni' img={`${process.env.PUBLIC_URL}/icons8-linkedin-50.png`} name='LinkedIn' dark={darkMode}></Link>
          <Link linkaddr='https://github.com/nizhin' img={`${process.env.PUBLIC_URL}/github-mark.png`} name='Github' dark={darkMode}></Link>
        </div>
      </div>
      <div className='tabs'>

        <StarsCanvas darkMode={darkMode} />

        {page === "about" ? (
          <AboutMe setPage={setPage} />
        ) : page === "experience" || page === "work" ? (
          <Experience projects={projects} work={work} ref={workRef} />
        ) : (
          <Contact />
        )}

        <Footer setPage={setPage} />
      </div>
    </div>
  );
}

export default App;
