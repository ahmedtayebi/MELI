import { DELIVERY_PRICES } from './delivery-prices'

export const wilayas = DELIVERY_PRICES.map(w => ({
  value: w.code,
  label: `${w.code} - ${w.name}`,
}))
