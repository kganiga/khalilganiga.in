/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Khalil Ganiga',
  author: 'Khalil Ganiga ',
  headerTitle: '<KG/>',
  description: "A developer's log book",
  language: 'en-us',
  siteUrl: 'https://www.khalilganiga.in',
  siteRepo: 'https://github.com/kganiga/khalilganiga.in',
  image: '/static/img/avatar.png',
  socialBanner: '/static/img/twitter-card.png',
  email: 'admin@khalilganiga.in',
  github: 'https://github.com/kganiga',
  twitter: 'https://twitter.com/Im_Khalil',
  linkedin: 'https://www.linkedin.com/in/khalilg',
  instagram: 'https://instagram.com/khalilbasha.g',
  youtube: 'https://youtube.com/khalilbasha.g',
  facebook: 'https://facebook.com/khalilbasha.g',
  locale: 'en-US',
  stickyNav: true,
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: process.env.GAID, // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    // Please add your .env file and modify it according to your selection
    provider: '',
  },
  comments: {
    provider: 'disqus',
    disqusConfig: {
      shortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
    }, // supported providers: giscus, utterances, disqus
    giscusConfig: {
      repo: '', // username/repoName
      // Visit the link below, enter your repo in the configuration section and copy the script data parameters
      // Before that you should create a new Github discussions category with the Announcements type so that new discussions can only be created by maintainers and giscus
      // https://giscus.app/
      repositoryId: '',
      category: '',
      categoryId: '',
      mapping: '', // supported options: pathname, url, title
      reactions: '', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: '',
      // theme when dark mode
      darkTheme: '',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
    },
    utterancesConfig: {
      repo: '', // username/repoName
      issueTerm: '', // supported options: pathname, url, title
      label: '', // label (optional): Comment 💬
      // theme example: github-light, github-dark, preferred-color-scheme
      // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
      theme: '',
      // theme when dark mode
      darkTheme: '',
    },
    disqus: {
      // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      shortname: '',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
  },
}

module.exports = siteMetadata
