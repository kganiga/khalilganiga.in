import React from 'react'

export default function NewsletterSignup() {
  const id = 'newsletter-email'
  return (
    <form className="w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="email"
          placeholder="Your email"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <button className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Subscribe
        </button>
      </div>
    </form>
  )
}
