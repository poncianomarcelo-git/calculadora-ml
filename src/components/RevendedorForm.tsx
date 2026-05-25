'use client'

import { useState, useEffect, useRef } from 'react'
import { CategorySelector } from './CategorySelector'
import type { TipoAnuncio } from '@/types'

interface RevendedorFormProps {
  custoAquisicao: number
  embalagem: number
  categoriaIndex: number
  tipoAnuncio: TipoAnuncio
  imposto: number
  lucroDesejado: number
  onCustoAquisicaoChange: (v: number) => void
  onEmbalagemChange: (v: number) => void
  onCategoriaChange: (i: number) => void
  onTipoAnuncioChange: (t: TipoAnuncio) => void
  onImpostoChange: (v: number) => void
  onLucroChange: (v: number) => void
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-semibold text-ml-text text-sm mb-3">{title}</h3>
      {children}
    </div>
  )
}

function NumInput({
  value,
  onChange,
  prefix,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(value === 0 ? '' : String(value).replace('.', ','))
  const lastEmitted = useRef(value)

  useEffect(() => {
    if (Math.abs(value - lastEmitted.current) > 0.000001) {
      lastEmitted.current = value
      setDisplay(value === 0 ? '' : String(value).replace('.', ','))
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '' || /^[0-9]*[,.]?[0-9]*$/.test(raw)) {
      setDisplay(raw)
      const parsed = parseFloat(raw.replace(',', '.'))
      const num = isNaN(parsed) ? 0 : parsed
      lastEmitted.current = num
      onChange(num)
    }
  }

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-ml-gray-dark text-sm pointer-events-none">{prefix}</span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        placeholder="0"
        className={`w-full border border-gray-300 rounded-lg py-2.5 text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors ${
          prefix ? 'pl-9 pr-3' : suffix ? 'pl-3 pr-10' : 'px-3'
        }`}
      />
      {suffix && (
        <span className="absolute right-3 text-ml-gray-dark text-sm pointer-events-none">{suffix}</span>
      )}
    </div>
  )
}

export function RevendedorForm({
  custoAquisicao,
  embalagem,
  categoriaIndex,
  tipoAnuncio,
  imposto,
  lucroDesejado,
  onCustoAquisicaoChange,
  onEmbalagemChange,
  onCategoriaChange,
  onTipoAnuncioChange,
  onImpostoChange,
  onLucroChange,
}: RevendedorFormProps) {
  return (
    <div className="space-y-4">
      {/* Custo do produto */}
      <SectionCard title="Custo do produto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-ml-gray-dark mb-1">Valor de aquisição</label>
            <NumInput value={custoAquisicao} onChange={onCustoAquisicaoChange} prefix="R$" />
          </div>
          <div>
            <label className="block text-xs text-ml-gray-dark mb-1">Embalagem</label>
            <NumInput value={embalagem} onChange={onEmbalagemChange} prefix="R$" />
          </div>
        </div>
      </SectionCard>

      {/* Configurações de venda */}
      <SectionCard title="Configurações de venda">
        <div className="space-y-4">
          <CategorySelector value={categoriaIndex} onChange={onCategoriaChange} />

          <div>
            <label className="block text-sm font-medium text-ml-text mb-2">Tipo de anúncio</label>
            <div className="flex gap-2">
              {(['classico', 'premium'] as TipoAnuncio[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => onTipoAnuncioChange(tipo)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                    tipoAnuncio === tipo
                      ? 'bg-ml-blue text-white border-ml-blue'
                      : 'border-ml-blue text-ml-blue hover:bg-blue-50'
                  }`}
                >
                  {tipo === 'classico' ? 'Clássico' : 'Premium'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ml-gray-dark mb-1">Imposto (%)</label>
              <NumInput
                value={imposto * 100}
                onChange={(v) => onImpostoChange(v / 100)}
                suffix="%"
              />
            </div>
            <div>
              <label className="block text-xs text-ml-gray-dark mb-1">Lucro desejado (%)</label>
              <NumInput
                value={lucroDesejado * 100}
                onChange={(v) => onLucroChange(v / 100)}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
