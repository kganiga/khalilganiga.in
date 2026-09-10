// Single source of truth for the AEM topic-hub architecture. Membership is a
// curated, explicit list of existing article slugs (not derived from tags, which
// are inconsistent across the blog) - see the hub proposal for why these three
// hubs were chosen and why other candidate clusters (Security, QueryBuilder, Oak
// indexes, MSM, a standalone Interview Questions hub) were not built as their own
// pages: none had enough dedicated, non-overlapping content to avoid being thin.

export interface AemHubSection {
  heading: string
  articleSlugs: string[]
}

export interface AemHub {
  slug: string
  title: string
  shortTitle: string
  description: string
  intro: string[]
  sections: AemHubSection[]
}

export const aemHubs: AemHub[] = [
  {
    slug: 'aem-dispatcher-caching',
    title: 'AEM Dispatcher & Caching Guide',
    shortTitle: 'AEM Dispatcher & Caching Guide',
    description:
      'A complete, ordered guide to the AEM Dispatcher: what it does, how to configure it, how to secure it, and how to design caching and CDN strategy around it.',
    intro: [
      'The Dispatcher is the single piece of AEM infrastructure most developers understand the least, and it is also the one most likely to cause a production incident when misconfigured. This guide collects everything on this site about the Dispatcher and the caching strategy built around it, in the order it actually makes sense to learn it: what the Dispatcher is and why it exists, how `dispatcher.any` is structured, how `/filter` rules keep your site secure, how `/cache` rules and cache invalidation work, and how that foundation scales into multi-CDN, high-availability architecture.',
      'If you are troubleshooting a live issue rather than learning from scratch, jump straight to the troubleshooting and interview-question articles near the end.',
    ],
    sections: [
      {
        heading: 'Dispatcher Fundamentals',
        articleSlugs: [
          'aem-dispatcher/dev-guide-part1',
          'aem-dispatcher/dev-guide-part2',
          'aem-dispatcher/dev-guide-part3',
          'aem-dispatcher/dev-guide-part4',
          'aem-dispatcher/dev-guide-part5',
          'aem-dispatcher/dev-guide-part6',
          'aem-dispatcher/dev-guide-part7',
          'aem-dispatcher/top-15-interview-questions',
        ],
      },
      {
        heading: 'Caching Strategy',
        articleSlugs: [
          'aem-caching/cache-basics-and-dispatcher-invalidation',
          'aem-caching/dynamic-content-dispatcher-strategies',
          'aem-caching/high-availability-caching-architecture',
        ],
      },
    ],
  },
  {
    slug: 'aem-workflows',
    title: 'AEM Workflows on AEM as a Cloud Service',
    shortTitle: 'AEM Workflows Guide',
    description:
      'A five-part series on AEM Workflows in AEM as a Cloud Service: the basics, what you can customize, advanced topics, a large-scale use case, and interview scenarios.',
    intro: [
      'Workflows are one of the areas that changed the most in the move to AEM as a Cloud Service. This series walks through them in order: the basic model, what AEMaaCS actually lets you customize (and what it does not), advanced topics like transient workflows and failure handling, a large-scale multi-site/translation use case, and finally the kind of workflow questions that come up in AEM architect interviews.',
    ],
    sections: [
      {
        heading: 'The Series',
        articleSlugs: [
          'aem-as-a-cloud-service-workflows-part-1-the-basics',
          'aem-as-a-cloud-service-workflows-part-2-what-you-can-customize',
          'aem-as-a-cloud-service-workflows-part-3-advanced-topics',
          'aem-as-a-cloud-service-workflows-part-4-a-large-scale-use-case',
          'aem-as-a-cloud-service-workflows-part-5-interview-scenarios',
        ],
      },
    ],
  },
  {
    slug: 'aem-developer-guide',
    title: 'AEM Developer Guide',
    shortTitle: 'AEM Developer Guide',
    description:
      'Practical, standalone AEM developer notes: managing a local instance, querying content efficiently, and the best practices and troubleshooting fixes that come up in day-to-day AEM development.',
    intro: [
      'Not every useful AEM article belongs to a series - this hub gathers the standalone, practical notes that developers actually search for: running and managing a local instance, writing efficient queries, and the best-practice fixes and troubleshooting write-ups that come from real production issues.',
    ],
    sections: [
      {
        heading: 'Managing Your AEM Instance',
        articleSlugs: [
          'how-to-backuprestore-aem-local-instance',
          'how-to-change-the-port-of-running-aem-instance',
          'how-to-find-the-current-run-mode-in-aem',
          'how-to-find-the-version-of-aem-that-you-are-running',
          'how-to-run-offline-compaction-in-aem-on-windows',
        ],
      },
      {
        heading: 'Querying & Performance',
        articleSlugs: [
          'aem-query-builder-vs-sql2-performance-best-practices',
          'most-useful-sql2-and-xpath-queries-in-aem-development',
          'acomprehensive-guide-to-master-xpath-queries-in-java',
        ],
      },
      {
        heading: 'Best Practices & Troubleshooting',
        articleSlugs: [
          'difference-between-jcrlastmodified-and-cqlastmodified-in-aem',
          'aem-best-practices-when-to-close-your-resourceresolver',
          'null-is-not-enough-best-way-to-check-resource-existence-in-aem',
          'how-to-register-a-servlet-on-all-pages-in-aem',
          'why-attackers-prefer-path-based-servlets-in-aem',
          'implementing-a-spinner-dialog-to-block-user-input-during-rest-api-calls-in-aem',
          'how-to-monitor-replication-queues-in-aem',
          'segment-not-found-exeption-in-aem',
          'custom-attribute-or-element-search-in-aem-assets-ui',
        ],
      },
      {
        heading: 'Quick References',
        articleSlugs: [
          'aem-cheat-sheets-the-ulitimate-collection',
          'a-unique-collection-of-curated-curl-commands',
        ],
      },
    ],
  },
]

