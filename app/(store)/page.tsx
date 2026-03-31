import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/store/ProductGrid'
import Button from '@/components/ui/Button'
import type { Product } from '@/lib/types'

export default async function StorePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(
      `id, name, price, is_visible, created_at, updated_at,
       product_colors(id, product_id, name, hex_code, image_url, is_visible),
       product_sizes(id, product_id, label, is_visible, sort_order)`
    )
    .eq('is_visible', true)
    .order('created_at', { ascending: false })

  const products: Product[] = ((data ?? []) as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price ?? 0,
    is_visible: p.is_visible,
    created_at: p.created_at,
    updated_at: p.updated_at,
    product_colors: (p.product_colors ?? []).filter((c: any) => c.is_visible),
    product_sizes: (p.product_sizes ?? [])
      .filter((s: any) => s.is_visible)
      .sort((a: any, b: any) => a.sort_order - b.sort_order),
  }))

  return (
    <main className="pointer-events-auto">
      <HeroSection />
      <ProductsSection products={products} />
      <StatementSection />

    </main>
  )
}

// ─────────────────────────────────────────────────────────
// Statement
// ─────────────────────────────────────────────────────────

function StatementSection() {
  return (
    <section id="statement" className="bg-brand py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

        <h2 className="font-heading font-black text-4xl sm:text-5xl text-white leading-tight">
          نحن لا نبيع عباءة
          <br />
          نبيع <span className="text-accent">ثقتكِ</span> بنفسك
        </h2>

        <div className="w-16 h-0.5 bg-accent" />

        <p className="font-body text-white/60 text-lg italic leading-relaxed max-w-md">
          كل عباءة مصممة بعناية لتعكس أناقتك اليومية وتمنحكِ الراحة طوال اليوم
        </p>

        <div className="grid grid-cols-3 gap-6 w-full mt-4">
          {[
            { number: '100%', label: 'جودة مضمونة' },
            { number: 'يومي', label: 'توصيل لكل الولايات' },
            { number: '24/7', label: 'خدمة العملاء' },
          ].map(({ number, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="font-heading font-black text-2xl sm:text-3xl text-accent">
                {number}
              </span>
              <span className="font-body text-white/50 text-xs sm:text-sm text-center">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row-reverse">

      {/* Image area — LEFT in RTL (55%) */}
      <div className="relative h-[70vw] lg:h-[85vh] lg:w-[55%] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="MELY•IMA عباءة"
          className="w-full h-full object-cover object-center"
        />
        {/* <div className="absolute inset-x-0 bottom-0 p-8 lg:p-14 bg-gradient-to-t from-black/70 to-transparent">
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-snug">
            أناقة يومية،
            <br />
            راحة لا تُضاهى
          </h1>
          <p className="mt-2 text-white/60 font-body text-sm lg:text-base">
            تشكيلة عبايات MELY•IMA
          </p>
        </div> */}
      </div>

      {/* Content area — RIGHT in RTL (45%) */}
      <div className="lg:w-[45%] lg:h-[85vh] bg-surface flex flex-col justify-center py-12 lg:py-0">
        <div className="flex flex-col w-full px-8 lg:px-16" style={{ alignItems: 'flex-right', textAlign: 'right' }}>
          <div style={{ width: '64px', height: '2px', backgroundColor: '#8B1A2E', marginBottom: '16px', alignSelf: 'flex-right' }} />
          <div className="font-heading font-black text-5xl lg:text-6xl text-brand leading-none mb-4 tracking-tight" style={{ width: '100%', textAlign: 'right' }}>
            MELY<span className="text-accent">•</span>IMA
          </div>
          <p className="text-muted font-body text-2xl mb-8" style={{ width: '100%', textAlign: 'right' }}>
            عباءات مصممة بعناية للمرأة الجزائرية العصرية
          </p>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-right' }}>
            <a href="#products">
              <Button size="lg">تسوقي الآن</Button>
            </a>
          </div>
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
    <section id="products" className="relative z-10 pointer-events-auto bg-[#FFFDF9] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="mb-10">
          <h2 className="font-heading font-black text-3xl text-brand mb-2">لبسي واش تحبي معانا madame</h2>
          <p className="text-muted font-body text-sm">
            اكتشفي أحدث مجموعاتنا من العبايات الفاخرة
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
