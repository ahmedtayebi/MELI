'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import ReviewForm from './ReviewForm'
import type { Review } from '@/lib/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex flex-row-reverse gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          fill={rating >= star ? '#8B1A2E' : 'none'}
          stroke={rating >= star ? '#8B1A2E' : '#E8E4DF'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div
      className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-6 flex flex-col gap-4 select-none"
      style={{
        boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
        border: '1px solid #E8E4DF',
      }}
    >
      <StarRating rating={review.rating} />

      <p className="font-body text-brand text-sm leading-relaxed text-right flex-1 line-clamp-4">
        "{review.comment}"
      </p>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <div className="text-right">
          <p className="font-heading font-bold text-sm text-brand">{review.customer_name}</p>
          <p className="font-body text-xs text-muted">{date}</p>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-black text-sm text-white"
          style={{ backgroundColor: '#8B1A2E' }}
        >
          {review.customer_name.charAt(0)}
        </div>
      </div>
    </div>
  )
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [showForm, setShowForm] = useState(false)
  const [scrollIndex, setScrollIndex] = useState(0)
  const visibleCount = 3

  const canPrev = scrollIndex > 0
  const canNext = scrollIndex < reviews.length - visibleCount

  const scroll = (dir: 'prev' | 'next') => {
    setScrollIndex(i =>
      dir === 'next'
        ? Math.min(i + 1, reviews.length - visibleCount)
        : Math.max(i - 1, 0)
    )
  }

  return (
    <section className="w-full py-16 lg:py-24" style={{ backgroundColor: '#fbfaf7ff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="text-right">
            <h2 className="font-heading font-black text-3xl text-brand mb-1">
              ماذا قالت زبوناتنا
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill="#8B1A2E" stroke="#8B1A2E" strokeWidth={1.5} />
                  ))}
                </div>
                <span className="font-body text-sm text-muted">
                  {reviews.length} تقييم
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-bold text-sm transition-all duration-200 flex-shrink-0"
            style={{
              backgroundColor: showForm ? '#1a1a1a' : '#ffffff',
              color: showForm ? '#ffffff' : '#1a1a1a',
              border: '2px solid',
              borderColor: showForm ? '#1a1a1a' : '#E8E4DF',
            }}
          >
            {showForm ? 'إغلاق' : 'أضيفي رأيك'}
          </button>
        </div>

        {/* Review form */}
        {showForm && (
          <div
            className="bg-white rounded-2xl p-6 mb-10 max-w-lg"
            style={{ boxShadow: '0 2px 16px rgba(26,26,26,0.08)', border: '1px solid #E8E4DF' }}
          >
            <h3 className="font-heading font-black text-lg text-brand mb-5 text-right">
              شاركينا تجربتك
            </h3>
            <ReviewForm />
          </div>
        )}

        {/* Reviews */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted text-sm">كوني أول من يشارك رأيها!</p>
          </div>
        ) : (
          <>
            {/* Desktop: scrollable row with arrows */}
            <div className="hidden lg:block relative">
              <div className="overflow-hidden">
                <div
                  className="flex gap-5 transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(${scrollIndex * -(320 + 20)}px)` }}
                >
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>

              {reviews.length > visibleCount && (
                <div className="flex gap-2 mt-6 justify-center">
                  <button
                    onClick={() => scroll('prev')}
                    disabled={!canPrev}
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:border-brand"
                  >
                    <ChevronRight size={18} className="text-brand" />
                  </button>
                  <button
                    onClick={() => scroll('next')}
                    disabled={!canNext}
                    className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center transition-all duration-200 disabled:opacity-30 hover:border-brand"
                  >
                    <ChevronLeft size={18} className="text-brand" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="lg:hidden flex flex-row-reverse gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                 style={{ scrollbarWidth: 'none' }}>
              {reviews.map(review => (
                <div key={review.id} className="snap-start">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  )
}
