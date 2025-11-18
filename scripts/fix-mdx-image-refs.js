#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'static', 'posts', 'images')
const CONTENT_DIR = path.join(process.cwd(), 'data')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full))
    } else {
      results.push(full)
    }
  })
  return results
}

function buildImageMap() {
  const files = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : []
  const map = new Map()
  files.forEach((f) => {
    const ext = path.extname(f).toLowerCase()
    const base = path.basename(f, ext)
    if (!map.has(base)) map.set(base, new Set())
    map.get(base).add(ext)
  })
  return map
}

function preferredExtFor(base, map) {
  const exts = map.get(base)
  if (!exts) return null
  if (exts.has('.webp')) return '.webp'
  if (exts.has('.avif')) return '.avif'
  if (exts.has('.png')) return '.png'
  if (exts.has('.jpg')) return '.jpg'
  if (exts.has('.jpeg')) return '.jpeg'
  return null
}

function processFiles(deleteOriginals) {
  const imageMap = buildImageMap()
  const mdxFiles = walk(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  const changedFiles = []
  const deletedFiles = []

  const imgRegexGlobal =
    /\/static\/posts\/images\/?([A-Za-z0-9_.-]+?)\.(png|jpg|jpeg|PNG|webp|avif)/g
  const malformedRegex = /\/static\/posts\/images([A-Za-z0-9_.-]+?)\.(png|jpg|jpeg|PNG)/g

  mdxFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8')
    const original = content

    // fix malformed missing slash first
    content = content.replace(malformedRegex, (_m, name, ext) => {
      return `/static/posts/images/${name}.${ext}`
    })

    content = content.replace(imgRegexGlobal, (m, name, _ext) => {
      const base = name
      const pref = preferredExtFor(base, imageMap)
      if (!pref) return m
      const newPath = `/static/posts/images/${base}${pref}`
      return newPath
    })

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8')
      changedFiles.push(file)
    }
  })

  if (deleteOriginals) {
    for (const [base, exts] of buildImageMap().entries()) {
      const hasWebp = exts.has('.webp')
      const hasAvif = exts.has('.avif')
      if (hasWebp || hasAvif) {
        for (const ext of ['.png', '.jpg', '.jpeg']) {
          if (exts.has(ext)) {
            const p = path.join(IMAGES_DIR, base + ext)
            try {
              fs.unlinkSync(p)
              deletedFiles.push(p)
            } catch (err) {
              // ignore
            }
          }
        }
      }
    }
  }

  return { changedFiles, deletedFiles }
}

function main() {
  const args = process.argv.slice(2)
  const deleteOriginals = args.includes('--delete-originals')
  // eslint-disable-next-line no-console
  console.log('Scanning and updating MDX files to prefer .webp/.avif when available...')
  const result = processFiles(deleteOriginals)
  // eslint-disable-next-line no-console
  console.log('Done.')
  // eslint-disable-next-line no-console
  console.log(`Files changed: ${result.changedFiles.length}`)
  result.changedFiles.forEach((f) => console.log('  updated:', f))
  // eslint-disable-next-line no-console
  console.log(`Files deleted: ${result.deletedFiles.length}`)
  result.deletedFiles.forEach((f) => console.log('  deleted:', f))
}

main()
