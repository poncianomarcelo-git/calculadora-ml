export type Perfil = 'fabricante' | 'revendedor'
export type TipoAnuncio = 'classico' | 'premium'

export interface Categoria {
  nome: string
  classico: number
  premium: number
}

export interface Material {
  id: string
  user_id?: string
  nome: string
  unidade: string
  preco_por_m2: number
  ordem?: number
}

export type UnidadeMaterial = 'm2' | 'un' | 'kg' | 'g' | 'L' | 'ml' | 'm'

export interface MaterialLinha {
  id: string
  materialId: string
  unidade: UnidadeMaterial
  largura: number
  altura: number
  quantidade: number
}

export interface InsumoConfig {
  id: string
  user_id?: string
  nome: string
  custo: number
  ordem?: number
}

export interface InsumoLinha {
  id: string
  insumoConfigId: string
  nome: string
  custo: number
}

export interface MaoDeObra {
  minutos: number
  custoPorHora: number
}

export interface BreakdownResultado {
  custoTotal: number
  custoFixo: number
  comissaoValor: number
  impostoValor: number
  lucroValor: number
}

export interface Resultado {
  preco: number
  breakdown: BreakdownResultado
}
