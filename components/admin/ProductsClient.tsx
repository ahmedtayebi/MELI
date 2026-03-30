'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getImageUrl } from '@/lib/storage'
import { Modal } from '@/components/ui'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props { initialProducts: Product[] }

export default function ProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const toggleVisibility = async (id: string, visible: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_visible: visible })
      .eq('id', id)
    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_visible: visible } : p))
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('product_colors').delete().eq('product_id', deleteId)
    await supabase.from('product_sizes').delete().eq('product_id', deleteId)
    await supabase.from('products').delete().eq('id', deleteId)
    setProducts(prev => prev.filter(p => p.id !== deleteId))
    setDeleteId(null)
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-black text-2xl text-brand">المنتجات</h1>
          <span className="bg-brand text-white text-xs font-bold font-heading px-2.5 py-1 rounded-full">
            {products.length}
          </span>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-1.5">
            <Plus size={15} />
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <p className="text-muted font-body text-sm mb-4">لا توجد منتجات بعد</p>
          <Link href="/admin/products/new">
            <Button variant="secondary" size="sm">إضافة أول منتج</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const firstColor = product.product_colors?.[0]
            const colorCount = product.product_colors?.length ?? 0
            const sizeCount = product.product_sizes?.length ?? 0

            return (
              <div key={product.id} className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-surface">
                  {getImageUrl(firstColor?.image_url ?? null) ? (
                    <Image
                      src={getImageUrl(firstColor!.image_url)!}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {firstColor ? (
                        <div
                          className="w-16 h-16 rounded-full border-4 border-white shadow"
                          style={{ backgroundColor: firstColor.hex_code }}
                        />
                      ) : (
                        <span className="font-heading font-black text-4xl text-border/60">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Visibility badge */}
                  <span className={cn(
                    'absolute top-2 right-2 text-[10px] font-bold font-heading px-2 py-0.5 rounded-full',
                    product.is_visible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {product.is_visible ? 'ظاهر' : 'مخفي'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-base text-brand mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted font-body mb-4">
                    {colorCount} لون · {sizeCount} مقاس
                  </p>

                  {/* Actions row */}
                  <div className="flex items-center gap-2">
                    {/* Visibility toggle */}
                    <button
                      onClick={() => toggleVisibility(product.id, !product.is_visible)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-heading font-bold px-3 py-1.5 rounded-full border transition-colors',
                        product.is_visible
                          ? 'border-green-200 text-green-700 hover:bg-green-50'
                          : 'border-border text-muted hover:border-brand hover:text-brand'
                      )}
                      title={product.is_visible ? 'إخفاء' : 'إظهار'}
                    >
                      {product.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      {product.is_visible ? 'ظاهر' : 'مخفي'}
                    </button>

                    <div className="flex gap-1 mr-auto">
                      {/* Edit */}
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg text-muted hover:text-brand hover:bg-surface transition-colors"
                        aria-label="تعديل"
                      >
                        <Pencil size={15} />
                      </Link>
                      {/* Delete */}
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="تأكيد الحذف"
      >
        <p className="text-sm text-muted font-body mb-6">
          هل أنتِ متأكدة من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <Button
            fullWidth
            onClick={confirmDelete}
            loading={deleting}
            className="bg-red-600 hover:bg-red-700 border-red-600"
          >
            نعم، احذف
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setDeleteId(null)}>
            إلغاء
          </Button>
        </div>
      </Modal>
    </div>
  )
}
