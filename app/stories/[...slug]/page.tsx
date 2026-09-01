import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent } from 'pliny/utils/contentlayer'
import { allStories, allAuthors } from 'contentlayer/generated'
import type { Authors, Story } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

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
  const post = allStories.find((p) => p.slug === slug)
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
  const ogImages = imageList.map((img) => (img.includes('http') ? img : siteMetadata.siteUrl + img))

  const canonicalUrl =
    post.canonicalUrl && post.canonicalUrl.trim()
      ? post.canonicalUrl.startsWith('http')
        ? post.canonicalUrl
        : `${siteMetadata.siteUrl}/${post.canonicalUrl.replace(/^\//, '')}`
      : `${siteMetadata.siteUrl}/${post.path}`

  return {
    title: `${post.title}`,
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
      images: ogImages.map((url) => ({ url })),
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${siteMetadata.title}`,
      description: post.summary,
      images: ogImages,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allStories.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedPosts = sortPosts(allStories) as Story[]
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = coreContent(sortedPosts[postIndex + 1])
  const next = coreContent(sortedPosts[postIndex - 1])
  const post = sortedPosts.find((p) => p.slug === slug) as Story
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
          <Layout
            content={mainContent}
            authorDetails={authorDetails}
            next={next}
            prev={prev}
            rawText={post.body.raw}
          >
            <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
          </Layout>
        </>
      )}
    </>
  )
}
