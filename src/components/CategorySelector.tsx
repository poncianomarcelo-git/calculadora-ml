'use client'

import { categorias } from '@/data/categorias'

interface CategorySelectorProps {
  value: number
  onChange: (index: number) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-ml-text mb-1">
        Categoria do produto
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue bg-white transition-colors"
      >
        {categorias.map((cat, i) => (
          <option key={i} value={i}>
            {cat.nome}
          </option>
        ))}
      </select>
      <p className="text-xs text-ml-gray-dark mt-1">
        Clássico: {(categorias[value].classico * 100).toFixed(0)}% &nbsp;|&nbsp;
        Premium: {(categorias[value].premium * 100).toFixed(0)}%
      </p>
    </div>
  )
}
