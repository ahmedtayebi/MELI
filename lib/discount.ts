export function getDiscountPercent(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function hasDiscount(price: number, originalPrice: number): boolean {
  return originalPrice > 0 && originalPrice > price
}
