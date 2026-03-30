import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/store/ProductGrid'
import Button from '@/components/ui/Button'
import type { Product } from '@/lib/types'

export default async function StorePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(
      `id, name, is_visible, created_at, updated_at,
       product_colors(id, product_id, name, hex_code, image_url, is_visible),
       product_sizes(id, product_id, label, is_visible, sort_order)`
    )
    .eq('is_visible', true)
    .order('created_at', { ascending: false })

  const products: Product[] = ((data ?? []) as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    is_visible: p.is_visible,
    created_at: p.created_at,
    updated_at: p.updated_at,
    product_colors: (p.product_colors ?? []).filter((c: any) => c.is_visible),
    product_sizes: (p.product_sizes ?? [])
      .filter((s: any) => s.is_visible)
      .sort((a: any, b: any) => a.sort_order - b.sort_order),
  }))

  return (
    <>
      <HeroSection />
      <ProductsSection products={products} />
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row lg:min-h-screen">
      {/* Image area — RIGHT in RTL (55%) */}
      <div
        className="relative h-[56vw] lg:h-auto lg:w-[55%] bg-brand overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.025) 20px,
            rgba(255,255,255,0.025) 21px
          )`,
        }}
      >
        {/* Bottom overlay text */}
        <div className="absolute inset-x-0 bottom-0 p-8 lg:p-14 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-snug">
            أناقة يومية،
            <br />
            راحة لا تُضاهى
          </h1>
          <p className="mt-2 text-white/60 font-body text-sm lg:text-base">
            تشكيلة عبايات MELY•IMA
          </p>
        </div>
      </div>

      {/* Content area — LEFT in RTL (45%) */}
      <div className="lg:w-[45%] bg-surface flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-start">
          {/* Decorative accent line */}
          <div className="w-16 h-0.5 bg-accent mb-4" />

          {/* Wordmark */}
          <div className="font-heading font-black text-5xl lg:text-6xl text-brand leading-none mb-4 tracking-tight">
            MELY<span className="text-accent">•</span>IMA
          </div>

          {/* Tagline */}
          <p className="text-muted font-body text-base mb-8 max-w-xs">
            عباءات مصممة بعناية للمرأة الجزائرية العصرية
          </p>

          {/* CTA */}
          <a href="#products">
            <Button size="lg">تسوقي الآن</Button>
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────

function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
      <div className="mb-10">
        <h2 className="font-heading font-black text-3xl text-brand mb-2">التشكيلة</h2>
        <p className="text-muted font-body text-sm">
          اكتشفي أحدث مجموعاتنا من العبايات الفاخرة
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
