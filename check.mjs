import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const read = (file) => readFile(path.join(root, file), 'utf8');
const projects = JSON.parse(await read('data/projects.json'));
const work = JSON.parse(await read('data/work.json'));
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function pages(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await pages(file));
    else if (entry.name.endsWith('.html')) result.push(file);
  }
  return result;
}
const generated = await pages(dist);
assert.equal(generated.length, projects.length + 3, 'Every project must have a page');
for (const file of generated) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: one primary heading`);
  assert(html.includes('>resume</a>') && html.includes('class="theme-toggle"'), `${file}: shared navigation`);
  assert(!html.includes('undefined'), `${file}: missing content`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) continue;
    const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
    const target = path.resolve(path.dirname(file), pathname);
    assert(target.startsWith(dist + path.sep) || target === dist, `${file}: asset escapes deployment`);
    const info = await stat(target);
    if (info.isDirectory()) await stat(path.join(target, 'index.html'));
  }
  if (file.startsWith(path.join(dist, 'projects') + path.sep)) {
    assert(!html.includes('<img'), `${file}: project images should not render`);
  }
}
const home = await read('dist/index.html');
const index = await read('dist/projects/index.html');
for (const project of projects) {
  assert(index.includes(`<span class="project-name">${escape(project.title)}</span>`), `${project.title}: missing from index`);
  assert.equal(home.includes(`<span class="project-name">${escape(project.title)}</span>`), !!project.featured, `${project.title}: featured selection`);
  if (project.summary) {
    assert(!home.includes(escape(project.summary)) && !index.includes(escape(project.summary)), `${project.title}: summaries belong on detail pages`);
    const slug = project.slug || project.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    assert((await read(`dist/projects/${slug}/index.html`)).includes(`<p class="project-summary">${escape(project.summary)}</p>`), `${project.title}: missing summary`);
  }
}
const about = await read('dist/about/index.html');
for (const entry of work) {
  for (const paragraph of entry.description) assert(about.includes(escape(paragraph)), 'Missing experience text');
}
console.log(`Checked ${generated.length} pages, ${projects.length} projects, ${work.length} experience entries, navigation, and every local resource link.`);
