Performance optimization helper scripts and workflow

This repository includes a few helper scripts to automate common static-site performance tasks.

Scripts added

- `node ./scripts/optimize-images.js`

  - Scans `static/posts` for JPG/PNG images and generates `.webp` and `.avif` derivatives at max width 1600px.
  - Requires `sharp` installed as a devDependency or globally.

- `node ./scripts/convert-mdx-imgs.js`
  - A conservative MDX converter that replaces raw `<img .../>` tags in `data/blog` and `data/stories` with the project's `@/components/Image` component.
  - Makes a `.bak` copy of each file before editing.

How to use

1. Install `sharp` (one-time):

```powershell
# Windows PowerShell
yarn add -D sharp
```

2. Optimize images:

```powershell
# Generate .webp and .avif files next to originals
yarn optimize:images
```

3. Convert MDX files to use Next Image wrapper:

```powershell
# Backups are stored as .bak files
yarn convert:mdx-imgs
```

4. Run a production build and measure:

```powershell
yarn build
# Optionally run analyzer
yarn analyze
```

Notes and next steps

- The MDX converter is intentionally conservative. It uses a regex-based approach; review diffs after running and tweak widths/heights as needed per image's intrinsic size.
- Consider creating a small script to detect image dimensions and update MDX with exact width/height values.
- For critical fonts (e.g., Telugu glyph font), I recommend using `next/font/local` with an extracted subset or preloading only the glyphs you need.
- If you want, I can run the production build, collect Lighthouse scores, run bundle-analyzer, and propose targeted code-splitting/deferral changes.
