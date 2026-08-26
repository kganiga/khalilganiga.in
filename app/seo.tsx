import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  canonicalUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  canonicalUrl,
  ...rest
}: PageSEOProps): Metadata {
  const absoluteCanonicalUrl = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${siteMetadata.siteUrl}/${canonicalUrl.replace(/^\//, '')}`
    : undefined

  const metadata: Metadata = {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: absoluteCanonicalUrl || './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }

  if (absoluteCanonicalUrl) {
    metadata.alternates = {
      canonical: absoluteCanonicalUrl,
      ...metadata.alternates,
    }
  }

  return metadata
}
