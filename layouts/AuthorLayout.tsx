import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from '@/components/Link'
import { ArrowRight, BriefcaseBusiness, Code2, Mail, PenLine, Sparkles } from 'lucide-react'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content
  const profileName = name || 'Khalil Ganiga'
  const role = occupation || 'Software architect and storyteller'

  return (
    <div className="space-y-12 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(16,185,129,0.08)_45%,rgba(245,158,11,0.12))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(16,185,129,0.08)_45%,rgba(245,158,11,0.12))]" />
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800 dark:border-sky-900/80 dark:bg-sky-950/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              The person behind the posts
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              About Me
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              I build software systems, write practical technical notes, and shape stories when the
              day gets quiet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="gap-2" size="lg">
                <Link href="/blog" className="break-normal">
                  Read the blog
                  <Code2 className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="gap-2" size="lg" variant="outline">
                <Link href="/stories" className="break-normal">
                  Explore musings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            {avatar && (
              <div className="relative h-80 bg-gray-100 dark:bg-gray-900">
                <Image
                  src={avatar}
                  alt={profileName}
                  width={720}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-950 dark:text-white">
                {profileName}
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <BriefcaseBusiness className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  {role}
                </div>
                {company && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <PenLine className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    {company}
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
                  <Mail className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  Connect
                </div>
                <div className="flex gap-4">
                  <SocialIcon size={6} kind="mail" href={`mailto:${email}`} />
                  <SocialIcon size={6} kind="github" href={github} />
                  <SocialIcon size={6} kind="linkedin" href={linkedin} />
                  <SocialIcon size={6} kind="twitter" href={twitter} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Focus areas
            </div>
            <div className="space-y-3">
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
                  <Code2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  Software architecture
                </div>
              </div>
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
                  <PenLine className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  Storytelling
                </div>
              </div>
              <div className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Creative experiments
                </div>
              </div>
            </div>
          </Card>
        </aside>

        <Card className="p-6 sm:p-8">
          <div className="prose prose-gray max-w-none dark:prose-invert prose-a:text-primary-600 dark:prose-a:text-primary-400">
            {children}
          </div>
        </Card>
      </section>
    </div>
  )
}
