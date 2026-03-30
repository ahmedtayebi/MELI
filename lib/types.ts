export interface Product {
  id: string
  name: string
  price: number
  is_visible: boolean
  created_at: string
  updated_at: string
  product_colors?: ProductColor[]
  product_sizes?: ProductSize[]
}

export interface ProductColor {
  id: string
  product_id: string
  name: string
  hex_code: string
  image_url: string | null
  is_visible: boolean
}

export interface ProductSize {
  id: string
  product_id: string
  label: string
  is_visible: boolean
  sort_order: number
}

export interface Order {
  id: string
  customer_name: string
  phone: string
  wilaya: string
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  color_name: string
  color_hex: string
  color_image_url: string | null
  size_label: string
  quantity: number
}

export interface CartItem {
  product_id: string
  product_name: string
  color_id: string
  color_name: string
  color_hex: string
  color_image_url: string | null
  size_id: string
  size_label: string
  quantity: number
}
