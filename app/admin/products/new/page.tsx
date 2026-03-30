import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  const productId = crypto.randomUUID()
  return <ProductForm productId={productId} />
}
