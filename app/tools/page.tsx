import { genPageMetadata } from 'app/seo'
import ToolsPageClient from './ToolsPageClient'

export const metadata = genPageMetadata({
  title: 'Tools',
  description:
    'A curated collection of developer tools, Telegram bots, desktop utilities, and browser extensions built by Khalil Ganiga.',
  canonicalUrl: 'tools',
})

export default function ToolsPage() {
  return <ToolsPageClient />
}
