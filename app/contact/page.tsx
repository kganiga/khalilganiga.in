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
          className="btn btn-primary focus:shadow-outline-blue mb-4 inline-flex 
             items-center rounded-md border border-transparent bg-primary-500 
             px-4 py-2 text-base font-medium text-white shadow-sm transition 
             duration-150 ease-in-out hover:bg-gray-200 hover:text-primary-600 focus:outline-none focus:ring-2 
             focus:ring-primary-500 focus:ring-offset-2 active:bg-primary-700 disabled:opacity-50 
             dark:hover:bg-gray-800 dark:hover:text-white md:mb-0"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
