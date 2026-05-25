'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('Erro ao criar conta: ' + error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ml-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <CheckCircle size={48} className="text-ml-green mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ml-text mb-2">Conta criada!</h2>
          <p className="text-ml-gray-dark text-sm">Verifique seu email para confirmar o cadastro. Redirecionando para o login...</p>
        </div>
      </div>
    )
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
          <p className="mt-3 text-ml-gray-dark text-sm">Crie sua conta gratuitamente</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-xl font-bold text-ml-text mb-6">Criar conta</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-ml-red text-ml-red rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-4">
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
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ml-text mb-1">Confirmar senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ml-gray-dark" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repita a senha"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ml-yellow hover:bg-ml-yellow-dark text-ml-text font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-ml-gray-dark mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-ml-blue font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