export function getHubBySlug(hubSlug: string): AemHub | undefined {
  return aemHubs.find((hub) => hub.slug === hubSlug)
}

export function getHubForArticleSlug(articleSlug: string): AemHub | undefined {
  return aemHubs.find((hub) =>
    hub.sections.some((section) => section.articleSlugs.includes(articleSlug))
  )
}

function flattenedSlugs(hub: AemHub): string[] {
  return hub.sections.flatMap((section) => section.articleSlugs)
}

// Returns the nearest articles before/after the current one in the hub's defined
// reading order (not date order) - i.e. genuine prerequisite and follow-up reading,
// not just "the same 4 articles every page in this hub happens to list first".
// Near the start/end of a hub, the short side is backfilled from the other side so
// every article still surfaces a similar number of related links.
export function getHubNeighbors(
  hub: AemHub,
  currentSlug: string,
  maxEachSide = 2
): { before: string[]; after: string[] } {
  const all = flattenedSlugs(hub)
  const index = all.indexOf(currentSlug)
  if (index === -1) return { before: [], after: [] }

  const beforeAll = all.slice(0, index)
  const afterAll = all.slice(index + 1)

  let beforeCount = Math.min(maxEachSide, beforeAll.length)
  let afterCount = Math.min(maxEachSide, afterAll.length)

  const target = maxEachSide * 2
  if (beforeCount + afterCount < target) {
    afterCount = Math.min(afterAll.length, target - beforeCount)
    beforeCount = Math.min(beforeAll.length, target - afterCount)
  }

  return {
    before: beforeAll.slice(beforeAll.length - beforeCount),
    after: afterAll.slice(0, afterCount),
  }
}

// Series-order prev/next (for the article footer), as opposed to the site-wide
// date-based prev/next - within a hub, "next" should mean "next in the guide",
// not "whatever else happened to publish next".
export function getHubPrevNext(
  hub: AemHub,
  currentSlug: string
): { prevSlug?: string; nextSlug?: string } {
  const all = flattenedSlugs(hub)
  const index = all.indexOf(currentSlug)
  if (index === -1) return {}
  return {
    prevSlug: index > 0 ? all[index - 1] : undefined,
    nextSlug: index < all.length - 1 ? all[index + 1] : undefined,
  }
}
