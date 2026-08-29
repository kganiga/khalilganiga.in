<div align="center">

# 🗒️ Khalil Ganiga — A Developer's Log Book

_67 posts, one AEM obsession, and a lot of `curl -X GET` at 2am._

[![Site](https://img.shields.io/badge/live-khalilganiga.in-blue?style=flat-square)](https://www.khalilganiga.in)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![MDX](https://img.shields.io/badge/content-MDX-orange?style=flat-square)](https://mdxjs.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](./LICENSE)

</div>

---

### What's actually in here

This isn't a portfolio template with three placeholder posts. It's a working log of things that broke, things that got fixed, and things that were too fun not to write down — mostly from the trenches of **Adobe Experience Manager**, with detours into Java, browser tricks, and the occasional Telegram bot.

```
grep -c "AEM"    → 35 posts
grep -c "How To" → 41 posts
grep -c "Java"   → 11 posts
grep -c "3am"    → unmeasured, but real
```

### 🗂️ Field notes, by category

| Cluster | What lives there |
|---|---|
| 🏗️ **AEM Dispatcher Dev Guide** | A 7-part series in `data/blog/aem-dispatcher/` — from your first `dispatcher.any` to production-grade cache invalidation |
| ⚙️ **AEM as a Cloud Service Workflows** | 5-part deep dive into workflow models, custom steps, and the parts Adobe really doesn't want you touching |
| 🧊 **Caching & Performance** | High-availability dispatcher architecture, `jcr:lastModified` vs `cq:lastModified`, and other things that only matter until they cost you a Saturday |
| 🔍 **Query Wrangling** | XPath, SQL2, Query Builder — three ways to ask the JCR the same question and get three different answers |
| 🛠️ **Dev Tools & Bookmarklets** | A Chromium extension, a JS bookmarklet for asset details, a Java bytecode decompiler — small tools built because the big ones didn't exist yet |
| 🧠 **Everything Else** | Lockscreen emergency info, IMEI recovery, IDE tricks, a horoscope bot, a movie-recommendation bot, and other things typed at odd hours |

### 🚀 Running it locally

```bash
npm install
npm run dev        # → http://localhost:3000
```

```bash
npm run build              # production build
npm run lint                # eslint, self-explanatory
npm run optimize:images     # generate .webp / .avif for post images
npm run convert:mdx-imgs    # migrate raw <img> tags to <Image />
```

Performance tooling details live in [`README_PERFORMANCE.md`](./README_PERFORMANCE.md).

### 🧱 Built with

Next.js (App Router) · Tailwind CSS · Contentlayer · Pliny · MDX

### ✍️ Writing a post

Posts live as MDX under `data/blog/`, sorted into subfolders where a series warrants it (see `aem-dispatcher/`, `aem-caching/`, `aem-guides/`). Every post front-matters `title`, `date`, `tags`, and a one-line `summary` — grep any `.mdx` file for the shape and copy it.

### 🔗 Find me elsewhere

[GitHub](https://github.com/kganiga) · [LinkedIn](https://www.linkedin.com/in/khalilbashag) · [Twitter/X](https://twitter.com/Im_Khalil) · [YouTube](https://youtube.com/khalilbasha.g)

---

<div align="center">

_Licensed under [MIT](./LICENSE). Bugs filed as blog posts._

</div>
