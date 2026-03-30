import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, colorId: string, sizeId: string) => void
  updateQuantity: (productId: string, colorId: string, sizeId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalUniqueItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) =>
            i.product_id === newItem.product_id &&
            i.color_id === newItem.color_id &&
            i.size_id === newItem.size_id
        )
        if (existingIndex >= 0) {
          set({
            items: items.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (productId, colorId, sizeId) => {
        set({
          items: get().items.filter(
            (i) =>
              !(
                i.product_id === productId &&
                i.color_id === colorId &&
                i.size_id === sizeId
              )
          ),
        })
      },

      updateQuantity: (productId, colorId, sizeId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (i) =>
                !(
                  i.product_id === productId &&
                  i.color_id === colorId &&
                  i.size_id === sizeId
                )
            ),
          })
          return
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId &&
            i.color_id === colorId &&
            i.size_id === sizeId
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalUniqueItems: () => get().items.length,
    }),
    { name: 'melyima-cart' }
  )
)
