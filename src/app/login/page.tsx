'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Mail, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/calculadora')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ml-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-ml-yellow rounded-xl px-5 py-3 shadow-md">
            <ShoppingCart className="text-ml-text" size={24} />
            <span className="text-xl font-bold text-ml-text">Calculadora ML</span>
          </div>
          <p className="mt-3 text-ml-gray-dark text-sm">Precificação inteligente para o Mercado Livre</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-xl font-bold text-ml-text mb-6">Entrar na sua conta</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-ml-red text-ml-red rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ml-text mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ml-gray-dark" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ml-text mb-1">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ml-gray-dark" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ml-yellow hover:bg-ml-yellow-dark text-ml-text font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-ml-gray-dark mt-6">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-ml-blue font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
