'use client'

import React from 'react'
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
  WhatsappIcon,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  WhatsappShareButton,
} from 'react-share'

const SocialShare = ({ title, url }: { title: string; url: string }) => {
  return (
    <div className="flex space-x-3  p-4">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <RedditShareButton url={url} title={title}>
        <RedditIcon size={32} round />
      </RedditShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  )
}

export default SocialShare
