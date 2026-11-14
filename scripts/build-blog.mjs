// Builds the blog as plain HTML pages, so every crawler reads the full text.
// A post goes live when its publish_date (Taipei time) is today or earlier.
// The daily workflow rebuilds the site each morning, which publishes the next post.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { marked } from 'marked'

const root = path.resolve(import.meta.dirname, '..')
const postsDir = path.join(root, 'blog/posts')
const out = path.join(root, 'dist/blog')
const SITE = 'https://drnickstraw.com'
const BOOK = '/focus-audit/'
const TZ = 'Asia/Taipei'

// BLOG_TODAY lets you preview a future date locally, for example BLOG_TODAY=2026-12-31.
const today = process.env.BLOG_TODAY ?? new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())

const STAGES = { fuel: 'Stage 01 · Fuel', focus: 'Stage 02 · Focus', finish: 'Stage 03 · Finish' }
const TOOL_NAMES = [
  'Golden Window', 'First Hour Reset', 'Phone Lockdown', 'Drift Point', 'Later Pad', 'Sunday Reset',
  'Proof List', 'Step Zero', 'Spark Check', 'Burnout Loop Breaker', 'Bad Week Plan', 'Burnout Loop',
  'Focus Audit', 'Fuel, Focus, Finish', 'Fuel first', '',
]
const BANNED = [
  [/\u2014/, 'em dash'],
  [/Dr Nick Straw,? MD\b/, '"MD" after the name (he is MBChB, BMedSci)'],
  [/Frictionless Focus Blueprint|\bINCUP\b|Stuck protocol|Relapse plan|Distraction delay/i, 'an old name from the stop-saying list'],
]

