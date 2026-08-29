# Khalil Ganiga's Blog

Personal blog and website of Khalil Ganiga, built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/), based on the [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) template.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Contentlayer](https://github.com/timlrx/contentlayer2) for MDX content
- [Pliny](https://github.com/timlrx/pliny) blog utilities

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — build the production site
- `npm run analyze` — build with the bundle analyzer enabled
- `npm run lint` — lint the codebase
- `npm run optimize:images` — generate `.webp`/`.avif` derivatives for post images
- `npm run convert:mdx-imgs` — convert raw `<img>` tags in MDX to the project's `Image` component
- `npm run write` — start the local write server

See [README_PERFORMANCE.md](./README_PERFORMANCE.md) for details on the image optimization and performance tooling.

## Content

Blog posts and other content live under `data/`, written in MDX and processed by Contentlayer. Site-wide configuration (author info, navigation, etc.) is also in `data/`.

## License

Licensed under the [MIT License](./LICENSE).
