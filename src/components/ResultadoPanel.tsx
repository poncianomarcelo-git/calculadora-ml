'use client'

import { Copy, Printer, ChevronUp, ChevronDown, AlertTriangle, Truck } from 'lucide-react'
import { formatBRL, formatPercent } from '@/utils/formulas'
import type { Resultado, TipoAnuncio } from '@/types'

interface ResultadoPanelProps {
  resultado: Resultado | null
  resultadoClassico: Resultado | null
  resultadoPremium: Resultado | null
  tipoAnuncio: TipoAnuncio
  custoTotal: number
  lucroDesejado: number
  mobileAberto: boolean
  onToggleMobile: () => void
  className?: string
}

function LinhaBreakdown({
  label,
  valor,
  destaque,
  cor,
}: {
  label: string
  valor: number
  destaque?: boolean
  cor?: string
}) {
  return (
    <div className={`flex justify-between items-center gap-2 py-1.5 ${destaque ? 'font-semibold' : ''}`}>
      <span className={`text-sm min-w-0 ${cor || 'text-ml-gray-dark'}`}>{label}</span>
      <span className={`text-sm font-medium shrink-0 ${cor || 'text-ml-text'}`}>{formatBRL(valor)}</span>
    </div>
  )
}

export function ResultadoPanel({
  resultado,
  resultadoClassico,
  resultadoPremium,
  tipoAnuncio,
  custoTotal,
  lucroDesejado,
  mobileAberto,
  onToggleMobile,
  className = '',
}: ResultadoPanelProps) {
  const lucroPercentReal =
    resultado && resultado.preco > 0 ? resultado.breakdown.lucroValor / resultado.preco : 0
  const margemPerigosa = lucroPercentReal > 0 && lucroPercentReal < 0.1
  const precoAbaixo79 = resultado && resultado.preco < 79
  const precoAcima79 = resultado && resultado.preco >= 79

  async function copiarResumo() {
    if (!resultado) return
    const texto = [
      'Resultado — Calculadora ML',
      `Custo total: ${formatBRL(resultado.breakdown.custoTotal)}`,
      `Custo fixo ML: ${formatBRL(resultado.breakdown.custoFixo)}`,
      `Comissão ML: ${formatBRL(resultado.breakdown.comissaoValor)}`,
      `Imposto: ${formatBRL(resultado.breakdown.impostoValor)}`,
      `Lucro estimado: ${formatBRL(resultado.breakdown.lucroValor)}`,
      `PREÇO SUGERIDO: ${formatBRL(resultado.preco)}`,
      tipoAnuncio === 'classico' ? '(Anúncio Clássico)' : '(Anúncio Premium)',
    ].join('\n')
    await navigator.clipboard.writeText(texto)
  }

  function imprimir() {
    window.print()
  }

  const conteudo = (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-ml-text">Resultado do Cálculo</h2>
        <div className="flex gap-1">
          <button
            onClick={copiarResumo}
            disabled={!resultado}
            title="Copiar resumo"
            className="p-1.5 text-ml-gray-dark hover:text-ml-blue transition-colors disabled:opacity-40"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={imprimir}
            disabled={!resultado}
            title="Imprimir"
            className="p-1.5 text-ml-gray-dark hover:text-ml-blue transition-colors disabled:opacity-40"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {!resultado || custoTotal === 0 ? (
        <div className="text-center py-8 text-ml-gray-dark text-sm">
          Preencha os custos para ver o resultado
        </div>
      ) : (
        <>
          {/* Breakdown */}
          <div className="space-y-0 divide-y divide-gray-100">
            <LinhaBreakdown label="Custo total do produto" valor={resultado.breakdown.custoTotal} />
            <LinhaBreakdown label={`Comissão ML (${formatPercent(tipoAnuncio === 'classico' ? resultado.breakdown.comissaoValor / resultado.preco : resultado.breakdown.comissaoValor / resultado.preco)})`} valor={resultado.breakdown.comissaoValor} />
            {resultado.breakdown.custoFixo > 0 && (
              <LinhaBreakdown label="Custo fixo ML" valor={resultado.breakdown.custoFixo} />
            )}
            <LinhaBreakdown label={`Imposto (${formatPercent(resultado.breakdown.impostoValor / resultado.preco)})`} valor={resultado.breakdown.impostoValor} />
          </div>

          <div className="border-t-2 border-gray-200 pt-2 mt-2">
            <LinhaBreakdown
              label={`Lucro estimado (${(lucroDesejado * 100).toFixed(0)}%)`}
              valor={resultado.breakdown.lucroValor}
              cor="text-ml-green"
            />
          </div>

          {/* Preço sugerido */}
          <div className="bg-ml-yellow rounded-xl p-4 mt-4 text-center">
            <p className="text-xs font-medium text-ml-gray-dark uppercase tracking-wider mb-1">
              Preço sugerido
            </p>
            <p className="text-3xl font-bold text-ml-text">{formatBRL(resultado.preco)}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
              tipoAnuncio === 'classico'
                ? 'bg-white/60 text-ml-text'
                : 'bg-ml-blue text-white'
            }`}>
              {tipoAnuncio === 'classico' ? 'Anúncio Clássico' : 'Anúncio Premium'}
            </span>
          </div>

          {/* Comparação Clássico x Premium */}
          {resultadoClassico && resultadoPremium && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className={`rounded-lg p-3 text-center border ${tipoAnuncio === 'classico' ? 'border-ml-blue bg-blue-50' : 'border-gray-200'}`}>
                <p className="text-xs text-ml-gray-dark">Clássico</p>
                <p className="font-semibold text-ml-text text-sm">{formatBRL(resultadoClassico.preco)}</p>
              </div>
              <div className={`rounded-lg p-3 text-center border ${tipoAnuncio === 'premium' ? 'border-ml-blue bg-blue-50' : 'border-gray-200'}`}>
                <p className="text-xs text-ml-gray-dark">Premium</p>
                <p className="font-semibold text-ml-text text-sm">{formatBRL(resultadoPremium.preco)}</p>
              </div>
            </div>
          )}

          {/* Alertas */}
          {precoAbaixo79 && (
            <div className="flex items-start gap-2 mt-3 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2.5 text-xs text-yellow-800">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>Produto abaixo de R$79,00 — taxa fixa de R$6,00 incide nesta faixa de preço.</span>
            </div>
          )}

          {margemPerigosa && (
            <div className="flex items-start gap-2 mt-3 bg-red-50 border border-ml-red rounded-lg px-3 py-2.5 text-xs text-ml-red">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>Margem de lucro real abaixo de 10%! Verifique seus custos ou aumente o lucro desejado.</span>
            </div>
          )}

          {precoAcima79 && (
            <div className="flex items-start gap-2 mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-xs text-blue-800">
              <Truck size={14} className="mt-0.5 shrink-0" />
              <span>
                <strong>Frete grátis obrigatório</strong> para produtos acima de R$79,00. O custo do frete que você paga ao ML varia conforme peso do produto, região de entrega e sua reputação como vendedor — consulte sua tabela de frete no Mercado Livre e some esse valor ao seu custo antes de precificar.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop: card normal/sticky */}
      <div className={`hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        {conteudo}
      </div>

      {/* Mobile: rodapé fixo */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 shadow-lg">
        <button
          onClick={onToggleMobile}
          className="w-full flex items-center justify-between px-4 py-3 bg-ml-blue text-white"
        >
          {resultado && custoTotal > 0 ? (
            <div className="text-left">
              <p className="text-xs text-white/70 font-normal leading-none mb-0.5">Preço sugerido</p>
              <p className="text-xl font-bold leading-tight">{formatBRL(resultado.preco)}</p>
            </div>
          ) : (
            <span className="font-semibold">Ver resultado</span>
          )}
          {mobileAberto
            ? <ChevronDown size={20} className="shrink-0" />
            : <ChevronUp size={20} className="shrink-0" />}
        </button>
        {mobileAberto && (
          <div className="bg-white border-t border-gray-100 max-h-[50vh] overflow-y-auto overflow-x-hidden w-full">
            {conteudo}
          </div>
        )}
      </div>
    </>
  )
}
