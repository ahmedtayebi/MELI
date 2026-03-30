'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, GripVertical, Eye, EyeOff, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Product, ProductColor, ProductSize } from '@/lib/types'

// ── Local state types ──────────────────────────────────────────────────────────

interface ColorEntry {
  id: string          // existing DB id or temp uuid
  isNew: boolean
  name: string
  hex_code: string
  image_url: string | null   // existing URL
  imageFile: File | null     // pending upload
  imagePreview: string | null
  is_visible: boolean
  toDelete?: boolean
}

interface SizeEntry {
  id: string
  isNew: boolean
  label: string
  is_visible: boolean
  sort_order: number
  toDelete?: boolean
}

// ── Quick-add size presets ─────────────────────────────────────────────────────

const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

// ── Helpers ────────────────────────────────────────────────────────────────────

function tempId() {
  return `new_${Math.random().toString(36).slice(2)}`
}

function buildInitialColors(product?: Product): ColorEntry[] {
  if (!product?.product_colors?.length) return []
  return product.product_colors.map(c => ({
    id: c.id,
    isNew: false,
    name: c.name,
    hex_code: c.hex_code,
    image_url: c.image_url,
    imageFile: null,
    imagePreview: null,
    is_visible: c.is_visible,
  }))
}

function buildInitialSizes(product?: Product): SizeEntry[] {
  if (!product?.product_sizes?.length) return []
  return [...product.product_sizes]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(s => ({
      id: s.id,
      isNew: false,
      label: s.label,
      is_visible: s.is_visible,
      sort_order: s.sort_order,
    }))
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  productId: string
  initialData?: Product
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProductForm({ productId, initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [name, setName] = useState(initialData?.name ?? '')
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true)
  const [colors, setColors] = useState<ColorEntry[]>(buildInitialColors(initialData))
  const [sizes, setSizes] = useState<SizeEntry[]>(buildInitialSizes(initialData))
  const [customSize, setCustomSize] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Drag state for size reorder
  const dragIndex = useRef<number | null>(null)

  // ── Color helpers ────────────────────────────────────────────────────────────

  const addColor = () => {
    setColors(prev => [...prev, {
      id: tempId(),
      isNew: true,
      name: '',
      hex_code: '#000000',
      image_url: null,
      imageFile: null,
      imagePreview: null,
      is_visible: true,
    }])
  }

  const updateColor = (id: string, patch: Partial<ColorEntry>) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  const removeColor = (id: string) => {
    setColors(prev => prev.map(c =>
      c.id === id ? (c.isNew ? null! : { ...c, toDelete: true }) : c
    ).filter(Boolean))
  }

  const handleImageDrop = useCallback((id: string, file: File) => {
    const preview = URL.createObjectURL(file)
    updateColor(id, { imageFile: file, imagePreview: preview })
  }, [])

  // ── Size helpers ─────────────────────────────────────────────────────────────

  const addSize = (label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return
    if (sizes.some(s => !s.toDelete && s.label === trimmed)) return
    setSizes(prev => [...prev, {
      id: tempId(),
      isNew: true,
      label: trimmed,
      is_visible: true,
      sort_order: prev.filter(s => !s.toDelete).length,
    }])
  }

  const removeSize = (id: string) => {
    setSizes(prev => prev.map(s =>
      s.id === id ? (s.isNew ? null! : { ...s, toDelete: true }) : s
    ).filter(Boolean))
  }

  const updateSize = (id: string, patch: Partial<SizeEntry>) => {
    setSizes(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  // ── Drag-to-reorder sizes ────────────────────────────────────────────────────

  const visibleSizes = sizes.filter(s => !s.toDelete)

  const onDragStart = (idx: number) => { dragIndex.current = idx }

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    const from = dragIndex.current
    if (from === null || from === idx) return
    setSizes(prev => {
      const visible = prev.filter(s => !s.toDelete)
      const deleted = prev.filter(s => s.toDelete)
      const reordered = [...visible]
      const [moved] = reordered.splice(from, 1)
      reordered.splice(idx, 0, moved)
      const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i }))
      dragIndex.current = idx
      return [...withOrder, ...deleted]
    })
  }

  // ── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setError('')
    if (!name.trim()) { setError('يرجى إدخال اسم المنتج'); return }

    const activeColors = colors.filter(c => !c.toDelete)
    if (activeColors.length === 0) { setError('يرجى إضافة لون واحد على الأقل'); return }
    if (activeColors.some(c => !c.name.trim())) { setError('يرجى إدخال اسم لكل لون'); return }

    setSaving(true)
    try {
      const supabase = createClient()

      // 1. Upsert product
      const { error: productError } = await supabase
        .from('products')
        .upsert({ id: productId, name: name.trim(), is_visible: isVisible })
      if (productError) throw new Error(productError.message)

      // 2. Process colors
      for (const color of colors) {
        if (color.toDelete) {
          // Delete image from storage if exists
          if (color.image_url) {
            const path = `${productId}/${color.id}.webp`
            await supabase.storage.from('product-images').remove([path])
          }
          await supabase.from('product_colors').delete().eq('id', color.id)
          continue
        }

        let image_url = color.image_url
        if (color.imageFile) {
          const path = `${productId}/${color.id}.webp`
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(path, color.imageFile, { upsert: true, contentType: 'image/webp' })
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(path)
            image_url = publicUrl
          }
        }

        const colorPayload = {
          id: color.isNew ? color.id.replace('new_', '') : color.id,
          product_id: productId,
          name: color.name.trim(),
          hex_code: color.hex_code,
          image_url,
          is_visible: color.is_visible,
        }

        if (color.isNew) {
          // Use a real UUID for new colors
          const { error: insertError } = await supabase
            .from('product_colors')
            .insert({ ...colorPayload, id: undefined })
          if (insertError) throw new Error(insertError.message)
        } else {
          const { error: updateError } = await supabase
            .from('product_colors')
            .update({
              name: color.name.trim(),
              hex_code: color.hex_code,
              image_url,
              is_visible: color.is_visible,
            })
            .eq('id', color.id)
          if (updateError) throw new Error(updateError.message)
        }
      }

      // 3. Process sizes
      for (const size of sizes) {
        if (size.toDelete) {
          await supabase.from('product_sizes').delete().eq('id', size.id)
          continue
        }
        if (size.isNew) {
          await supabase.from('product_sizes').insert({
            product_id: productId,
            label: size.label,
            is_visible: size.is_visible,
            sort_order: size.sort_order,
          })
        } else {
          await supabase.from('product_sizes').update({
            label: size.label,
            is_visible: size.is_visible,
            sort_order: size.sort_order,
          }).eq('id', size.id)
        }
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، يرجى المحاولة مجدداً')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-black text-2xl text-brand">
          {isEdit ? 'تعديل المنتج' : 'إضافة منتج'}
        </h1>
        <button
          onClick={() => router.back()}
          className="text-sm font-heading font-bold text-muted hover:text-brand transition-colors"
        >
          رجوع
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Product name */}
      <section className="bg-white rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-heading font-bold text-base text-brand">اسم المنتج</h2>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="مثال: عباية سوداء فاخرة"
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-body"
        />
      </section>

      {/* Visibility */}
      <section className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-bold text-base text-brand">ظهور المنتج</p>
            <p className="text-xs text-muted font-body mt-0.5">
              {isVisible ? 'المنتج ظاهر للزبائن' : 'المنتج مخفي عن الزبائن'}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(v => !v)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-heading font-bold px-4 py-2 rounded-full border transition-colors',
              isVisible
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'border-border text-muted hover:border-brand hover:text-brand'
            )}
          >
            {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
            {isVisible ? 'ظاهر' : 'مخفي'}
          </button>
        </div>
      </section>

      {/* Colors */}
      <section className="bg-white rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-brand">الألوان</h2>
          <button
            onClick={addColor}
            className="flex items-center gap-1 text-xs font-heading font-bold text-accent hover:text-accent/80 transition-colors"
          >
            <Plus size={14} />
            إضافة لون
          </button>
        </div>

        {colors.filter(c => !c.toDelete).length === 0 && (
          <p className="text-sm text-muted font-body text-center py-4">
            لم يتم إضافة أي لون بعد
          </p>
        )}

        <div className="space-y-4">
          {colors.filter(c => !c.toDelete).map(color => (
            <ColorRow
              key={color.id}
              color={color}
              onChange={patch => updateColor(color.id, patch)}
              onRemove={() => removeColor(color.id)}
              onImageDrop={file => handleImageDrop(color.id, file)}
            />
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section className="bg-white rounded-xl border border-border p-5 space-y-4">
        <h2 className="font-heading font-bold text-base text-brand">المقاسات</h2>

        {/* Quick-add presets */}
        <div className="flex flex-wrap gap-2">
          {SIZE_PRESETS.map(preset => {
            const exists = visibleSizes.some(s => s.label === preset)
            return (
              <button
                key={preset}
                onClick={() => exists ? removeSize(sizes.find(s => s.label === preset && !s.toDelete)!.id) : addSize(preset)}
                className={cn(
                  'px-3 py-1 text-xs font-heading font-bold rounded-full border transition-colors',
                  exists
                    ? 'bg-brand text-white border-brand'
                    : 'border-border text-muted hover:border-brand hover:text-brand'
                )}
              >
                {preset}
              </button>
            )
          })}
        </div>

        {/* Custom size */}
        <div className="flex gap-2">
          <input
            value={customSize}
            onChange={e => setCustomSize(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { addSize(customSize); setCustomSize('') } }}
            placeholder="مقاس مخصص..."
            className="flex-1 border border-border rounded-xl px-4 py-2 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-body"
          />
          <button
            onClick={() => { addSize(customSize); setCustomSize('') }}
            className="px-4 py-2 bg-brand text-white text-sm font-heading font-bold rounded-xl hover:bg-brand/90 transition-colors"
          >
            إضافة
          </button>
        </div>

        {/* Size list — draggable */}
        {visibleSizes.length > 0 && (
          <div className="space-y-2">
            {visibleSizes.map((size, idx) => (
              <div
                key={size.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => onDragOver(e, idx)}
                className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2.5 border border-border cursor-grab active:cursor-grabbing"
              >
                <GripVertical size={14} className="text-muted flex-shrink-0" />
                <span className="flex-1 font-heading font-bold text-sm text-brand">{size.label}</span>
                <button
                  onClick={() => updateSize(size.id, { is_visible: !size.is_visible })}
                  className={cn(
                    'p-1 rounded transition-colors',
                    size.is_visible ? 'text-green-600 hover:text-green-700' : 'text-muted hover:text-brand'
                  )}
                  title={size.is_visible ? 'إخفاء' : 'إظهار'}
                >
                  {size.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  onClick={() => removeSize(size.id)}
                  className="p-1 rounded text-muted hover:text-red-500 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save */}
      <div className="flex gap-3 pb-8">
        <Button onClick={handleSave} loading={saving} className="flex-1">
          {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </Button>
        <Button variant="secondary" onClick={() => router.back()} className="flex-1">
          إلغاء
        </Button>
      </div>
    </div>
  )
}

// ── ColorRow sub-component ─────────────────────────────────────────────────────

interface ColorRowProps {
  color: ColorEntry
  onChange: (patch: Partial<ColorEntry>) => void
  onRemove: () => void
  onImageDrop: (file: File) => void
}

function ColorRow({ color, onChange, onRemove, onImageDrop }: ColorRowProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [draggingOver, setDraggingOver] = useState(false)

  const preview = color.imagePreview ?? color.image_url

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return
    onImageDrop(files[0])
  }

  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      {/* Top row: color picker + name + remove */}
      <div className="flex items-center gap-3">
        {/* Color picker */}
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={color.hex_code}
            onChange={e => onChange({ hex_code: e.target.value })}
            className="sr-only"
            id={`color-picker-${color.id}`}
          />
          <label
            htmlFor={`color-picker-${color.id}`}
            className="w-10 h-10 rounded-lg border-2 border-white shadow cursor-pointer block"
            style={{ backgroundColor: color.hex_code }}
          />
        </div>

        {/* Hex input */}
        <input
          value={color.hex_code}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange({ hex_code: v })
          }}
          className="w-24 border border-border rounded-lg px-2 py-1.5 text-xs font-body text-brand focus:outline-none focus:border-brand"
          dir="ltr"
        />

        {/* Name */}
        <input
          value={color.name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder="اسم اللون"
          className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm font-body text-brand placeholder:text-muted focus:outline-none focus:border-brand"
        />

        {/* Visibility */}
        <button
          onClick={() => onChange({ is_visible: !color.is_visible })}
          className={cn(
            'p-2 rounded-lg transition-colors',
            color.is_visible ? 'text-green-600 hover:bg-green-50' : 'text-muted hover:text-brand hover:bg-surface'
          )}
          title={color.is_visible ? 'إخفاء' : 'إظهار'}
        >
          {color.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Image drop zone */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-colors cursor-pointer',
          draggingOver ? 'border-accent bg-accent/5' : 'border-border hover:border-brand/50'
        )}
        style={{ minHeight: 100 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDraggingOver(true) }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={e => {
          e.preventDefault()
          setDraggingOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        {preview ? (
          <div className="relative aspect-[4/3]">
            <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
            <button
              onClick={e => { e.stopPropagation(); onChange({ imageFile: null, imagePreview: null, image_url: null }) }}
              className="absolute top-2 left-2 p-1 bg-white/90 rounded-full shadow text-brand hover:text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Upload size={20} className="text-muted" />
            <p className="text-xs text-muted font-body">اسحب الصورة هنا أو انقر للاختيار</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}
