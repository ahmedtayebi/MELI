import { createClient } from '@/lib/supabase/server'
import ReviewsClient from '@/components/admin/ReviewsClient'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return <ReviewsClient initialReviews={data ?? []} />
}
