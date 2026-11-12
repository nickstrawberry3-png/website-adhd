// Puts each page's full text into the built HTML, so crawlers that never run
// JavaScript (GPTBot, ClaudeBot, PerplexityBot) still read the page.
import { build } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const ssrDir = path.join(root, '.ssr')

const pages = [
  { entry: 'src/home/server.tsx', name: 'home', html: 'dist/index.html', url: '/', src: ['src/home', 'index.html'] },
  { entry: 'src/programme/server.tsx', name: 'programme', html: 'dist/12-week-programme/index.html', url: '/12-week-programme/', src: ['src/programme', '12-week-programme/index.html'] },
]

// Static pages that are not built by React but still belong in the sitemap.
const extraPages = [
  { url: '/dopamine-audit.html', src: ['public/dopamine-audit.html'] },
  { url: '/media-kit/', src: ['public/media-kit/index.html'] },
]

// The real date each page's source last changed, taken from git history.
function lastmod(src) {
  try {
    const d = execSync(`git log -1 --format=%cs -- ${src.join(' ')}`, { cwd: root }).toString().trim()
    if (d) return d
  } catch {}
  return new Date().toISOString().slice(0, 10)
}

await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: true,
    outDir: ssrDir,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p.name, path.join(root, p.entry)])),
      output: { entryFileNames: '[name].mjs' },
    },
  },
})

for (const p of pages) {
  const { render } = await import(pathToFileURL(path.join(ssrDir, `${p.name}.mjs`)).href)
  const file = path.join(root, p.html)
  const html = await readFile(file, 'utf8')
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) throw new Error(`No empty root in ${p.html}`)
  await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`))
  console.log(`prerendered ${p.html}`)
}

await rm(ssrDir, { recursive: true, force: true })

const entries = [...pages, ...extraPages]
  .map((p) => `  <url>\n    <loc>https://drnickstraw.com${p.url}</loc>\n    <lastmod>${lastmod(p.src)}</lastmod>\n  </url>`)
  .join('\n')
await writeFile(
  path.join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
)
console.log('wrote dist/sitemap.xml')
