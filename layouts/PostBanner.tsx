import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import RelatedPosts from '@/components/RelatedPosts'
import AdSlot from '@/components/AdSlot'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  authorDetails?: CoreContent<Authors>[]
  titleLang?: string
  themeTags?: { text: string; href: string }[]
  relatedContent?: ReactNode
}

export default function PostMinimal({
  content,
  next,
  prev,
  children,
  authorDetails,
  titleLang,
  themeTags,
  relatedContent,
}: LayoutProps) {
  const { slug, title, images, tags } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-[2/1] w-full">
                  <Image
                    src={displayImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  />
                </div>
              </Bleed>
            </div>
            {/* Banner ad below the hero image */}
            <div className="mt-4">
              <AdSlot
                className="mx-auto"
                style={{ display: 'block', width: '100%' }}
                slot="4755654764"
                enabled={siteMetadata.ads?.enabled ?? true}
                client={siteMetadata.ads?.client}
              />
            </div>
            <div className="relative pt-10">
              <PageTitle lang={titleLang}>{title}</PageTitle>
            </div>
            {authorDetails && authorDetails.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                {authorDetails.map((author) => (
                  <Link
                    key={author.name}
                    href="/about"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        width={28}
                        height={28}
                        alt={author.name}
                        className="h-7 w-7 rounded-full"
                      />
                    )}
                    <span>
                      By{' '}
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {author.name}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="prose max-w-none py-4 dark:prose-invert">{children}</div>
          {/* End-of-story ad - placed after the text ends, never inside it */}
          <div className="my-4 min-h-[100px] text-center">
            <AdSlot
              className="mx-auto"
              style={{ display: 'block', width: '100%', maxWidth: 320, margin: '0 auto' }}
              slot="6343320175"
              enabled={siteMetadata.ads?.enabled ?? true}
              client={siteMetadata.ads?.client}
            />
          </div>
          {themeTags && themeTags.length > 0 && (
            <div className="flex flex-wrap gap-3 pb-6">
              {themeTags.map((tag) => (
                <Link
                  key={tag.href}
                  href={tag.href}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400"
                >
                  {tag.text}
                </Link>
              ))}
            </div>
          )}
          {/* <div className="flex items-center space-x-4 py-6">
            <h2 className="text-lg font-semibold">Share this post</h2>
            <SocialShare title={title} url={`${siteMetadata.siteUrl}/${slug}`} />
          </div> */}
          <div className="py-6">
            {relatedContent ?? <RelatedPosts tags={tags} currentSlug={slug} />}
          </div>
          {siteMetadata.comments && (
            <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          {/* <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer> */}
        </div>
      </article>
    </SectionContainer>
  )
}
