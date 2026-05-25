'use client'

import { Settings } from 'lucide-react'
import type { Perfil } from '@/types'

interface ProfileSelectorProps {
  perfil: Perfil
  onChange: (perfil: Perfil) => void
  onOpenConfig: () => void
}

export function ProfileSelector({ perfil, onChange, onOpenConfig }: ProfileSelectorProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex">
          {(['fabricante', 'revendedor'] as Perfil[]).map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                perfil === p
                  ? 'border-ml-blue text-ml-blue font-semibold'
                  : 'border-transparent text-ml-gray-dark hover:text-ml-text'
              }`}
            >
              {p === 'fabricante' ? 'Sou Fabricante' : 'Sou Revendedor'}
            </button>
          ))}
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium border-b-2 border-transparent text-ml-gray-dark hover:text-ml-text transition-colors"
          >
            <Settings size={15} />
            Configurações
          </button>
        </div>
      </div>
    </div>
  )
}
