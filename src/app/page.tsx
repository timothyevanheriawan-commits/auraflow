import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from '@/app/landing/page' // Import komponen UI tadi

export default async function RootPage() {
  const supabase = await createClient()

  // Cek apakah user sedang login?
  const { data: { user } } = await supabase.auth.getUser()

  // Jika SUDAH login, langsung lempar ke Dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Jika BELUM login, tampilkan Landing Page
  return <LandingPage />
}