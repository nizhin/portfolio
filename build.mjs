import { readFile, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const read = async (name) => JSON.parse(await readFile(path.join(root, 'data', `${name}.json`), 'utf8'));
const [site, projects, work] = await Promise.all(['site', 'projects', 'work'].map(read));
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const slug = (title) => title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const projectSlug = (project) => project.slug || slug(project.title);
const usedSlugs = new Set();
for (const project of projects) {
  const id = projectSlug(project);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || usedSlugs.has(id)) {
    throw new Error(`Project "${project.title}" needs a unique slug using lowercase letters, numbers, and hyphens.`);
  }
  if (!project.title || !project.date || !Array.isArray(project.description) || !project.description.length || project.description.some((text) => typeof text !== 'string')) {
    throw new Error(`Project "${project.title}" needs a title, date, and nonempty description array.`);
  }
  if (project.links && (!Array.isArray(project.links) || project.links.some((item) => !Array.isArray(item) || item.length !== 2 || item.some((value) => typeof value !== 'string')))) {
    throw new Error(`Project "${project.title}" links must be [label, URL] pairs.`);
  }
  if (project.summary !== undefined && typeof project.summary !== 'string') {
    throw new Error(`Project "${project.title}" summary must be a string.`);
  }
  usedSlugs.add(id);
}
const href = (url, base) => url.startsWith('/') ? `${base}${url.slice(1)}` : url;
const link = (label, url, base) => `<a href="${escape(href(url, base))}">${escape(label)}</a>`;
const paragraphs = (items) => items.map((text) => `<p>${escape(text)}</p>`).join('\n');

function layout({ title, active, base = './', content, description }) {
  const nav = [['home', '', 'home'], ['projects', 'projects/', 'projects'], ['about', 'about/', 'about']];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(description || "Quenton Ni — Computer Science M.S. student at the University of Minnesota. Software engineering, applied AI, and selected projects.")}">
  <meta name="theme-color" content="#fcfbf8">
  <title>${escape(title ? `${title} — ${site.name}` : site.name)}</title>
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
  <script src="${base}theme.js"></script>
  <script src="${base}navigation.js" defer></script>
  <link rel="stylesheet" href="${base}style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="page">
    <header>
      <nav aria-label="Main navigation">
        ${nav.map(([label, route, key]) => `<a href="${base}${route}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ')}
        ${link('resume', site.resume, base)}
      </nav>
      <button class="theme-toggle" type="button" aria-label="Switch to dark mode" hidden>dark</button>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <div class="footer-links" aria-label="Contact links">
        ${link('email', `mailto:${site.email}`, base)}
        ${site.links.map(({ label, url }) => link(label.toLowerCase(), url, base)).join('\n        ')}
      </div>
      <p>© ${new Date().getFullYear()} ${escape(site.name)}</p>
    </footer>
  </div>
</body>
</html>`;
}

function projectList(items, base) {
  return `<ul class="project-list">${items.map((project) => `<li>
    <a href="${base}projects/${projectSlug(project)}/"><span class="project-year">${escape(project.date)}</span><span class="project-name">${escape(project.title)}</span></a>
  </li>`).join('\n')}</ul>`;
}

const home = layout({ active: 'home', content: `
  <section class="intro" aria-labelledby="intro-title">
    <h1 id="intro-title">${escape(site.home.title)}</h1>
    <div class="intro-layout">
      <div class="intro-copy">
        ${paragraphs(site.home.intro)}
      </div>
      <img class="portrait" src="${escape(href(site.home.portrait.src, './'))}" alt="${escape(site.home.portrait.alt)}" width="156" height="208">
    </div>
  </section>
  <section class="selected-work" aria-labelledby="selected-title">
    <div class="section-heading"><h2 id="selected-title">Selected projects</h2><a class="quiet-link" href="./projects/">All projects <span aria-hidden="true">→</span></a></div>
    ${projectList(projects.filter((project) => project.featured), './')}
  </section>
` });

const projectIndex = layout({ title: 'Projects', active: 'projects', base: '../', content: `
  <h1>Projects</h1>
  <p class="page-intro">${escape(site.projectsIntro)}</p>
  ${projectList(projects, '../')}
` });

const about = layout({ title: 'About', active: 'about', base: '../', content: `
  <h1>About me</h1>
  <div class="prose">${paragraphs(site.about)}</div>
  <section class="experience" aria-labelledby="experience-title">
    <h2 id="experience-title">Experience</h2>
    ${work.map((item) => {
      const [role, organization] = (item.title || '').split(' · ');
      return `<article class="experience-entry">
        <h3>${escape(item.organization || organization || '')}</h3>
        <p class="role">${escape(item.role || role)}</p>
        <p class="date">${escape(item.date)}</p>
        <div class="prose">${paragraphs(item.description)}</div>
      </article>`;
    }).join('\n')}
  </section>
  <section class="contact" aria-labelledby="contact-title"><h2 id="contact-title">Get in touch</h2><p>${escape(site.contactText)} ${link(site.email, `mailto:${site.email}`, '../')}</p></section>
` });

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });
await cp(path.join(root, 'style.css'), path.join(out, 'style.css'));
await writeFile(path.join(out, '.nojekyll'), '');
const pages = [['index.html', home], ['projects/index.html', projectIndex], ['about/index.html', about]];
for (const project of projects) {
  const base = '../../';
  const topics = project.topics || project.badges?.map((badge) => badge.label) || project.languages || [];
  pages.push([`projects/${projectSlug(project)}/index.html`, layout({
    title: project.title, active: 'projects', base, description: project.summary || project.description[0],
    content: `<article class="project-detail">
      <a class="back-link" href="../"><span aria-hidden="true">←</span> All projects</a>
      <h1>${escape(project.title)}</h1>
      <p class="project-meta">${escape(project.date)}${topics.length ? ` <span aria-hidden="true">·</span> ${topics.map(escape).join(' / ')}` : ''}</p>
      ${project.summary ? `<p class="project-summary">${escape(project.summary)}</p>` : ''}
      <div class="prose">${paragraphs(project.description)}</div>
      ${project.links?.length ? `<div class="project-links">${project.links.map(([label, url]) => link(label, url, base)).join('\n')}</div>` : ''}
    </article>`
  })]);
}
for (const [name, html] of pages) {
  const file = path.join(out, name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}
console.log(`Built ${pages.length} pages with ${projects.length} projects and ${work.length} experience entries.`);
