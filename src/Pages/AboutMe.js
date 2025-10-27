import React from 'react'
import '../styles/AboutMe.css';

function AboutMe({setPage}) {
  const handleOpenPdf = () => {
    window.open(`${process.env.PUBLIC_URL}/resume.pdf`, '_blank'); // Replace with your PDF file path
  };
  return (
    <div className="about-me">

        <div className='intro'>
          <p className="title">👋 Hi, I'm Quenton Ni!</p>
          <p className="description"> I am a senior at the <strong>University of Minnesota - Twin Cities</strong>, pursuing a <strong>B.S. and Masters in Computer Science</strong>. </p>
          <br></br>
          <p className="description">I have a  passion for building software that makes a tangible impact. 
            I've worked across research and teaching, from exploring 
            neural network quantization to guiding students through Java and machine learning fundamentals. My interests lie in <strong>machine learning</strong> and <strong>software development</strong>.</p>
          <br></br>
          <p className="description">Check out my <u><b onClick={handleOpenPdf} style={{cursor: 'pointer'}}>resume</b></u>!</p>
          <p className="description">View some of my <u><b onClick={() =>{setPage("experience")}}  style={{cursor: 'pointer'}}>projects</b></u>.</p>
        </div>
        <div className="portrait-frame">
          <img className="portrait" src={`${process.env.PUBLIC_URL}/portrait.png`} alt="Quenton Ni portrait"></img>
        </div>
    </div>
  );
}

export default AboutMe;