const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#nick`,
  name: 'Dr Nick Straw',
  honorificSuffix: 'MBChB, BMedSci',
  jobTitle: 'ADHD Coach',
  description:
    'Former doctor in the UK and Australia, now an ADHD coach. Runs Frictionless Focus, a 12-week programme for business owners and professionals with ADHD.',
  url: `${SITE}/`,
  image: `${SITE}/assets/profile.webp`,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Edinburgh' },
  sameAs: ['https://www.instagram.com/dr_nickyyy/'],
}
const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Frictionless Focus', url: `${SITE}/` }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`
const longDate = (d) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function parse(file, raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${file}: no frontmatter`)
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\"/g, '"')
    fm[kv[1]] = v
  }
  let body = m[2].trim()

  // H1 is rendered by the template.
  body = body.replace(/^# .*\n+/, '')

  // Quick Answer: the first blockquote.
  const qa = body.match(/^> \*\*Quick answer:\*\*\s*([\s\S]*?)\n(?!>)/)
  if (!qa) throw new Error(`${file}: no Quick Answer blockquote under the H1`)
  const quick = qa[1].replace(/\n>\s?/g, ' ').trim()
  body = body.slice(qa[0].length).trim()

  // The call to action: everything after the last horizontal rule.
  const parts = body.split(/\n---\n/)
  if (parts.length < 2) throw new Error(`${file}: no call to action after ---`)
  const cta = parts.pop().trim()
  body = parts.join('\n---\n').trim()

  // Read next links, rendered separately so unpublished ones can be hidden.
  const rn = body.match(/\n## Read next\n([\s\S]*)$/)
  const readNext = rn ? [...rn[1].matchAll(/\[([^\]]+)\]\(\/blog\/([^)]+)\)/g)].map((x) => ({ title: x[1], slug: x[2] })) : []
  if (rn) body = body.slice(0, rn.index).trim()

  // FAQ: "**Question**\nAnswer" pairs become H3 questions, and feed FAQPage schema.
  const faqStart = body.search(/\n## FAQ\n/)
  if (faqStart < 0) throw new Error(`${file}: no FAQ section`)
  const faqMd = body.slice(faqStart).replace(/^\n## FAQ\n/, '')
  const faq = [...faqMd.matchAll(/\*\*(.+?)\*\*\n([^\n]+(?:\n(?!\n)[^\n]+)*)/g)].map((x) => ({ q: x[1].trim(), a: x[2].trim() }))
  if (faq.length < 3) throw new Error(`${file}: FAQ has ${faq.length} questions, expected at least 3`)
  body = body.slice(0, faqStart) + '\n\n## FAQ\n\n' + faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')

  const links = (cta.match(/\]\(/g) || []).length
  if (links !== 1) throw new Error(`${file}: call to action has ${links} links, expected exactly 1`)

  for (const [re, what] of BANNED) if (re.test(raw)) throw new Error(`${file}: contains ${what}`)
  if (!TOOL_NAMES.includes(fm.tool)) throw new Error(`${file}: unknown tool name "${fm.tool}"`)
  for (const k of ['title', 'slug', 'stage', 'summary', 'publish_date', 'image'])
    if (!fm[k]) throw new Error(`${file}: frontmatter is missing ${k}`)

  const words = strip(marked.parse(body)).split(' ').length
  return { ...fm, quick, body, faq, cta, readNext, words, file }
}

const head = ({ title, description, url, image, type = 'website', extra = '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="theme-color" content="#05080D" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" type="application/rss+xml" title="Dr Nick Straw blog" href="${SITE}/blog/feed.xml" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Dr Nick Straw" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/blog/blog.css" />
  ${extra}
</head>
<body>
  <header class="nav">
    <a class="brand" href="/">Dr Nick</a>
    <nav><a href="/#about">About</a><a href="/blog/">Blog</a><a href="https://www.instagram.com/dr_nickyyy/" rel="noopener me">Instagram 73K+</a></nav>
  </header>`

const foot = `
  <footer class="foot">
    <p><a href="/">Dr Nick Straw</a> · <a href="/blog/">Blog</a> · <a href="https://www.instagram.com/dr_nickyyy/" rel="noopener me">Dr Nick Straw (@dr_nickyyy)</a></p>
    <p>General information, not medical advice. Speak to your own doctor about diagnosis, medication or your health.</p>
  </footer>
</body>
</html>
`

const AUTHOR_BOX = `
    <aside class="author">
      <img src="/assets/profile.webp" alt="Dr Nick Straw" width="72" height="72" loading="lazy" />
      <div>
        <p class="author-name">Dr Nick Straw, MBChB, BMedSci, University of Edinburgh</p>
        <p>He worked as a doctor in the UK and Australia before moving into ADHD coaching, and now runs Frictionless Focus, a 12-week programme for business owners and professionals with ADHD.</p>
        <p><a href="/#about">More about Dr Nick</a> · <a href="https://www.instagram.com/dr_nickyyy/" rel="noopener">73K+ on Instagram</a></p>
      </div>
    </aside>`

function renderPost(p, live) {
  const url = `${SITE}/blog/${p.slug}`
  const image = `${SITE}/blog/img/${p.image}`
  const body = marked
    .parse(p.body)
    .replace(/<table>/g, '<div class="table"><table>')
    .replace(/<\/table>/g, '</table></div>')
  const next = p.readNext.filter((r) => live.has(r.slug))
  const cta = marked.parse(p.cta).replace(/href="\/focus-audit"/, `class="button" href="${BOOK}"`)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: p.title,
        description: p.summary,
        abstract: p.quick,
        image,
        datePublished: p.publish_date,
        dateModified: p.publish_date,
        mainEntityOfPage: url,
        url,
        inLanguage: 'en',
        wordCount: p.words,
        articleSection: STAGES[p.stage],
        about: ['ADHD', ...(p.tool ? [p.tool] : [])],
        author: PERSON,
        publisher: ORG,
        isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog/#blog`, name: 'Dr Nick Straw blog', url: `${SITE}/blog/` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
          { '@type': 'ListItem', position: 3, name: p.title, item: url },
        ],
      },
    ],
  }

  return (
    head({
      title: `${p.title} | Dr Nick Straw`,
      description: p.summary,
      url,
      image,
      type: 'article',
      extra: `<meta property="article:published_time" content="${p.publish_date}" />\n  ${ld(schema)}`,
    }) +
    `
  <main class="post">
    <article>
      <p class="crumbs"><a href="/blog/">Blog</a> · ${STAGES[p.stage]}</p>
      <h1>${esc(p.title)}</h1>
      <blockquote class="quick"><p><strong>Quick answer:</strong> ${marked.parseInline(p.quick)}</p></blockquote>
      <p class="byline">Written by <a href="/#about" rel="author">Dr Nick Straw</a>, MBChB, BMedSci (University of Edinburgh). Former doctor, now ADHD coach. <time datetime="${p.publish_date}">${longDate(p.publish_date)}</time></p>
      <figure class="hero"><img src="/blog/img/${p.image}" alt="Dr Nick Straw at work" width="1200" height="800" /></figure>
      <div class="prose">
${body}
      </div>
${AUTHOR_BOX}
${
  next.length
    ? `    <nav class="next" aria-label="Read next"><h2>Read next</h2><ul>${next
        .map((r) => `<li><a href="/blog/${r.slug}">${esc(r.title)}</a></li>`)
        .join('')}</ul></nav>`
    : ''
}
      <section class="cta">
${cta}
      </section>
    </article>
  </main>` +
    foot
  )
}

