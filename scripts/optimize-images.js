#!/usr/bin/env node
/* eslint-disable */
// scripts/optimize-images.js
// Lightweight image optimizer using sharp.
// Scans static/posts and creates .webp and .avif versions alongside originals.

const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
// Allow overriding the images dir via IMAGES_DIR env var. Fall back to repo's
// `static/posts` (legacy) and then `public/static/posts` which this project uses.
const STATIC_POSTS = process.env.IMAGES_DIR
  ? path.resolve(process.env.IMAGES_DIR)
  : fs.existsSync(path.join(ROOT, 'static', 'posts'))
    ? path.join(ROOT, 'static', 'posts')
    : path.join(ROOT, 'public', 'static', 'posts')

async function walk(dir, fileList = []) {
  const files = await fs.promises.readdir(dir)
  for (const file of files) {
    const full = path.join(dir, file)
    const stat = await fs.promises.stat(full)
    if (stat.isDirectory()) {
      await walk(full, fileList)
    } else {
      fileList.push(full)
    }
  }
  return fileList
}

async function optimize() {
  if (!fs.existsSync(STATIC_POSTS)) {
    console.error('No static/posts dir found. Exiting.')
    process.exit(1)
  }

  const files = (await walk(STATIC_POSTS)).filter((f) => /\.(jpe?g|png)$/i.test(f))
  console.log(`Found ${files.length} images to optimize.`)

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const base = file.slice(0, -ext.length)
    const webp = `${base}.webp`
    const avif = `${base}.avif`

    try {
      await sharp(file).resize({ width: 1600 }).webp({ quality: 80 }).toFile(webp)

      await sharp(file).resize({ width: 1600 }).avif({ quality: 50 }).toFile(avif)

      console.log(`Optimized: ${path.relative(ROOT, file)}`)
    } catch (err) {
      console.error(`Failed optimizing ${file}:`, err.message)
    }
  }
}

optimize().catch((err) => {
  console.error(err)
  process.exit(1)
})
