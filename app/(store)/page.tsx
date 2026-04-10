import { createClient } from '@/lib/supabase/server'
import ProductsSection from '@/components/store/ProductsSection'
import BestSellersSection from '@/components/store/BestSellersSection'
import ReviewsSection from '@/components/store/ReviewsSection'
import HeroSection from '@/components/store/HeroSection'
import type { Product, Category, Review } from '@/lib/types'

const PRODUCTS_SELECT = `
  id, name, price, original_price, description, is_visible, category_id, sales_count, created_at, updated_at,
  product_colors(id, product_id, name, hex_code, image_url, is_visible,
    product_color_images(id, color_id, image_url, sort_order)),
  product_sizes(id, product_id, label, is_visible, sort_order)
`

const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  price: p.price ?? 0,
  original_price: p.original_price ?? 0,
  description: p.description ?? null,
  is_visible: p.is_visible,
  category_id: p.category_id ?? null,
  sales_count: p.sales_count ?? 0,
  created_at: p.created_at,
  updated_at: p.updated_at,
  product_colors: (p.product_colors ?? [])
    .filter((c: any) => c.is_visible)
    .map((c: any) => ({
      ...c,
      images: (c.product_color_images ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order),
    })),
  product_sizes: (p.product_sizes ?? [])
    .filter((s: any) => s.is_visible)
    .filter((s: any, i: number, arr: any[]) =>
      arr.findIndex((t: any) => t.label === s.label) === i)
    .sort((a: any, b: any) => a.sort_order - b.sort_order),
})

export default async function StorePage() {
  const supabase = await createClient()

  const [
    { data: productsData },
    { data: bestSellersData },
    { data: categoriesData },
    { data: reviewsData },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCTS_SELECT)
      .eq('is_visible', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select(PRODUCTS_SELECT)
      .eq('is_visible', true)
      .order('sales_count', { ascending: false })
      .limit(6),
    supabase
      .from('categories')
      .select('id, name, sort_order, is_visible')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const products: Product[] = (productsData ?? []).map(mapProduct)
  const bestSellers: Product[] = (bestSellersData ?? []).map(mapProduct)
  const categories: Category[] = (categoriesData ?? []) as Category[]
  const reviews: Review[] = (reviewsData ?? []) as Review[]

  return (
    <main className="pointer-events-auto">
      <HeroSection />
      <ReviewsSection reviews={reviews} />
      <BestSellersSection products={bestSellers} />
      <ProductsSection products={products} categories={categories} />
      <StatementSection />
    </main>
  )
}

// ─────────────────────────────────────────────────────────
// Statement Section
// ─────────────────────────────────────────────────────────

function StatementSection() {
  const stats = [
    { number: '100%', label: 'جودة مضمونة' },
    { number: 'يومي', label: 'توصيل لكل الولايات' },
    { number: '24/7', label: 'خدمة العملاء' },
  ]

  return (
    <section
      id="statement"
      className="relative py-28 px-6 text-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0E0B09 0%, #1C1108 50%, #0E0B09 100%)' }}
    >
      {/* Decorative orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,150,60,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,150,60,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,150,60,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-10">

        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="font-heading font-bold text-xs tracking-widest uppercase" style={{ color: '#C8963C' }}>
            رؤيتنا
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        {/* Headline */}
        <h2 className="font-heading font-black text-4xl sm:text-5xl text-white leading-tight">
          نحن لا نبيع عباءة
          <br />
          نبيع{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C8963C, #F0C060, #C8963C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ثقتكِ
          </span>{' '}
          بنفسك
        </h2>

        <p className="font-body text-white/50 text-base leading-relaxed max-w-md">
          كل عباءة مصممة بعناية لتعكس أناقتك اليومية وتمنحكِ الراحة طوال اليوم
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full mt-2">
          {stats.map(({ number, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 py-6 px-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,150,60,0.14)' }}
            >
              <span
                className="font-heading font-black text-2xl sm:text-3xl"
                style={{
                  background: 'linear-gradient(135deg, #C8963C, #F0C060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {number}
              </span>
              <span className="font-body text-white/45 text-xs sm:text-sm text-center leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#products"
          className="mt-2 px-8 py-4 rounded-full font-heading font-black text-sm text-[#0E0B09]"
          style={{ background: 'linear-gradient(135deg, #C8963C, #F0C060)' }}
        >
          اكتشفي التشكيلة
        </a>

      </div>
    </section>
  )
}
