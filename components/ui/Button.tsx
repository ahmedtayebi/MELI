'use client'

import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:
    'bg-accent text-white hover:bg-[#7D1729] rounded-full border-transparent',
  secondary:
    'bg-transparent border border-brand text-brand hover:bg-brand hover:text-white rounded-full',
  ghost:
    'bg-transparent border-transparent text-muted hover:text-brand rounded-full',
  icon:
    'bg-transparent border-transparent text-muted hover:text-brand rounded-xl w-11 h-11 p-0 flex items-center justify-center',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isIcon = variant === 'icon'

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-heading font-bold',
        'border transition-all duration-200',
        'active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        !isIcon && sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
