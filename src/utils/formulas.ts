import type { Resultado } from '@/types'

export function calcularCustoFixo(preco: number): number {
  if (preco < 12.5) return preco * 0.5
  if (preco < 79.0) return 6.0
  return 0
}

export function calcularPrecoVenda({
  custoTotal,
  comissaoML,
  imposto,
  lucroDesejado,
}: {
  custoTotal: number
  comissaoML: number
  imposto: number
  lucroDesejado: number
}): Resultado | null {
  const divisor = 1 - comissaoML - imposto - lucroDesejado
  if (divisor <= 0 || custoTotal <= 0) return null

  let preco = custoTotal / divisor
  for (let i = 0; i < 3; i++) {
    preco = (custoTotal + calcularCustoFixo(preco)) / divisor
  }

  const custoFixo = calcularCustoFixo(preco)
  const comissaoValor = preco * comissaoML
  const impostoValor = preco * imposto
  const lucroValor = preco * lucroDesejado

  return {
    preco,
    breakdown: {
      custoTotal,
      custoFixo,
      comissaoValor,
      impostoValor,
      lucroValor,
    },
  }
}

export function calcularM2(larguraCm: number, alturaCm: number): number {
  return (larguraCm / 100) * (alturaCm / 100)
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%'
}
