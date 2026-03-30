export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-32 bg-white/10 rounded-xl" />
        <div className="h-6 w-6 bg-white/10 rounded-full" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-4 space-y-2">
            <div className="h-7 w-10 bg-border rounded-lg" />
            <div className="h-4 w-20 bg-border rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="bg-white rounded-xl border border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-border last:border-0 flex gap-4">
            <div className="h-4 w-16 bg-border rounded" />
            <div className="h-4 flex-1 bg-border rounded" />
            <div className="h-4 w-20 bg-border rounded" />
            <div className="h-4 w-16 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
