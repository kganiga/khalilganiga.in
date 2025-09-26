import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
  onPageChange,
}) => {
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null

  return (
    <div className="mt-8 flex items-center justify-between">
      <div>
        {prevPage && (
          <button
            onClick={() => onPageChange(prevPage)}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </div>
      <div>
        {nextPage && (
          <button
            onClick={() => onPageChange(nextPage)}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default Pagination
