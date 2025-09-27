import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-transparent text-gray-600">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/" className=" text-sm font-medium text-gray-600 sm:inline-block">
              {siteMetadata.title}
            </Link>
          </div>
          <p className="text-sm text-gray-600 text-center sm:text-left">{`© ${new Date().getFullYear()}`}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 sm:justify-start">
          <Link href="/privacy" className="hover:text-primary-500" aria-label="privacy-policy">
            Privacy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="hover:text-primary-500"
            aria-label="terms-and-conditions"
          >
            Terms
          </Link>
          <Link href="/about" className="hover:text-primary-500" aria-label="about-us">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary-500" aria-label="contact-us">
            Contact
          </Link>
        </div>

        <div className="flex justify-center items-center gap-4 sm:justify-start">
          <Link
            className="text-gray-500 hover:text-primary-500"
            href={siteMetadata.facebook ?? '#'}
            aria-label="facebook-link"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </Link>
          <Link
            className="text-gray-500 hover:text-primary-500"
            href={siteMetadata.twitter ?? '#'}
            aria-label="twitter-profile"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </Link>
          <Link
            className="text-gray-500 hover:text-primary-500"
            href={siteMetadata.instagram}
            aria-label="instagram-profile"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
            </svg>
          </Link>
          <Link
            className="text-gray-500 hover:text-primary-500"
            href="https://www.linkedin.com/in/khalilbashag"
            aria-label="linkedin-profile"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx={4} cy={4} r={2} />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
