import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaMastodon,
  FaEnvelope,
} from 'react-icons/fa'

const socialLinks = [
  {
    href: siteMetadata.email ? `mailto:${siteMetadata.email}` : '',
    icon: FaEnvelope,
    title: 'Email',
  },
  { href: siteMetadata.facebook, icon: FaFacebook, title: 'Facebook' },
  { href: siteMetadata.instagram, icon: FaInstagram, title: 'Instagram' },
  { href: siteMetadata.twitter, icon: FaTwitter, title: 'Twitter' },
  { href: siteMetadata.linkedin, icon: FaLinkedin, title: 'LinkedIn' },
  { href: siteMetadata.github, icon: FaGithub, title: 'GitHub' },
  { href: siteMetadata.youtube, icon: FaYoutube, title: 'YouTube' },
  { href: siteMetadata.mastodon, icon: FaMastodon, title: 'Mastodon' },
].filter(({ href }) => href) // Removes undefined or empty links

const SocialIcons = () => {
  return (
    <>
      <h2>Social Plugin</h2>
      <hr className="my-4" />
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {socialLinks.map(({ href, icon: Icon, title }) =>
          href.startsWith('/') ? (
            // Internal links use Next.js <Link>
            <Link key={title} href={href} className="text-gray-400 hover:text-gray-500">
              <Icon size={32} title={title} />
            </Link>
          ) : (
            // External links use <a> with target="_blank"
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
              title={title}
            >
              <Icon size={32} />
            </a>
          )
        )}
      </div>
    </>
  )
}

export default SocialIcons
