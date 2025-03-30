import React from 'react'

const PageHeader = ({ title, subtitle, style }) => {
  return (
    <div className="py-8 text-center">
      <h1 className={style}>{title}</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
      <hr className='my-4 border-gray-200 dark:border-gray-700' />
    </div>
  )
}

export default PageHeader
