import React from 'react'

const Hero = () => {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:text-left">
      <div className="w-full">
        <h2 className="mb-4 text-4xl font-semibold md:text-5xl">
          hi, I’m <span className="gkb text-slate-600">Khalil Ganiga</span>
        </h2>
        <p className="mb-1">
          Welcome to my blog - Thoughts from a wandering mind. I have created this site to share my
          thoughts and experiences.
        </p>
        <p className="mb-4">Have a good read!</p>
        <a
          href="/about"
          className="hover:-tranneutral-y-px inline-block w-auto min-w-[100px] rounded-md bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-center text-white shadow-xl shadow-blue-200 transition-all hover:bg-gradient-to-b hover:text-white hover:shadow-2xl hover:shadow-blue-400 dark:shadow-blue-900 sm:w-auto"
        >
          Find out more
        </a>
      </div>
    </div>
  )
}

export default Hero
