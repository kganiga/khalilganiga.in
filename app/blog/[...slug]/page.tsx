import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getHubForArticleSlug, getHubPrevNext } from '@/data/aemHubs'

const twitterHandle = siteMetadata.twitter ? `@${siteMetadata.twitter.split('/').pop()}` : undefined
const isProduction = process.env.NODE_ENV === 'production'
const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  const canonicalUrl =
    post.canonicalUrl && post.canonicalUrl.trim()
      ? post.canonicalUrl.startsWith('http')
        ? post.canonicalUrl
        : `${siteMetadata.siteUrl}/${post.canonicalUrl.replace(/^\//, '')}`
      : `${siteMetadata.siteUrl}/${post.path}`

  return {
    title: post.title,
    description: post.summary,
    robots: post.draft ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | ${siteMetadata.title}`,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonicalUrl,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${siteMetadata.title}`,
      description: post.summary,
      images: imageList,
      site: twitterHandle,
      creator: twitterHandle,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allBlogs.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedPosts = sortPosts(allBlogs) as Blog[]
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = coreContent(sortedPosts[postIndex + 1])
  const next = coreContent(sortedPosts[postIndex - 1])
  const post = sortedPosts.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
      url: `${siteMetadata.siteUrl}/about`,
    }
  })
  jsonLd['publisher'] = {
    '@type': 'Organization',
    name: siteMetadata.author,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    },
  }

  const hub = getHubForArticleSlug(post.slug)
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteMetadata.siteUrl}/blog` },
    ...(hub
      ? [
          {
            '@type': 'ListItem',
            position: 3,
            name: hub.shortTitle,
            item: `${siteMetadata.siteUrl}/blog/topics/${hub.slug}`,
          },
        ]
      : []),
    {
      '@type': 'ListItem',
      position: hub ? 4 : 3,
      name: post.title,
      item: `${siteMetadata.siteUrl}/${post.path}`,
    },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  // Within a hub, "previous/next" should mean "earlier/later in the guide", not
  // "whatever else happened to publish on an adjacent date".
  let hubPrev: { path: string; title: string } | undefined = prev
  let hubNext: { path: string; title: string } | undefined = next
  if (hub) {
    const { prevSlug, nextSlug } = getHubPrevNext(hub, post.slug)
    const prevPost = prevSlug ? allBlogs.find((p) => p.slug === prevSlug) : undefined
    const nextPost = nextSlug ? allBlogs.find((p) => p.slug === nextSlug) : undefined
    hubPrev = prevPost ? { path: prevPost.path, title: prevPost.title } : undefined
    hubNext = nextPost ? { path: nextPost.path, title: nextPost.title } : undefined
  }

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      {isProduction && post && 'draft' in post && post.draft === true ? (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
          <Layout
            content={mainContent}
            authorDetails={authorDetails}
            next={hubNext}
            prev={hubPrev}
            rawText={post.body.raw}
          >
            <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
          </Layout>
        </>
      )}
    </>
  )
}
