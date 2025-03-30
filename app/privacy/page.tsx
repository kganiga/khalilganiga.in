import { allPrivacyPolicies } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Privacy Policy' })

export default function Page() {
  const privacyPolicy = allPrivacyPolicies.find((p) => p.slug === 'default')

  if (!privacyPolicy) {
    return <p>Privacy policy not found.</p>
  }

  const mainContent = coreContent(privacyPolicy)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-3 pt-6 md:space-y-5">
          <h1 className="text-center text-xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl md:leading-10 lg:text-5xl lg:leading-14">
            Privacy Policy
          </h1>
        </div>

        <div className="prose max-w-full pb-8 pt-8 dark:prose-invert">
          <MDXLayoutRenderer code={privacyPolicy.body.code}>{mainContent}</MDXLayoutRenderer>
        </div>
      </div>
    </>
  )
}
