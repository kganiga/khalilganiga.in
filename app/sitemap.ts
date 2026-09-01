import { MetadataRoute } from 'next'
import { allBlogs, allStories } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const blogRoutes = allBlogs
    .filter((post) => post.draft !== true)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const storyRoutes = allStories
    .filter((story) => story.draft !== true)
    .map((story) => ({
      url: `${siteUrl}/${story.path}`,
      lastModified: story.lastmod || story.date,
    }))

  const routes = [
    '',
    'blog',
    'stories',
    'tags',
    'about',
    'contact',
    'privacy',
    'terms-and-conditions',
  ].map((route) => ({
    url: `${siteUrl}/${route ? `${route}` : ''}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...storyRoutes]
}
