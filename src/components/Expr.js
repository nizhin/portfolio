import {React, useState, useEffect, useMemo} from 'react'
import '../styles/Expr.css';

const normalizeBadge = (badge) => {
  if (typeof badge === 'string') {
    return { label: badge, variant: 'neutral' };
  }

  if (!badge || typeof badge !== 'object') {
    return null;
  }

  const label = typeof badge.label === 'string' ? badge.label.trim() : '';
  if (!label) {
    return null;
  }

  const variant = typeof badge.variant === 'string' && badge.variant.trim()
    ? badge.variant.trim()
    : 'neutral';

  return { label, variant };
};

const buildBadgeList = (badgesProp = [], langs = []) => {
  const items = [];
  const seen = new Set();

  const addBadge = (badge) => {
    const normalized = normalizeBadge(badge);
    if (!normalized) {
      return;
    }
    const key = normalized.label.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    items.push(normalized);
  };

  badgesProp.forEach(addBadge);

  if (items.length === 0) {
    langs.forEach((lang) => addBadge({ label: lang, variant: 'neutral' }));
  }

  return items;
};
function Expr({title, links, image, date, description, langs = [], badges: badgeProp = [], style}) {
  const [isVisible, setIsVisible] = useState(false);

  const badges = useMemo(() => {
    return buildBadgeList(badgeProp, langs);
  }, [badgeProp, langs]);

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
              <div className='project-date-and-links'>
                <span className='project-date'>{date}</span>
                {links.length > 0 && (
                  <>
                    {links.map((link, i) => {
                      const href = link[1].startsWith('http') ? link[1] : `${process.env.PUBLIC_URL}${link[1]}`;
                      return <a className='project-link' key = {i} href={href} target="_blank" rel="noreferrer">{link[0]}</a>
                    })}
                  </>
                )}
              </div>
              <div className='project-description-container'>
                {description.map((desc, i) => 
                  <p className='project-description' key={`desc-${i}`}>{desc}</p>
                )}
              </div>
              <div className='project-badges' aria-label='Key skills' role='list'>
                {badges.map(({ label, variant }, i) => (
                  <span
                    className={`proj-badge ${variant ? `proj-badge--${variant}` : ''}`.trim()}
                    role='listitem'
                    key={`badge-${i}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              </div>
            </div>
          </div>
    </div>
    
  );
}

export default Expr;
