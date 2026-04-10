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
        <p className="description"> I am a senior at the <strong>University of Minnesota - Twin Cities</strong>, working on a <strong>B.S. and Masters in Computer Science</strong>. </p>
        <br></br>
        <p className="description">I like building software that actually solves problems.
         I've recently been doing some interesting research on neural network compression methods! In my free time I enjoy playing video games, working out, and playing piano.</p>
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
