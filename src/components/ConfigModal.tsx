'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Material, InsumoConfig } from '@/types'

interface ConfigModalProps {
  materiaisConfig: Material[]
  insumosConfig: InsumoConfig[]
  custoPorHora: number
  imposto: number
  onSave: (materiais: Material[], insumos: InsumoConfig[], custoPorHora: number, imposto: number) => Promise<void>
  onClose: () => void
}

function uid() {
  return Math.random().toString(36).slice(2)
}

export function ConfigModal({
  materiaisConfig,
  insumosConfig,
  custoPorHora,
  imposto,
  onSave,
  onClose,
}: ConfigModalProps) {
  const [materiais, setMateriais] = useState<Material[]>(
    materiaisConfig.map((m) => ({ ...m }))
  )
  const [insumos, setInsumos] = useState<InsumoConfig[]>(
    insumosConfig.map((i) => ({ ...i }))
  )
  const [custoHora, setCustoHora] = useState(custoPorHora)
  const [impostoLocal, setImpostoLocal] = useState(imposto * 100)
  const [saving, setSaving] = useState(false)

  function adicionarMaterial() {
    setMateriais((prev) => [
      ...prev,
      { id: uid(), nome: '', unidade: 'm²', preco_por_m2: 0 },
    ])
  }

  function removerMaterial(id: string) {
    setMateriais((prev) => prev.filter((m) => m.id !== id))
  }

  function atualizarMaterial(id: string, campo: keyof Material, valor: string | number) {
    setMateriais((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    )
  }

  function adicionarInsumo() {
    setInsumos((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), nome: '', custo: 0 },
    ])
  }

  function removerInsumo(id: string) {
    setInsumos((prev) => prev.filter((i) => i.id !== id))
  }

  function atualizarInsumo(id: string, campo: keyof InsumoConfig, valor: string | number) {
    setInsumos((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i))
    )
  }

  async function handleSave() {
    setSaving(true)
    await onSave(
      materiais.filter((m) => m.nome.trim()),
      insumos.filter((i) => i.nome.trim()),
      custoHora,
      impostoLocal / 100
    )
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-ml-text">Configurações</h2>
          <button onClick={onClose} className="text-ml-gray-dark hover:text-ml-text transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Custo hora e imposto padrão */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ml-text mb-1">
                Custo/hora de máquina
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ml-gray-dark text-sm">R$</span>
                <input
                  type="number"
                  value={custoHora || ''}
                  onChange={(e) => setCustoHora(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ml-text mb-1">
                Imposto padrão
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={impostoLocal || ''}
                  onChange={(e) => setImpostoLocal(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.1}
                  className="w-full pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue focus:ring-1 focus:ring-ml-blue"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ml-gray-dark text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Materiais */}
          <div>
            <h3 className="font-semibold text-sm text-ml-text mb-2">Matérias-primas</h3>
            <div className="space-y-2">
              {materiais.map((m, i) => (
                <div key={m.id} className="grid grid-cols-[1fr_100px_auto] gap-2 items-end">
                  <div>
                    {i === 0 && (
                      <label className="block text-xs text-ml-gray-dark mb-1">Nome</label>
                    )}
                    <input
                      type="text"
                      value={m.nome}
                      onChange={(e) => atualizarMaterial(m.id, 'nome', e.target.value)}
                      placeholder="Ex: Acrílico 3mm"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ml-blue"
                    />
                  </div>
                  <div>
                    {i === 0 && (
                      <label className="block text-xs text-ml-gray-dark mb-1">R$/m²</label>
                    )}
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-ml-gray-dark text-xs">R$</span>
                      <input
                        type="number"
                        value={m.preco_por_m2 || ''}
                        onChange={(e) =>
                          atualizarMaterial(m.id, 'preco_por_m2', parseFloat(e.target.value) || 0)
                        }
                        min={0}
                        placeholder="0"
                        className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removerMaterial(m.id)}
                      className="p-2 text-ml-gray-dark hover:text-ml-red transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={adicionarMaterial}
              className="mt-3 flex items-center gap-1.5 text-ml-blue text-sm hover:text-ml-blue-dark transition-colors"
            >
              <Plus size={15} />
              Adicionar material
            </button>
          </div>

          {/* Insumos */}
          <div>
            <h3 className="font-semibold text-sm text-ml-text mb-2">Insumos</h3>
            <div className="space-y-2">
              {insumos.map((ins, i) => (
                <div key={ins.id} className="grid grid-cols-[1fr_100px_auto] gap-2 items-end">
                  <div>
                    {i === 0 && (
                      <label className="block text-xs text-ml-gray-dark mb-1">Nome</label>
                    )}
                    <input
                      type="text"
                      value={ins.nome}
                      onChange={(e) => atualizarInsumo(ins.id, 'nome', e.target.value)}
                      placeholder="Ex: Cola quente, Argola..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ml-blue"
                    />
                  </div>
                  <div>
                    {i === 0 && (
                      <label className="block text-xs text-ml-gray-dark mb-1">Custo (R$)</label>
                    )}
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-ml-gray-dark text-xs">R$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={ins.custo || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value.replace(',', '.')) || 0
                          atualizarInsumo(ins.id, 'custo', v)
                        }}
                        placeholder="0"
                        className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-ml-blue"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removerInsumo(ins.id)}
                      className="p-2 text-ml-gray-dark hover:text-ml-red transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={adicionarInsumo}
              className="mt-3 flex items-center gap-1.5 text-ml-blue text-sm hover:text-ml-blue-dark transition-colors"
            >
              <Plus size={15} />
              Adicionar insumo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-ml-blue text-sm font-medium hover:underline"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-ml-yellow hover:bg-ml-yellow-dark text-ml-text font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
