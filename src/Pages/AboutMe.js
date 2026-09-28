import React from 'react'
import '../styles/AboutMe.css';

function AboutMe({ setPage }) {
  const handleOpenPdf = () => {
    window.open(`${process.env.PUBLIC_URL}/resume.pdf`, '_blank'); // Replace with your PDF file path
  };
  return (
    <div className="about-me">

      <div className='intro'>
        <p className="title">👋 Hi, I'm Quenton Ni!</p>
        <p className="description">I earned my <strong>B.S. in Computer Science</strong> with High Distinction from the <strong>University of Minnesota</strong> in May 2026. I'm continuing there in the <strong>M.S. in Computer Science</strong> program, with graduation expected in May 2027.</p>
        <br></br>
        <p className="description">I build software and applied AI tools that solve practical problems. My recent work includes automating sales research, building a diagnostic-log workflow for Medtronic, and compressing a cardiac arrhythmia model. In my free time, I enjoy video games, working out, and playing piano.</p>
        <br></br>
        <p className="description">Check out my <u><b onClick={handleOpenPdf} style={{ cursor: 'pointer' }}>resume</b></u>!</p>
        <p className="description">View some of my <u><b onClick={() => { setPage("experience") }} style={{ cursor: 'pointer' }}>projects</b></u>.</p>
      </div>
      <div className="portrait-frame">
        <img className="portrait" src={`${process.env.PUBLIC_URL}/portrait.png`} alt="Quenton Ni portrait"></img>
      </div>
    </div>
  );
}

export default AboutMe;
