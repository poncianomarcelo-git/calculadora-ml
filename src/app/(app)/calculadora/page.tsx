import { createClient } from '@/lib/supabase/server'
import { CalculadoraClient } from './CalculadoraClient'

export default async function CalculadoraPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <CalculadoraClient email={user?.email ?? ''} />
}
