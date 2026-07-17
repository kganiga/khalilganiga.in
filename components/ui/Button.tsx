import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'primary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export default function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-950'
  const variants = {
    default:
      'bg-gray-950 text-white shadow-sm hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gray-200',
    primary:
      'bg-primary-600 text-white shadow-sm hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary:
      'bg-gray-100 text-gray-950 shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700',
    outline:
      'border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50',
    ghost: 'hover:bg-gray-100 hover:text-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50',
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(base, variants[variant], sizes[size], children.props.className, className),
    })
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}
