import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { aemHubs } from '@/data/aemHubs'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog', canonicalUrl: 'blog' })

const topicHubs = aemHubs.map((hub) => ({
  slug: hub.slug,
  title: hub.shortTitle,
  articleCount: hub.sections.reduce((sum, section) => sum + section.articleSlugs.length, 0),
}))

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      topicHubs={topicHubs}
    />
  )
}
