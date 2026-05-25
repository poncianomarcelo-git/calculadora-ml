'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Info } from 'lucide-react'
import { CategorySelector } from './CategorySelector'
import { calcularM2, formatBRL } from '@/utils/formulas'
import type {
  Material,
  MaterialLinha,
  InsumoLinha,
  InsumoConfig,
  MaoDeObra,
  TipoAnuncio,
  UnidadeMaterial,
} from '@/types'

const UNIDADES: { value: UnidadeMaterial; label: string }[] = [
  { value: 'm2', label: 'm²' },
  { value: 'un', label: 'un' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'L', label: 'L' },
  { value: 'ml', label: 'ml' },
  { value: 'm', label: 'm' },
]

interface FabricanteFormProps {
  materiaisConfig: Material[]
  insumosConfig: InsumoConfig[]
  materiaisLinha: MaterialLinha[]
  insumosLinha: InsumoLinha[]
  maoDeObra: MaoDeObra
  embalagem: number
  categoriaIndex: number
  tipoAnuncio: TipoAnuncio
  imposto: number
  lucroDesejado: number
  onAddMaterial: () => void
  onRemoveMaterial: (id: string) => void
  onUpdateMaterial: (id: string, campo: keyof Omit<MaterialLinha, 'id'>, valor: string | number) => void
  onAddInsumo: () => void
  onRemoveInsumo: (id: string) => void
  onUpdateInsumo: (id: string, campo: keyof Omit<InsumoLinha, 'id'>, valor: string | number) => void
  onMaoDeObraChange: (v: MaoDeObra) => void
  onEmbalagemChange: (v: number) => void
  onOpenConfig: () => void
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
  placeholder = '0',
  prefix,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  placeholder?: string
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
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue transition-colors ${
          prefix ? 'pl-7 pr-3' : suffix ? 'pl-3 pr-10' : 'px-3'
        }`}
      />
      {suffix && (
        <span className="absolute right-3 text-ml-gray-dark text-sm pointer-events-none">{suffix}</span>
      )}
    </div>
  )
}

export function FabricanteForm({
  materiaisConfig,
  insumosConfig,
  materiaisLinha,
  insumosLinha,
  maoDeObra,
  embalagem,
  categoriaIndex,
  tipoAnuncio,
  imposto,
  lucroDesejado,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateMaterial,
  onAddInsumo,
  onRemoveInsumo,
  onUpdateInsumo,
  onMaoDeObraChange,
  onEmbalagemChange,
  onOpenConfig,
  onCategoriaChange,
  onTipoAnuncioChange,
  onImpostoChange,
  onLucroChange,
}: FabricanteFormProps) {
  return (
    <div className="space-y-4">
      {/* Matérias-primas */}
      <SectionCard title="Matérias-primas">
        <div className="space-y-3">
          {/* Cabeçalho das colunas */}
          <div className="grid grid-cols-[1fr_58px_60px_60px_80px_auto] gap-2">
            <span className="text-xs text-ml-gray-dark">Material</span>
            <span className="text-xs text-ml-gray-dark">Unid.</span>
            <span className="text-xs text-ml-gray-dark">Larg./Qtd</span>
            <span className="text-xs text-ml-gray-dark">Alt. (cm)</span>
            <span className="text-xs text-ml-gray-dark">R$/unid.</span>
            <span />
          </div>

          {materiaisLinha.map((linha) => {
            const isM2 = linha.unidade === 'm2'
            const mat = materiaisConfig.find((m) => m.id === linha.materialId)
            const preco = mat?.preco_por_m2 ?? 0
            const unLabel = UNIDADES.find((u) => u.value === linha.unidade)?.label ?? linha.unidade
            const custo = mat && preco
              ? isM2
                ? (linha.largura && linha.altura ? calcularM2(linha.largura, linha.altura) * preco : 0)
                : (linha.quantidade ? linha.quantidade * preco : 0)
              : 0

            return (
              <div key={linha.id} className="grid grid-cols-[1fr_58px_60px_60px_80px_auto] gap-2 items-center">
                {/* Material */}
                <select
                  value={linha.materialId}
                  onChange={(e) => onUpdateMaterial(linha.id, 'materialId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-ml-blue bg-white"
                >
                  <option value="">Selecione...</option>
                  {materiaisConfig.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>

                {/* Unidade */}
                <select
                  value={linha.unidade}
                  onChange={(e) => onUpdateMaterial(linha.id, 'unidade', e.target.value as UnidadeMaterial)}
                  className="w-full border border-gray-300 rounded-lg px-1 py-2 text-sm focus:outline-none focus:border-ml-blue bg-white"
                >
                  {UNIDADES.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>

                {/* Larg ou Qtd */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={isM2 ? (linha.largura || '') : (linha.quantidade || '')}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value.replace(',', '.')) || 0
                    onUpdateMaterial(linha.id, isM2 ? 'largura' : 'quantidade', v)
                  }}
                  placeholder={isM2 ? 'cm' : 'qtd'}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-ml-blue"
                />

                {/* Alt (só m²) */}
                {isM2 ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={linha.altura || ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value.replace(',', '.')) || 0
                      onUpdateMaterial(linha.id, 'altura', v)
                    }}
                    placeholder="cm"
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-ml-blue"
                  />
                ) : (
                  <div />
                )}

                {/* Preço travado (vem das Configurações) */}
                {preco > 0 ? (
                  <div className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-50 text-ml-gray-dark cursor-default select-none flex items-center justify-between gap-1">
                    <span className="text-xs whitespace-nowrap">{formatBRL(preco)}/{unLabel}</span>
                    <span
                      title="Valor definido em Configurações. Acesse o menu para alterar."
                      className="shrink-0 text-ml-gray-dark hover:text-ml-blue cursor-help"
                    >
                      <Info size={13} />
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="w-full border border-amber-300 rounded-lg px-2 py-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-center leading-snug"
                  >
                    Cadastrar custo
                  </button>
                )}

                {/* Custo + delete */}
                <div className="flex items-center gap-1">
                  {custo > 0 && (
                    <span className="text-xs text-ml-green font-medium whitespace-nowrap">
                      {formatBRL(custo)}
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveMaterial(linha.id)}
                    disabled={materiaisLinha.length === 1}
                    className="p-2 text-ml-gray-dark hover:text-ml-red transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={onAddMaterial}
          className="mt-3 flex items-center gap-1.5 text-ml-blue text-sm hover:text-ml-blue-dark transition-colors"
        >
          <Plus size={15} />
          Adicionar material
        </button>
      </SectionCard>

      {/* Insumos */}
      <SectionCard title="Insumos">
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_120px_auto] gap-2">
            <span className="text-xs text-ml-gray-dark">Insumo</span>
            <span className="text-xs text-ml-gray-dark">Custo (R$)</span>
            <span />
          </div>
          {insumosLinha.map((linha) => {
            const cfg = insumosConfig.find((c) => c.id === linha.insumoConfigId)
            return (
              <div key={linha.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-center">
                <select
                  value={linha.insumoConfigId}
                  onChange={(e) => {
                    const selected = insumosConfig.find((c) => c.id === e.target.value)
                    onUpdateInsumo(linha.id, 'insumoConfigId', e.target.value)
                    onUpdateInsumo(linha.id, 'nome', selected?.nome ?? '')
                    onUpdateInsumo(linha.id, 'custo', selected?.custo ?? 0)
                  }}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-ml-blue bg-white"
                >
                  <option value="">Selecione...</option>
                  {insumosConfig.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>

                {cfg ? (
                  <div className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-gray-50 text-ml-gray-dark flex items-center justify-between gap-1 cursor-default select-none">
                    <span className="text-xs whitespace-nowrap">{formatBRL(cfg.custo)}</span>
                    <span title="Valor definido em Configurações. Acesse o menu para alterar." className="shrink-0 text-ml-gray-dark hover:text-ml-blue cursor-help">
                      <Info size={13} />
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="w-full border border-amber-300 rounded-lg px-2 py-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-center"
                  >
                    Cadastrar insumo
                  </button>
                )}

                <button
                  onClick={() => onRemoveInsumo(linha.id)}
                  disabled={insumosLinha.length === 1}
                  className="p-2 text-ml-gray-dark hover:text-ml-red transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
        <button
          onClick={onAddInsumo}
          className="mt-3 flex items-center gap-1.5 text-ml-blue text-sm hover:text-ml-blue-dark transition-colors"
        >
          <Plus size={15} />
          Adicionar insumo
        </button>
      </SectionCard>

      {/* Mão de obra */}
      <SectionCard title="Mão de obra">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-ml-gray-dark mb-1">Minutos gastos</label>
            <NumInput
              value={maoDeObra.minutos}
              onChange={(v) => onMaoDeObraChange({ ...maoDeObra, minutos: v })}
              suffix="min"
            />
          </div>
          <div>
            <label className="block text-xs text-ml-gray-dark mb-1">Custo por hora</label>
            <NumInput
              value={maoDeObra.custoPorHora}
              onChange={(v) => onMaoDeObraChange({ ...maoDeObra, custoPorHora: v })}
              prefix="R$"
            />
          </div>
        </div>
        {maoDeObra.minutos > 0 && (
          <p className="text-xs text-ml-gray-dark mt-2">
            Custo de mão de obra:{' '}
            <span className="text-ml-green font-medium">
              {formatBRL((maoDeObra.minutos / 60) * maoDeObra.custoPorHora)}
            </span>
          </p>
        )}
      </SectionCard>

      {/* Embalagem */}
      <SectionCard title="Embalagem">
        <div>
          <label className="block text-xs text-ml-gray-dark mb-1">Embalagem por unidade</label>
          <NumInput value={embalagem} onChange={onEmbalagemChange} prefix="R$" />
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
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
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
