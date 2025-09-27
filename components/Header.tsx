import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Logo from './Logo'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="text-gray-900 transition-transform duration-200 hover:scale-105 hover:text-gray-700 dark:text-gray-100 dark:hover:text-primary-400"
        >
          <div className="flex items-center">
            <div className="mr-3">
              <Logo className="h-8 w-auto" title={siteMetadata.headerTitle} />
            </div>
          </div>
        </Link>
        <nav className="hidden flex-1 justify-center sm:flex">
          <div className="flex space-x-6">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="font-medium text-gray-900 relative group dark:text-gray-100"
              >
                <span className="transition-colors group-hover:text-primary-500 dark:group-hover:text-primary-400">
                  {link.title}
                </span>
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0 transition-all duration-300 ease-in-out group-hover:w-full dark:from-primary-400/0 dark:via-primary-400 dark:to-primary-400/0" />
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center space-x-4">
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
