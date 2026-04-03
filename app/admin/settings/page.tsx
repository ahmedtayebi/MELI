import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/admin/SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_settings')
    .select('key, value')

  const settings = Object.fromEntries(
    (data ?? []).map((s: { key: string; value: string }) => [s.key, s.value])
  )

  return <SettingsClient initialSettings={settings} />
}
