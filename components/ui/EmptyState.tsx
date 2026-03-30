import { type LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
      <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center text-muted">
        <Icon size={32} />
      </div>
      <div className="gap-1.5 flex flex-col items-center">
        <h3 className="font-heading font-bold text-base text-brand">{title}</h3>
        {description && (
          <p className="text-sm text-muted font-body max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
