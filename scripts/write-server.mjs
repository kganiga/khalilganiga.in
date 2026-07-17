#!/usr/bin/env node
/* eslint-disable */
// scripts/write-server.mjs
//
// Local-only blog/story writing tool. Runs a small Express server bound to
// 127.0.0.1 so it can never be reached over the network — it is a standalone
// Node script that lives outside `app/`, so it is never part of the Next.js
// build (`next build --output export`) and never ships to the live site.
//
// Usage: npm run write   (then open http://127.0.0.1:4790)

import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'
import matter from 'gray-matter'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const HOST = '127.0.0.1'
const PORT = process.env.WRITE_PORT ? Number(process.env.WRITE_PORT) : 4790

const CONTENT_DIRS = {
  blog: path.join(ROOT, 'data', 'blog'),
  story: path.join(ROOT, 'data', 'stories'),
}
const IMAGES_DIR = path.join(ROOT, 'public', 'static', 'posts', 'images')
const TAG_DATA_PATH = path.join(ROOT, 'app', 'tag-data.json')

const LAYOUTS_BY_TYPE = {
  blog: { default: 'PostLayout', options: ['PostLayout', 'PostSimple', 'PostBanner'] },
  story: { default: 'PostBanner', options: ['PostBanner', 'PostLayout', 'PostSimple'] },
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  hr: '---',
})
turndown.use(gfm)

// ---------- helpers ----------

function slugify(input) {
  return String(input)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

function walkMdx(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkMdx(full, fileList)
    else if (entry.isFile() && entry.name.endsWith('.mdx')) fileList.push(full)
  }
  return fileList
}

function existingSlugs(type) {
  return new Set(
    walkMdx(CONTENT_DIRS[type]).map((f) => path.basename(f, '.mdx'))
  )
}

