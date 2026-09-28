import { useEffect, useState } from 'react';
import site from './data/site.json';
import projects from './data/projects.json';
import experience from './data/work.json';
import ProjectVisual, { hasProjectVisual } from './ProjectVisual';
import './App.css';

const featuredProjects = projects.filter((project) => project.featured === true);
const otherProjects = projects.filter((project) => project.featured !== true);
const localAsset = (path) => `${process.env.PUBLIC_URL}${path}`;
const destination = (url) => url.startsWith('/') ? localAsset(url) : url;

function ExternalLink({ href, children }) {
  return <a href={destination(href)} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

function Topics({ item }) {
  const topics = item.badges?.length
    ? item.badges.map((badge) => badge.label)
    : item.languages || [];
  return topics.length ? <p className="topics">{topics.join(' · ')}</p> : null;
}

function ProjectDetails({ project, compact = false }) {
  const showVisual = compact && hasProjectVisual(project.visual);
  return <div className="project-details">
    {showVisual && <ProjectVisual kind={project.visual} />}
    {project.image && !showVisual && <img className="project-image" src={localAsset(project.image)} alt={`${project.title} preview`} loading="lazy" />}
    <div className="project-copy">
      {(compact ? project.description.slice(0, 1) : project.description).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {compact && project.description.length > 1 && <details className="project-more">
        <summary><span className="more-label">More details</span><span className="less-label">Show less</span></summary>
        {project.description.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </details>}
      <Topics item={project} />
      {project.links?.length > 0 && <div className="project-links">
        {project.links.map(([label, href]) => <ExternalLink key={`${label}-${href}`} href={href}>{label}</ExternalLink>)}
      </div>}
    </div>
  </div>;
}

function Experience() {
  return <div className="experience-list">
    {experience.map((item) => {
      const [titleRole, titleOrganization] = (item.title || '').split(' · ');
      const role = item.role || titleRole;
      const organization = item.organization || titleOrganization;
      return <article className="experience-entry" key={`${role}-${organization}-${item.date}`}>
        <div className="experience-meta">
          <h3>{role}</h3>
          {organization && <p className="organization">{organization}</p>}
          <span className="date">{item.date}</span>
        </div>
        <div className="experience-body">
          <ul>{item.description.map((paragraph) => <li key={paragraph}>{paragraph}</li>)}</ul>
          <Topics item={item} />
        </div>
      </article>;
    })}
  </div>;
}

function Projects() {
  const [selectedTitle, setSelectedTitle] = useState(featuredProjects[0]?.title);
  const selectedProject = featuredProjects.find((project) => project.title === selectedTitle) || featuredProjects[0];

  return <>
    {selectedProject && <div className="featured-projects" aria-label="Featured projects">
      <div className="featured-index">
        <p className="featured-label">Featured work <span>{String(featuredProjects.length).padStart(2, '0')}</span></p>
        <div className="featured-items">
          {featuredProjects.map((project, index) => {
            const selected = selectedProject.title === project.title;
            return <button type="button" className={`project-select ${selected ? 'is-selected' : ''}`}
              aria-pressed={selected} key={project.title} onClick={() => setSelectedTitle(project.title)}>
              <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-title">{project.title}</span>
              <span className="project-symbol" aria-hidden="true">↗</span>
            </button>;
          })}
        </div>
      </div>
      <article className="featured-preview" aria-label={`${selectedProject.title} details`}>
        <div className="featured-preview-inner" key={selectedProject.title}>
          <div className="preview-heading"><h3>{selectedProject.title}</h3><span>{selectedProject.date}</span></div>
          <ProjectDetails project={selectedProject} compact />
        </div>
      </article>
    </div>}

    {otherProjects.length > 0 && <div className="project-archive">
      <h3>More projects <span>({otherProjects.length})</span></h3>
      {otherProjects.map((project) => <details className="archive-entry" key={project.title}>
        <summary><span>{project.title}</span><small>{project.date}</small><span className="archive-symbol" aria-hidden="true">+</span></summary>
        <ProjectDetails project={project} />
      </details>)}
    </div>}
  </>;
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark'; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); }
    catch {}
  }, [dark]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="page" id="top">
      <header className="site-header">
        <div className="identity">
          <a href="#top" className="site-name">{site.name}</a>
          <span>{site.headline}</span>
        </div>
      </header>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <button type="button" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
          {dark ? 'Light' : 'Dark'} mode
        </button>
      </nav>

      <main id="main">
        <section id="about" className="content-section about-section" aria-labelledby="about-title">
          <h2 id="about-title"><span aria-hidden="true">##</span> About</h2>
          <div className="about-grid">
            <div className="about-copy">
              {site.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="inline-links"><ExternalLink href={site.resume}>Résumé</ExternalLink>
                {site.links.map(({ label, url }) => <ExternalLink key={label} href={url}>{label}</ExternalLink>)}
              </p>
            </div>
          </div>
        </section>

        <section id="experience" className="content-section" aria-labelledby="experience-title">
          <h2 id="experience-title"><span aria-hidden="true">##</span> Experience</h2>
          <Experience />
        </section>

        <section id="projects" className="content-section" aria-labelledby="projects-title">
          <h2 id="projects-title"><span aria-hidden="true">##</span> Projects</h2>
          <p className="section-intro">Select a project to see more about it.</p>
          <Projects />
        </section>

        <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
          <h2 id="contact-title"><span aria-hidden="true">##</span> Contact</h2>
          <p>{site.contactText}</p>
          <a className="email-link" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className="site-footer"><span>© {new Date().getFullYear()} {site.name}</span><a href="#top">Back to top ↑</a></footer>
    </div>
  </>;
}
