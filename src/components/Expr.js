import {React, useState, useEffect} from 'react'
import '../styles/Expr.css';


function Expr({title, links, image, date, description, langs, style}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); 
  }, []);
  return (
    <div className="project">
      <div className={`card ${isVisible ? 'slide-in' : ''}`} style={style}>
        <div className="card-front">
          <img className='project-image' src={image ? image : ''} alt = ''></img>
          <div className='project-info'>    
              <p className="project-title">{title}</p>
              <p className='project-date'>{date}</p>
              <div className='project-description-container'>
                {description.map((desc, i) => 
                  <p className='project-description'>{desc}</p>
                )}
              </div>
              {langs.map((lang, i) =>
                <p className='proj-langs' key={i}>{lang}</p>
              )}
              {links.length === 0 ? "" : "|"}
              {links.map((link, i) => 
                <a className='project-link' key = {i} href={link[1]} target="_blank" rel="noreferrer">{link[0]}</a>
              )}
              </div>
            </div>
          </div>
    </div>
    
  );
}

export default Expr;