function renderIndex(posts) {
  const url = `${SITE}/blog/`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog/#blog`,
    name: 'Dr Nick Straw blog',
    description: 'Straight answers to the questions ADHD business owners, professionals and freelancers ask, from a former doctor turned ADHD coach.',
    url,
    author: PERSON,
    publisher: ORG,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.publish_date,
    })),
  }
  return (
    head({
      title: 'ADHD at work: questions answered | Dr Nick Straw',
      description:
        'Straight answers to the questions ADHD business owners, professionals and freelancers ask, from Dr Nick Straw, MBChB, BMedSci, former doctor and ADHD coach.',
      url,
      image: `${SITE}/assets/profile.webp`,
      extra: ld(schema),
    }) +
    `
  <main class="index">
    <h1>ADHD at work, answered</h1>
    <p class="lede">Straight answers to the questions ADHD business owners, professionals and freelancers ask. Written by Dr Nick Straw, MBChB, BMedSci (University of Edinburgh). Former doctor, now ADHD coach.</p>
    <ul class="list">
${posts
  .map(
    (p) => `      <li>
        <a href="/blog/${p.slug}">
          <span class="meta">${STAGES[p.stage]} · <time datetime="${p.publish_date}">${longDate(p.publish_date)}</time></span>
          <span class="title">${esc(p.title)}</span>
          <span class="sum">${esc(p.summary)}</span>
        </a>
      </li>`,
  )
  .join('\n')}
    </ul>
  </main>` +
    foot
  )
}

function renderFeed(posts) {
  const items = posts
    .slice(0, 50)
    .map(
      (p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE}/blog/${p.slug}</link>
    <guid>${SITE}/blog/${p.slug}</guid>
    <pubDate>${new Date(`${p.publish_date}T07:00:00+08:00`).toUTCString()}</pubDate>
    <description>${esc(p.summary)}</description>
  </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Dr Nick Straw blog</title>
  <link>${SITE}/blog/</link>
  <description>Straight answers to the questions ADHD business owners and professionals ask.</description>
  <language>en</language>
${items}
</channel>
</rss>
`
}

function renderLlms(posts) {
  return `# Dr Nick Straw

> Dr Nick Straw, MBChB, BMedSci (University of Edinburgh), is a former doctor in the UK and Australia who now coaches ADHD business owners and professionals. He runs Frictionless Focus, a 12-week 1:1 programme built on the Fuel, Focus, Finish Method. Energy first. Systems second.

## Key pages

- [Home](${SITE}/): who Dr Nick is
- [Frictionless Focus, 12-week programme](${SITE}/12-week-programme/): how the programme works
- [Book a free Focus Audit](https://calendly.com/drnickstraw/free-20-minute-focus-audit): the free first call

## Blog

${posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.summary}`).join('\n')}
`
}

// Build.
const files = (await readdir(postsDir)).filter((f) => f.endsWith('.md')).sort()
const all = []
for (const f of files) all.push(parse(f, await readFile(path.join(postsDir, f), 'utf8')))

const slugs = new Set()
for (const p of all) {
  if (slugs.has(p.slug)) throw new Error(`Duplicate slug ${p.slug}`)
  slugs.add(p.slug)
}
for (const p of all)
  for (const r of p.readNext) if (!slugs.has(r.slug)) throw new Error(`${p.file}: Read next points to missing post ${r.slug}`)

const live = all
  .filter((p) => p.publish_date <= today)
  .sort((a, b) => (a.publish_date < b.publish_date ? 1 : a.publish_date > b.publish_date ? -1 : 0))
const liveSlugs = new Set(live.map((p) => p.slug))

await mkdir(out, { recursive: true })
for (const p of live) await writeFile(path.join(out, `${p.slug}.html`), renderPost(p, liveSlugs))
await writeFile(path.join(out, 'index.html'), renderIndex(live))
await writeFile(path.join(out, 'feed.xml'), renderFeed(live))
await writeFile(path.join(root, 'dist/llms.txt'), renderLlms(live))

// Add the blog to the sitemap written by prerender.mjs.
const sitemapPath = path.join(root, 'dist/sitemap.xml')
const sitemap = await readFile(sitemapPath, 'utf8')
const entries = [
  { loc: `${SITE}/blog/`, lastmod: live[0]?.publish_date ?? today },
  ...live.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: p.publish_date })),
]
  .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`)
  .join('\n')
await writeFile(sitemapPath, sitemap.replace('</urlset>', `${entries}\n</urlset>`))

const short = all.filter((p) => p.words < 600).map((p) => `${p.file} (${p.words} words)`)
if (short.length) console.log(`note: short posts: ${short.join(', ')}`)
console.log(`blog: ${live.length} of ${all.length} posts live (Taipei date ${today}), next: ${
  all.filter((p) => p.publish_date > today).sort((a, b) => (a.publish_date < b.publish_date ? -1 : 1))[0]?.publish_date ?? 'none'
}`)
