import ProductSkeleton from '@/components/store/ProductSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="bg-brand animate-pulse" style={{ height: 420 }} />

      {/* Products skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Section title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-40 bg-border rounded-xl animate-pulse" />
          <div className="h-6 w-6 bg-border rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
