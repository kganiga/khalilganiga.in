/* eslint-disable */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.resolve(__dirname, '..')
const STATIC_DIR = path.join(ROOT, 'public', 'static')

// Recursively find all files matching extensions in a directory
async function getFiles(dir, fileList = []) {
  const files = await fs.promises.readdir(dir)
  for (const file of files) {
    const full = path.join(dir, file)
    const stat = await fs.promises.stat(full)
    if (stat.isDirectory()) {
      if (file !== 'favicons') { // Skip favicons folder
        await getFiles(full, fileList)
      }
    } else {
      if (/\.(jpe?g|png|webp)$/i.test(file)) {
        fileList.push(full)
      }
    }
  }
  return fileList
}

async function run() {
  console.log('Scanning for all static images to optimize...')
  const files = await getFiles(STATIC_DIR)
  console.log(`Found ${files.length} images. Processing...`)

  let totalSavedBytes = 0
  let optimizedCount = 0

  for (const file of files) {
    try {
      const statsBefore = fs.statSync(file)
      const sizeBefore = statsBefore.size

      // Skip files under 30KB to avoid wasting cycles on small assets
      if (sizeBefore < 30 * 1024) {
        continue
      }

      // Strip read-only attribute if present on Windows
      try {
        fs.chmodSync(file, 0o666)
      } catch (e) {
        // ignore chmod errors if permissions are already fine
      }

      const ext = path.extname(file).toLowerCase()
      const inputBuffer = fs.readFileSync(file)
      let pipeline = sharp(inputBuffer)

      // Get metadata to check width
      const metadata = await pipeline.metadata()
      
      // If image is wider than 1200px, resize it to fit standard screens
      if (metadata.width && metadata.width > 1200) {
        pipeline = pipeline.resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
      }

      // Compress based on extension
      if (ext === '.png') {
        pipeline = pipeline.png({ compressionLevel: 8 })
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: 80 })
      } else {
        // Handle jpg, jpeg, and generic extensions as JPEG
        pipeline = pipeline.jpeg({ quality: 80, progressive: true })
      }

      const outputBuffer = await pipeline.toBuffer()
      const sizeAfter = outputBuffer.length

      // Save only if it actually reduces size
      if (sizeAfter < sizeBefore) {
        fs.writeFileSync(file, outputBuffer)
        const saved = sizeBefore - sizeAfter
        totalSavedBytes += saved
        optimizedCount++
        console.log(`Optimized: ${path.relative(ROOT, file)} | ${(sizeBefore/1024).toFixed(1)} KB -> ${(sizeAfter/1024).toFixed(1)} KB (Saved ${(saved/1024).toFixed(1)} KB)`)
      }
    } catch (err) {
      console.error(`Failed to optimize ${path.relative(ROOT, file)}:`, err.message)
    }
  }

  console.log(`\nFinished! Optimized ${optimizedCount} images. Total savings: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`)
}

run().catch(console.error)