function uniqueSlug(type, base) {
  const taken = existingSlugs(type)
  let slug = base || 'untitled'
  let n = 2
  while (taken.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

function yamlStr(value) {
  if (value === undefined || value === null) return "''"
  return `'${String(value).replace(/'/g, "''")}'`
}

function yamlArr(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '[]'
  return `[${arr.map(yamlStr).join(', ')}]`
}

function buildFrontmatter(fm) {
  const lines = ['---']
  lines.push(`title: ${yamlStr(fm.title)}`)
  lines.push(`date: ${yamlStr(fm.date)}`)
  lines.push(`tags: ${yamlArr(fm.tags)}`)
  if (fm.lastmod) lines.push(`lastmod: ${yamlStr(fm.lastmod)}`)
  lines.push(`draft: ${fm.draft ? 'true' : 'false'}`)
  lines.push(`summary: ${yamlStr(fm.summary || '')}`)
  lines.push(`images: ${yamlArr(fm.images)}`)
  if (fm.authors && fm.authors.length) lines.push(`authors: ${yamlArr(fm.authors)}`)
  lines.push(`layout: ${fm.layout}`)
  if (fm.canonicalUrl) lines.push(`canonicalUrl: ${yamlStr(fm.canonicalUrl)}`)
  if (fm.bibliography) lines.push(`bibliography: ${yamlStr(fm.bibliography)}`)
  lines.push(`isfeatured: ${fm.isfeatured ? 'true' : 'false'}`)
  lines.push('---')
  return lines.join('\n')
}

function normalizeMarkdown(md) {
  // Turndown pads list markers to a 4-char column ("-   item"); collapse to
  // a single space to match this repo's existing markdown style ("- item").
  return md
    .replace(/^(\s*)-\s{2,}/gm, '$1- ')
    .replace(/^(\s*)(\d+\.)\s{2,}/gm, '$1$2 ')
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// Pull every /static/posts/images/... reference out of the cover image field
// and the post body so newly-uploaded images get committed alongside the post.
function collectImagePaths(images, html) {
  const found = new Set(images || [])
  const re = /\/static\/posts\/images\/[^"'\s)]+/g
  for (const match of String(html || '').matchAll(re)) found.add(match[0])

  const safePaths = []
  for (const webPath of found) {
    if (!webPath.startsWith('/static/posts/images/')) continue
    const abs = path.resolve(ROOT, 'public', webPath.replace(/^\//, ''))
    if (!abs.startsWith(IMAGES_DIR)) continue // guard against path traversal
    if (fs.existsSync(abs)) safePaths.push(path.relative(ROOT, abs))
  }
  return safePaths
}

function runGit(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
}

function isGitRepo() {
  try {
    runGit(['rev-parse', '--is-inside-work-tree'])
    return true
  } catch {
    return false
  }
}

function commitPublishedPost({ filePathRel, imagePaths, title, type }) {
  if (!isGitRepo()) return { ok: false, skipped: true, reason: 'Not a git repository' }

  const paths = [filePathRel, ...imagePaths]
  try {
    runGit(['add', '--', ...paths])
  } catch (err) {
    return { ok: false, reason: `git add failed: ${firstLine(err)}` }
  }

  const label = type === 'story' ? 'story' : 'blog post'
  const message = `Publish ${label}: ${title}`
  try {
    runGit(['commit', '-m', message, '--', ...paths])
  } catch (err) {
    if (/nothing to commit|nothing added/i.test(fullOutput(err))) {
      return { ok: true, skipped: true, reason: 'No changes to commit' }
    }
    return { ok: false, reason: `git commit failed: ${firstLine(err)}` }
  }

  try {
    const hash = runGit(['rev-parse', '--short', 'HEAD']).trim()
    return { ok: true, commit: hash, message }
  } catch {
    return { ok: true, message }
  }
}

function firstLine(err) {
  // git writes "nothing to commit" to stdout, most real errors to stderr.
  const text = (err && ((err.stdout || '') + '\n' + (err.stderr || ''))) || err.message || String(err)
  return String(text)
    .split('\n')
    .map((l) => l.trim())
    .find(Boolean)
}

function fullOutput(err) {
  return String((err && ((err.stdout || '') + (err.stderr || ''))) || err.message || err)
}

// ---------- app ----------

const app = express()
app.use(express.json({ limit: '15mb' }))

// Defense in depth: even though we only bind to loopback, reject anything
// that doesn't present a localhost Host header (blocks DNS-rebinding).
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0]
  if (host !== '127.0.0.1' && host !== 'localhost') {
    return res.status(403).send('Forbidden: local use only')
  }
  next()
})

app.use(express.static(path.join(__dirname, 'write-server', 'public')))

app.get('/api/meta', (req, res) => {
  let tags = []
  try {
    const raw = JSON.parse(fs.readFileSync(TAG_DATA_PATH, 'utf8'))
    tags = Object.keys(raw).sort()
  } catch {
    tags = []
  }
  res.json({ tags, layouts: LAYOUTS_BY_TYPE, today: todayISO() })
})

app.get('/api/drafts', (req, res) => {
  const drafts = []
  for (const type of Object.keys(CONTENT_DIRS)) {
    for (const file of walkMdx(CONTENT_DIRS[type])) {
      try {
        const { data } = matter(fs.readFileSync(file, 'utf8'))
        if (data.draft) {
          drafts.push({
            type,
            slug: path.basename(file, '.mdx'),
            title: data.title || '(untitled)',
            date: data.date || '',
          })
        }
      } catch {
        // skip unparsable files
      }
    }
  }
  drafts.sort((a, b) => (a.date < b.date ? 1 : -1))
  res.json({ drafts })
})

app.get('/api/drafts/:type/:slug', (req, res) => {
  const { type, slug } = req.params
  const dir = CONTENT_DIRS[type]
  if (!dir) return res.status(400).json({ error: 'Unknown type' })
  const file = walkMdx(dir).find((f) => path.basename(f, '.mdx') === slug)
  if (!file) return res.status(404).json({ error: 'Not found' })

  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  if (!data.draft) {
    return res.status(403).json({ error: 'Only drafts created by this tool can be reloaded' })
  }
  res.json({
    type,
    slug,
    frontmatter: data,
    html: marked.parse(content || ''),
  })
})

app.post('/api/upload-image', (req, res) => {
  const { filename, dataUrl } = req.body || {}
  if (!filename || !dataUrl) return res.status(400).json({ error: 'filename and dataUrl required' })

  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl)
  if (!match) return res.status(400).json({ error: 'Invalid image data URL' })

  const buffer = Buffer.from(match[2], 'base64')
  const ext = path.extname(filename) || '.png'
  const safeBase = slugify(path.basename(filename, ext)) || 'image'

  fs.mkdirSync(IMAGES_DIR, { recursive: true })
  let finalName = `${safeBase}${ext}`
  let n = 2
  while (fs.existsSync(path.join(IMAGES_DIR, finalName))) {
    finalName = `${safeBase}-${n}${ext}`
    n += 1
  }
  fs.writeFileSync(path.join(IMAGES_DIR, finalName), buffer)
  res.json({ path: `/static/posts/images/${finalName}` })
})

app.post('/api/save', (req, res) => {
  const { type, slug: existingSlug, frontmatter, html } = req.body || {}
  const dir = CONTENT_DIRS[type]
  if (!dir) return res.status(400).json({ error: 'Unknown type' })
  if (!frontmatter || !frontmatter.title) return res.status(400).json({ error: 'Title is required' })

  const layoutInfo = LAYOUTS_BY_TYPE[type]
  const layout = layoutInfo.options.includes(frontmatter.layout)
    ? frontmatter.layout
    : layoutInfo.default

  let slug = existingSlug
  if (!slug) {
    slug = uniqueSlug(type, slugify(frontmatter.title))
  }

  const markdownBody = normalizeMarkdown(turndown.turndown(html || ''))
  const fm = {
    title: frontmatter.title,
    date: frontmatter.date || todayISO(),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    lastmod: existingSlug ? todayISO() : undefined,
    draft: !!frontmatter.draft,
    summary: frontmatter.summary || '',
    images: Array.isArray(frontmatter.images) ? frontmatter.images : [],
    authors: Array.isArray(frontmatter.authors) ? frontmatter.authors : [],
    layout,
    canonicalUrl: frontmatter.canonicalUrl || '',
    bibliography: frontmatter.bibliography || '',
    isfeatured: !!frontmatter.isfeatured,
  }

  const fileContent = `${buildFrontmatter(fm)}\n\n${markdownBody}\n`

  fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${slug}.mdx`)
  fs.writeFileSync(filePath, fileContent, 'utf8')

  const filePathRel = path.relative(ROOT, filePath)
  let git
  if (!fm.draft) {
    const imagePaths = collectImagePaths(fm.images, html)
    git = commitPublishedPost({ filePathRel, imagePaths, title: fm.title, type })
  }

  res.json({
    ok: true,
    slug,
    type,
    draft: fm.draft,
    filePath: filePathRel,
    git,
  })
})

app.listen(PORT, HOST, () => {
  console.log(`\n  Local writing studio running at http://${HOST}:${PORT}`)
  console.log('  Bound to 127.0.0.1 only — not reachable from the network or internet.\n')
})
