import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
const tagData = JSON.parse(readFileSync(new URL('../app/tag-data.json', import.meta.url), 'utf-8'))
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.path}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.path}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

// `next build` performs the static export to ./out before this script runs, so anything
// written only to ./public here is one build stale in the deployed ./out copy. Mirror the
// generated feeds into ./out (when it exists) so the exported site isn't left behind.
function writeFeed(relativePath, contents) {
  const publicPath = path.join('public', relativePath)
  mkdirSync(path.dirname(publicPath), { recursive: true })
  writeFileSync(publicPath, contents)

  if (existsSync('out')) {
    const outPath = path.join('out', relativePath)
    mkdirSync(path.dirname(outPath), { recursive: true })
    writeFileSync(outPath, contents)
  }
}

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    writeFeed(page, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = publishPosts.filter(
        (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
      )
      const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
      writeFeed(path.join('tags', tag, page), rss)
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
