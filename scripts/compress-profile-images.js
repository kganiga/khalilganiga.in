/* eslint-disable */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const IMAGES_DIR = path.join(ROOT, 'public', 'static', 'images')

const TARGETS = [
  path.join(IMAGES_DIR, 'author.jpg'),
  path.join(IMAGES_DIR, 'avatar.jpg'),
]

async function run() {
  console.log('Starting profile images compression...')
  
  for (const file of TARGETS) {
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`)
      continue
    }

    try {
      const statsBefore = fs.statSync(file)
      const sizeBeforeKB = (statsBefore.size / 1024).toFixed(1)
      
      console.log(`Processing ${path.basename(file)} (Original: ${sizeBeforeKB} KB)...`)

      // Read file into memory buffer to avoid lock contention
      const inputBuffer = fs.readFileSync(file)

      // Resize and compress
      const buffer = await sharp(inputBuffer)
        .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer()

      // Write back to original file
      fs.writeFileSync(file, buffer)

      const statsAfter = fs.statSync(file)
      const sizeAfterKB = (statsAfter.size / 1024).toFixed(1)
      const percentReduction = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1)

      console.log(`Successfully optimized ${path.basename(file)}: ${sizeAfterKB} KB (Reduced by ${percentReduction}%)`)
    } catch (err) {
      console.error(`Failed to compress ${path.basename(file)}:`, err)
    }
  }
}

run()
