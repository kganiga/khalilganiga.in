import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  lang?: string
}

export default function PageTitle({ children, lang }: Props) {
  return (
    <h1
      lang={lang}
      className="text-3xl font-extrabold capitalize leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
    >
      {children}
    </h1>
  )
}
