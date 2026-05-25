'use client'

import { ShoppingCart, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  email?: string
}

export function Header({ email }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-ml-yellow shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} className="text-ml-text" />
          <span className="font-bold text-ml-text text-lg">Calculadora ML</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden sm:block text-xs text-ml-gray-dark truncate max-w-[200px]">
              {email}
            </span>
          )}
          <button
            onClick={handleLogout}
            title="Sair"
            className="p-2 rounded-lg hover:bg-ml-yellow-dark transition-colors text-ml-text"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
