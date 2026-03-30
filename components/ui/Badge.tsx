import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-border text-muted',
  accent: 'bg-accent text-white',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
}

interface BadgeProps {
  variant?: keyof typeof variants
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold font-heading',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
