import { genPageMetadata } from 'app/seo'
import StoriesPageClient from './StoriesClient'

export const metadata = genPageMetadata({
  title: 'Musings',
  canonicalUrl: 'stories',
})

export default function Page() {
  return <StoriesPageClient />
}
