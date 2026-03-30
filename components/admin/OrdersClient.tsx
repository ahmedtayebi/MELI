'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'
type FilterType = 'all' | OrderStatus

const STATUS_CONFIG: Record<OrderStatus, { label: string; badge: string; select: string }> = {
  pending:   { label: 'قيد الانتظار', badge: 'bg-amber-100 text-amber-800',  select: 'قيد الانتظار' },
  confirmed: { label: 'مؤكد',         badge: 'bg-blue-100 text-blue-800',    select: 'مؤكد' },
  delivered: { label: 'مُسلَّم',      badge: 'bg-green-100 text-green-800',  select: 'مُسلَّم' },
  cancelled: { label: 'ملغي',         badge: 'bg-red-100 text-red-800',      select: 'ملغي' },
}

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'all',       label: 'الكل' },
  { key: 'pending',   label: 'قيد الانتظار' },
  { key: 'confirmed', label: 'مؤكدة' },
  { key: 'delivered', label: 'مُسلَّمة' },
  { key: 'cancelled', label: 'ملغاة' },
]

const PER_PAGE = 20

interface Props { initialOrders: Order[] }

export default function OrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // ── Stats ─────────────────────────────────────────────────
  const stats = useMemo(() => ({
    all:       orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders])

  // ── Filtered + searched + paginated ───────────────────────
  const filtered = useMemo(() => {
    let r = orders
    if (filter !== 'all') r = r.filter(o => o.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(o =>
        o.customer_name.toLowerCase().includes(q) || o.phone.includes(q)
      )
    }
    return r
  }, [orders, filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleFilter = (f: FilterType) => { setFilter(f); setPage(1) }
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }

  // ── Status update ─────────────────────────────────────────
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    }
  }

  const formatDate = (d: string) => {
    const dt = new Date(d)
    return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-black text-2xl text-brand">الطلبات</h1>
        <span className="bg-brand text-white text-xs font-bold font-heading px-2.5 py-1 rounded-full">
          {orders.length}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: 'all' as FilterType, label: 'الكل', count: stats.all },
          { key: 'pending' as FilterType, label: 'قيد الانتظار', count: stats.pending },
          { key: 'confirmed' as FilterType, label: 'مؤكدة', count: stats.confirmed },
          { key: 'delivered' as FilterType, label: 'مُسلَّمة', count: stats.delivered },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => handleFilter(key)}
            className={cn(
              'bg-white rounded-xl border p-4 text-right transition-all',
              filter === key
                ? 'border-accent bg-accent text-white shadow-sm'
                : 'border-border hover:border-brand'
            )}
          >
            <p className={cn('font-heading font-black text-2xl', filter === key ? 'text-white' : 'text-brand')}>
              {count}
            </p>
            <p className={cn('text-xs font-body mt-0.5', filter === key ? 'text-white/80' : 'text-muted')}>
              {label}
            </p>
          </button>
        ))}
      </div>

      {/* Filter tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 overflow-x-auto">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilter(key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-colors',
                filter === key ? 'bg-brand text-white' : 'text-muted hover:text-brand'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
            className="w-full bg-white border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm text-brand placeholder:text-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              {['#', 'الاسم', 'الهاتف', 'الولاية', 'المنتجات', 'الحالة', 'التاريخ', 'إجراءات'].map(h => (
                <th key={h} className="text-right px-4 py-3 font-heading font-bold text-xs text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted font-body text-sm">
                  لا توجد طلبات
                </td>
              </tr>
            ) : paginated.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 font-body text-xs text-muted tabular-nums">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-brand">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted" dir="ltr">
                    {order.phone}
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-brand">
                    {order.wilaya}
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-muted">
                    {order.order_items?.length ?? 0} قطعة
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold font-heading',
                      STATUS_CONFIG[order.status as OrderStatus]?.badge ?? 'bg-gray-100 text-gray-700'
                    )}>
                      {STATUS_CONFIG[order.status as OrderStatus]?.label ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-muted tabular-nums">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-surface transition-colors"
                        aria-label="عرض التفاصيل"
                      >
                        {expandedId === order.id
                          ? <ChevronUp size={15} />
                          : <ChevronDown size={15} />}
                      </button>
                      {/* Status select */}
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-border rounded-lg px-2 py-1 bg-white font-body text-brand focus:outline-none focus:border-brand"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="delivered">مُسلَّم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </div>
                  </td>
                </tr>
                {/* Expanded items */}
                {expandedId === order.id && (
                  <tr key={`${order.id}-expanded`}>
                    <td colSpan={8} className="bg-surface/60 px-6 py-4">
                      <div className="space-y-2">
                        {(order.order_items ?? []).map(item => (
                          <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-border">
                            {/* Image */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              {item.color_image_url
                                ? <img src={item.color_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full" style={{ backgroundColor: item.color_hex }} />}
                            </div>
                            {/* Name */}
                            <span className="font-heading font-bold text-sm text-brand flex-1">{item.product_name}</span>
                            {/* Color */}
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.color_hex }} />
                              <span className="text-xs text-muted font-body">{item.color_name}</span>
                            </div>
                            {/* Size */}
                            <span className="text-xs font-heading font-bold text-brand border border-border rounded-full px-2 py-0.5">
                              {item.size_label}
                            </span>
                            {/* Qty */}
                            <span className="text-xs text-muted font-body tabular-nums">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.notes && (
                          <p className="text-xs text-muted font-body pr-1">
                            ملاحظة: {order.notes}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="lg:hidden space-y-3">
        {paginated.length === 0 ? (
          <p className="text-center py-12 text-muted font-body text-sm">لا توجد طلبات</p>
        ) : paginated.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-heading font-bold text-base text-brand">{order.customer_name}</p>
                <p className="text-sm text-muted font-body" dir="ltr">{order.phone}</p>
              </div>
              <span className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold font-heading flex-shrink-0',
                STATUS_CONFIG[order.status as OrderStatus]?.badge
              )}>
                {STATUS_CONFIG[order.status as OrderStatus]?.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted font-body">
              <span>{order.wilaya}</span>
              <span>·</span>
              <span>{order.order_items?.length ?? 0} قطعة</span>
              <span>·</span>
              <span className="tabular-nums">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="flex items-center gap-1 text-xs text-muted hover:text-brand font-body transition-colors"
              >
                {expandedId === order.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                التفاصيل
              </button>
              <select
                value={order.status}
                onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                className="mr-auto text-xs border border-border rounded-lg px-2 py-1 bg-white font-body text-brand focus:outline-none"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="delivered">مُسلَّم</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            {expandedId === order.id && (
              <div className="space-y-2 pt-1">
                {(order.order_items ?? []).map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {item.color_image_url
                        ? <img src={item.color_image_url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full" style={{ backgroundColor: item.color_hex }} />}
                    </div>
                    <span className="font-heading font-bold text-xs text-brand flex-1 truncate">{item.product_name}</span>
                    <span className="text-[10px] text-muted font-body">{item.color_name} / {item.size_label} ×{item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm font-heading font-bold border border-border rounded-lg disabled:opacity-40 hover:border-brand transition-colors"
          >
            السابق
          </button>
          <span className="text-sm font-body text-muted tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-heading font-bold border border-border rounded-lg disabled:opacity-40 hover:border-brand transition-colors"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  )
}
