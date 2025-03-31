import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Contact' })

export default function Contact() {
  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-1 pb-8 pt-6 md:space-y-1">
        <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-5xl md:leading-14">
          Contact
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Feel free to reach out to me if you have any questions or just want to say hello.
        </p>
        <p className="text-lg text-gray-600">
          <span className="font-bold text-primary-500">Email:</span>{' '}
          <Link className="focus:shadow-outline-blue" href={`mailto:${siteMetadata.email}`}>
            {siteMetadata.email}
          </Link>
        </p>
        <p className="pb-5"></p>
        <Link
          href="/"
          className="hover:-tranneutral-y-px inline-block w-auto min-w-[100px] rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-center text-white shadow-xl shadow-blue-200 transition-all hover:bg-gradient-to-b hover:text-white hover:shadow-2xl hover:shadow-blue-400 dark:shadow-blue-900 sm:w-auto"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
