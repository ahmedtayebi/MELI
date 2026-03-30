import { cn } from '@/lib/utils'

interface CardProps {
  hover?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function Card({ hover = false, className, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-border overflow-hidden',
        hover && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
