'use client'

import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-heading font-bold text-sm text-brand mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full bg-white border rounded-xl px-4 py-3 text-right text-brand text-base',
          'placeholder:text-muted/60',
          'transition-all duration-200',
          'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-border',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-body text-right">{error}</p>
      )}
    </div>
  )
}
