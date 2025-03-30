import React from 'react'

const Hero = () => {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:text-left">
      <div className="w-full">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          hi, I’m <span className="gkb text-slate-600">Khalil Ganiga</span>
        </h2>
        <p className="mb-1">
          Welcome to my blog - Thoughts from a wandering mind. I have created this site to share my
          thoughts and experiences.
        </p>
        <p className="mb-4">Have a good read!</p>
        <a
          href="/about"
          className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-lg text-white shadow-lg"
        >
          Find out more
        </a>
      </div>
    </div>
  )
}

export default Hero
