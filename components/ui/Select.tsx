'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-heading font-bold text-sm text-brand mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full appearance-none bg-white border rounded-xl px-4 py-3 pr-10 text-right text-brand text-base',
            'transition-all duration-200',
            'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10',
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : 'border-border',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Arrow — left side in RTL */}
        <ChevronDown
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-body text-right">{error}</p>
      )}
    </div>
  )
}
