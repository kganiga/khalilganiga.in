'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  useEffect(() => {
    // Set loadComments to true when the component mounts
    setLoadComments(true)
  }, []) // Empty dependency array ensures that the effect runs only once

  return (
    <>
      {siteMetadata.comments && loadComments && (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      )}
    </>
  )
}
