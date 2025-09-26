import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium'
  const classes =
    variant === 'primary'
      ? `${base} bg-primary-600 text-white hover:bg-primary-700`
      : `${base} bg-transparent text-primary-600`
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
