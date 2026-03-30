export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border flex flex-col animate-pulse">
      {/* Image placeholder — matches 3:4 aspect ratio */}
      <div className="w-full bg-gradient-to-r from-border via-surface to-border bg-[length:200%_100%]" style={{ aspectRatio: '3/4' }} />

      {/* Color swatches */}
      <div className="px-4 pt-3 flex gap-1.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-7 h-7 rounded-full bg-border" />
        ))}
      </div>

      {/* Product name */}
      <div className="px-4 pt-2 pb-1">
        <div className="h-5 bg-border rounded-lg w-3/4" />
      </div>

      {/* Size pills */}
      <div className="px-4 pb-3 flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-6 w-8 bg-border rounded-full" />
        ))}
      </div>

      {/* Button */}
      <div className="mt-auto h-[50px] bg-border" />
    </div>
  )
}
