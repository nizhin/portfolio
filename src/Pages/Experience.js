import {forwardRef } from 'react'
import Expr from '../components/Expr';
import "../styles/Experience.css"

const Experience = forwardRef(({projects, work}, ref) => {
  return (
    <div className="expr">

    <div className="projects"> 
      <p className='section'>Projects</p>
      <div className="cards-container">
      {projects.map ((proj, i) => 
        <Expr
          title={proj.title}
          links={proj.links}
          image={`${process.env.PUBLIC_URL}${proj.image}`}
          date={proj.date}
          description={proj.description}
          langs={proj.languages}
          badges={proj.badges}
          key={i}
          style={{ transitionDelay: `${i * 0.08}s` }}
        ></Expr>)
      }</div>
      </div>
      <div className="work">
        <p className='section' ref={ref}>Work</p>
        <div className="cards-container">

      {work.map ((proj, i) => 
        <Expr
          title={proj.title}
          links={proj.links}
          image={`${process.env.PUBLIC_URL}${proj.image}`}
          date={proj.date}
          description={proj.description}
          langs={proj.languages}
          badges={proj.badges}
          key={i}
          style={{ transitionDelay: `${i * 0.08}s` }}
        ></Expr>)
      }</div>
            </div>

    </div>
  );
});

export default Experience;
