# Quenton Ni — Portfolio

A small static portfolio with a shared layout, editable JSON content, and light/dark themes. Published at https://nizhin.github.io/portfolio/. Building and previewing require only Node.js 20 or newer; the deployment tool is installed with `npm ci`.

## Preview

From this directory, run `npm run build`, then `npm start`. Open the printed local URL (normally http://127.0.0.1:4174).

Run the build again and refresh the browser after edits. `PORT` can override the preview port.

## Content

- `data/site.json` contains the home introduction, portrait, full biography, contact details, resume link, and project-list introduction.
- `data/projects.json` contains projects in display order. Featured entries also appear on Home.
- `data/work.json` contains experience entries in display order.
- `public/` holds files such as the portrait, resume, and project reports. Project images are not displayed.
- `build.mjs` generates home, projects, about, and individual project pages.
- `style.css` controls the layout and typography.
- `dist/` is the generated static website. It works at a domain root or under a path such as `/portfolio/`.

The previous React implementation is preserved in Git history. Local `minimal/` and `redesign/` directories are earlier previews and are not the active source.

## Add a project

Add an object to the array in `data/projects.json` (with a comma between objects):

```json
{
  "title": "My next project",
  "slug": "my-next-project",
  "date": "2027",
  "featured": true,
  "summary": "A short explanation of what the project does.",
  "description": [
    "What I built and why.",
    "A second paragraph with details about my contribution."
  ],
  "topics": ["Python", "Machine Learning"],
  "links": [
    ["GitHub", "https://github.com/your-account/your-project"],
    ["Report", "/my-project-report.pdf"]
  ]
}
```

Only `title`, `date`, and a nonempty `description` array are required. `featured`, `summary`, `topics`, and `links` are optional. Set `featured` to `true` to include it on Home. The one-sentence `summary` appears at the top of the individual project page and in its search description; project lists show only titles and dates. Each description string becomes a paragraph; array order controls project order. Existing `badges` and `languages` fields remain supported for topics.

Use a unique `slug` with lowercase letters, numbers, and hyphens. Keep it unchanged when renaming a project so existing links keep working. If omitted, the slug is generated from the title. The build checks for duplicate or invalid slugs before replacing generated pages.

Put downloadable files in `public/`, then use a path such as `/my-project-report.pdf`. Local links automatically work from nested pages and under a deployment path. No image field is needed.

Run `npm run build` and refresh the preview. The project list, individual page, and featured list update automatically. Do not edit `dist/` directly; the next build replaces it.

## Add experience or update the biography

Edit `home.intro` in `data/site.json` for the short home introduction and `about` for the full biography. Both use arrays of paragraph strings. Contact and social links live in the same file.

Add an entry to `data/work.json` using `role`, `organization`, `date`, and `description` (an array of paragraphs). The existing combined `title` format also works. Reorder entries in the array to change their display order, then rebuild.

## Appearance

Shared page layout and navigation live in `build.mjs`; all pages use `style.css`. For a future section, add its data and template there and register its page in the `pages` array and navigation in `nav`.

Light and dark colors are CSS variables at the top of `style.css`. The small `public/theme.js` script follows the device preference initially and remembers a visitor's explicit choice across pages and visits. Without JavaScript, the site remains usable and follows the device theme through CSS. No external fonts or packages are required.

## Navigation

`public/navigation.js` enhances internal page links with client-side navigation. It fetches HTML and replaces the main content and active navigation while preserving the theme button, page shell, and browser history. Links are prefetched on pointer hover or keyboard focus, except on data-saving or slow connections. A small in-memory cache lasts for the current browsing session.

Direct URLs and refreshes still load complete HTML pages. PDF downloads, email, external links, same-page anchors, and modified clicks retain their normal browser behavior. Failed requests fall back to ordinary page navigation. Back/Forward restores the saved scroll position, and new pages focus the main content for keyboard and screen-reader users.

On localhost, browser debug logs report full-document DOM-ready/load timings and client-side time from navigation to content update. These measure different milestones and are useful for local diagnosis, not a claim about production network latency. The navigation script also records `portfolio:navigation` Performance measures for browser developer tools.

## Validate and publish

Run `npm run build` followed by `npm run check` to validate all generated pages, local links, assets, and content. Commit source changes and push to `main`, then run `npm run deploy` to build, validate, and publish `dist/` to the existing `gh-pages` branch. GitHub Pages serves that branch. Generated output is not committed to `main`.
