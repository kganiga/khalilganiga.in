import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent } from 'pliny/utils/contentlayer'
import { allTools, allAuthors } from 'contentlayer/generated'
import type { Authors, Tool } from 'contentlayer/generated'
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
  const tool = allTools.find((p) => p.slug === slug)
  const authorList = tool?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!tool) {
    return
  }

  const publishedAt = new Date(tool.date).toISOString()
  const modifiedAt = new Date(tool.lastmod || tool.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (tool.images) {
    imageList = typeof tool.images === 'string' ? [tool.images] : tool.images
  }
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  const canonicalUrl =
    tool.canonicalUrl && tool.canonicalUrl.trim()
      ? tool.canonicalUrl.startsWith('http')
        ? tool.canonicalUrl
        : `${siteMetadata.siteUrl}/${tool.canonicalUrl.replace(/^\//, '')}`
      : `${siteMetadata.siteUrl}/${tool.path}`

  return {
    title: tool.title,
    description: tool.summary,
    robots: tool.draft ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.title} | ${siteMetadata.title}`,
      description: tool.summary,
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
      title: `${tool.title} | ${siteMetadata.title}`,
      description: tool.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allTools.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedTools = sortPosts(allTools) as Tool[]
  const toolIndex = sortedTools.findIndex((p) => p.slug === slug)
  const prev = coreContent(sortedTools[toolIndex + 1])
  const next = coreContent(sortedTools[toolIndex - 1])
  const tool = sortedTools.find((p) => p.slug === slug) as Tool
  const authorList = tool?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(tool)
  const jsonLd = tool.structuredData
  jsonLd['author'] = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }))
  jsonLd['publisher'] = {
    '@type': 'Organization',
    name: siteMetadata.author,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    },
  }

  const Layout = layouts[tool.layout || defaultLayout]

  return (
    <>
      {isProduction && tool && 'draft' in tool && tool.draft === true ? (
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
            rawText={tool.body.raw}
          >
            <MDXLayoutRenderer code={tool.body.code} components={components} toc={tool.toc} />
          </Layout>
        </>
      )}
    </>
  )
}
