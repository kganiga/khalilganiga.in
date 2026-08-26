#!/usr/bin/env node
/* eslint-disable */
// scripts/convert-mdx-imgs.js
// A conservative script that replaces <img ...> tags in MDX files under data/blog and data/stories
// with the project's Image component. It makes a backup copy before changing any file.

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const FOLDERS = [path.join(ROOT, 'data', 'blog'), path.join(ROOT, 'data', 'stories')]

function backup(filePath) {
  const copyPath = `${filePath}.bak`
  fs.copyFileSync(filePath, copyPath)
}

function convert(content) {
  // Simple regex-based conversions; not perfect but helps bulk change.
  // 1) Ensure import at top: import Image from '@/components/Image'
  if (!content.includes("import Image from '@/components/Image'")) {
    content = `import Image from '@/components/Image'\n\n` + content
  }

  // 2) Replace <img ... /> occurrences with <Image ... />
  // Capture src and alt and className, naive
  content = content.replace(/<img([^>]*)\/>/g, (match, attrs) => {
    // If it's already an <Image, skip
    if (match.includes('<Image')) return match

    // Extract src
    const srcMatch = attrs.match(/src=("|'|)([^"' >]+)/)
    const altMatch = attrs.match(/alt=("|'|)([^"' >]+)/)
    const classMatch = attrs.match(/className=("|'|)([^"' >]+)/)

    const src = srcMatch ? srcMatch[2] : ''
    const alt = altMatch ? altMatch[2] : ''
    const className = classMatch ? classMatch[2] : ''

    const classes = [className, 'h-auto w-full max-w-full object-contain'].filter(Boolean).join(' ')
    const replacement = `<Image src="${src}" alt="${alt}" className="${classes}" width={1200} height={800} sizes=\"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw\" />`
    return replacement
  })

  return content
}

async function run() {
  for (const folder of FOLDERS) {
    if (!fs.existsSync(folder)) continue
    const files = fs.readdirSync(folder).filter((f) => /\.mdx?$/.test(f))
    for (const file of files) {
      const full = path.join(folder, file)
      const content = fs.readFileSync(full, 'utf8')
      if (!content.includes('<img')) continue
      console.log('Converting', full)
      backup(full)
      const updated = convert(content)
      fs.writeFileSync(full, updated, 'utf8')
    }
  }
}

run()
