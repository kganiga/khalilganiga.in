import Link from '@/components/Link'
import SocialIcons from '@/components/SocialIcons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import { ArrowRight, Mail, MessageSquareText, Sparkles } from 'lucide-react'

export const metadata = genPageMetadata({ title: 'Contact', canonicalUrl: 'contact' })

const contactTopics = [
  {
    title: 'AEM and engineering',
    description:
      'Questions about Adobe Experience Manager, Java, tooling, or implementation ideas.',
  },
  {
    title: 'Writing and stories',
    description: 'Notes about essays, Telugu stories, collaborations, or reader feedback.',
  },
  {
    title: 'General hello',
    description: 'A quick note, correction, suggestion, or anything that deserves a conversation.',
  },
]

export default function Contact() {
  return (
    <div className="space-y-12 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(16,185,129,0.08)_48%,rgba(244,63,94,0.10))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(16,185,129,0.08)_48%,rgba(244,63,94,0.12))]" />
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800 dark:border-sky-900/80 dark:bg-sky-950/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              Let us talk
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              Contact
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              Have a question, idea, correction, or just want to say hello? Send a note and I will
              get back when I can.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="gap-2" size="lg">
                <Link href={`mailto:${siteMetadata.email}`} className="break-normal">
                  Email me
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="gap-2" size="lg" variant="outline">
                <Link href="/" className="break-normal">
                  Back to home
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Direct email
            </p>
            <Link
              href={`mailto:${siteMetadata.email}`}
              className="mt-3 block break-all text-2xl font-semibold text-gray-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
            >
              {siteMetadata.email}
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Best for detailed questions, project discussions, corrections, or feedback on an
              article or story.
            </p>
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
              <SocialIcons />
            </div>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
            Good reasons to write
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            What can I help with?
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Pick the closest thread and send the note by email. A little context up front helps me
            reply with something useful.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {contactTopics.map((topic) => (
            <Card key={topic.title} className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-950 dark:text-white">{topic.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {topic.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
