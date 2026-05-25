'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calcularPrecoVenda, calcularM2 } from '@/utils/formulas'
import { categorias } from '@/data/categorias'
import { materiaisDefault } from '@/data/materiaisDefault'
import { insumosDefault } from '@/data/insumosDefault'
import type {
  Perfil,
  TipoAnuncio,
  Material,
  MaterialLinha,
  InsumoLinha,
  InsumoConfig,
  MaoDeObra,
} from '@/types'

function uid() {
  return Math.random().toString(36).slice(2)
}

export function useCalculadora() {
  const supabase = createClient()

  // Perfil
  const [perfil, setPerfil] = useState<Perfil>('revendedor')

  // Fabricante - matérias-primas
  const [materiaisLinha, setMateriaisLinha] = useState<MaterialLinha[]>([
    { id: uid(), materialId: '', unidade: 'm2', largura: 0, altura: 0, quantidade: 0 },
  ])

  // Fabricante - insumos
  const [insumosLinha, setInsumosLinha] = useState<InsumoLinha[]>([
    { id: uid(), insumoConfigId: '', nome: '', custo: 0 },
  ])

  // Configuração de insumos (do Supabase)
  const [insumosConfig, setInsumosConfig] = useState<InsumoConfig[]>(insumosDefault)

  // Fabricante - mão de obra
  const [maoDeObra, setMaoDeObra] = useState<MaoDeObra>({ minutos: 0, custoPorHora: 50 })

  // Fabricante - outros custos
  const [embalagem, setEmbalagem] = useState(0)

  // Revendedor
  const [custoAquisicao, setCustoAquisicao] = useState(0)
  const [embalagemRevendedor, setEmbalagemRevendedor] = useState(0)

  // Venda
  const [categoriaIndex, setCategoriaIndex] = useState(0)
  const [tipoAnuncio, setTipoAnuncio] = useState<TipoAnuncio>('classico')
  const [imposto, setImposto] = useState(0.04)
  const [lucroDesejado, setLucroDesejado] = useState(0.3)

  // Configuração (do Supabase)
  const [materiaisConfig, setMateriaisConfig] = useState<Material[]>(materiaisDefault)

  // UI
  const [configModalAberto, setConfigModalAberto] = useState(false)
  const [painelMobileAberto, setPainelMobileAberto] = useState(true)
  const [loading, setLoading] = useState(true)

  // Carrega dados do usuário no Supabase
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const [{ data: materiais }, { data: settings }, { data: insumos }] = await Promise.all([
        supabase.from('materiais').select('*').order('ordem'),
        supabase.from('user_settings').select('*').single(),
        supabase.from('user_insumos_config').select('*').order('ordem'),
      ])

      if (materiais && materiais.length > 0) {
        setMateriaisConfig(materiais as Material[])
      }
      if (settings) {
        setMaoDeObra((prev) => ({ ...prev, custoPorHora: settings.custo_por_hora }))
        setImposto(settings.imposto_padrao)
      }
      if (insumos && insumos.length > 0) {
        setInsumosConfig(insumos as InsumoConfig[])
      }
      setLoading(false)
    }

    loadUserData()
  }, [])

  // Custo total fabricante
  const custoTotalFabricante = useMemo(() => {
    const custoMateriais = materiaisLinha.reduce((acc, linha) => {
      const mat = materiaisConfig.find((m) => m.id === linha.materialId)
      if (!mat || !mat.preco_por_m2) return acc
      if (linha.unidade === 'm2') {
        if (!linha.largura || !linha.altura) return acc
        return acc + calcularM2(linha.largura, linha.altura) * mat.preco_por_m2
      }
      if (!linha.quantidade) return acc
      return acc + linha.quantidade * mat.preco_por_m2
    }, 0)

    const custoInsumos = insumosLinha.reduce((acc, i) => acc + (i.custo || 0), 0)
    const custoMao = (maoDeObra.minutos / 60) * maoDeObra.custoPorHora

    return custoMateriais + custoInsumos + custoMao + embalagem
  }, [materiaisLinha, insumosLinha, maoDeObra, embalagem, materiaisConfig])

  const custoTotalRevendedor = useMemo(
    () => custoAquisicao + embalagemRevendedor,
    [custoAquisicao, embalagemRevendedor]
  )

  const custoTotal = perfil === 'fabricante' ? custoTotalFabricante : custoTotalRevendedor
  const categoria = categorias[categoriaIndex]

  const resultadoClassico = useMemo(
    () =>
      calcularPrecoVenda({
        custoTotal,
        comissaoML: categoria.classico,
        imposto,
        lucroDesejado,
      }),
    [custoTotal, categoria, imposto, lucroDesejado]
  )

  const resultadoPremium = useMemo(
    () =>
      calcularPrecoVenda({
        custoTotal,
        comissaoML: categoria.premium,
        imposto,
        lucroDesejado,
      }),
    [custoTotal, categoria, imposto, lucroDesejado]
  )

  const resultado = tipoAnuncio === 'classico' ? resultadoClassico : resultadoPremium

  // Salvar configuração no Supabase
  const salvarConfig = useCallback(
    async (
      novosMateriais: Material[],
      novosInsumos: InsumoConfig[],
      novosCustoHora: number,
      novoImposto: number
    ) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('user_settings').upsert({
        user_id: user.id,
        custo_por_hora: novosCustoHora,
        imposto_padrao: novoImposto,
        updated_at: new Date().toISOString(),
      })

      await supabase.from('materiais').delete().eq('user_id', user.id)
      if (novosMateriais.length > 0) {
        await supabase.from('materiais').insert(
          novosMateriais.map((m, i) => ({
            user_id: user.id,
            nome: m.nome,
            unidade: m.unidade,
            preco_por_m2: m.preco_por_m2,
            ordem: i,
          }))
        )
      }

      await supabase.from('user_insumos_config').delete().eq('user_id', user.id)
      if (novosInsumos.length > 0) {
        await supabase.from('user_insumos_config').insert(
          novosInsumos.map((ins, i) => ({
            user_id: user.id,
            nome: ins.nome,
            custo: ins.custo,
            ordem: i,
          }))
        )
      }

      setMateriaisConfig(novosMateriais)
      setInsumosConfig(novosInsumos)
      setMaoDeObra((prev) => ({ ...prev, custoPorHora: novosCustoHora }))
      setImposto(novoImposto)
    },
    [supabase]
  )

  // Helpers para linhas de matérias-primas
  const adicionarMaterialLinha = useCallback(() => {
    setMateriaisLinha((prev) => [
      ...prev,
      { id: uid(), materialId: '', unidade: 'm2', largura: 0, altura: 0, quantidade: 0 },
    ])
  }, [])

  const removerMaterialLinha = useCallback((id: string) => {
    setMateriaisLinha((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const atualizarMaterialLinha = useCallback(
    (id: string, campo: keyof Omit<MaterialLinha, 'id'>, valor: string | number) => {
      setMateriaisLinha((prev) =>
        prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l))
      )
    },
    []
  )

  // Helpers para insumos
  const adicionarInsumoLinha = useCallback(() => {
    setInsumosLinha((prev) => [...prev, { id: uid(), insumoConfigId: '', nome: '', custo: 0 }])
  }, [])

  const removerInsumoLinha = useCallback((id: string) => {
    setInsumosLinha((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const atualizarInsumoLinha = useCallback(
    (id: string, campo: keyof Omit<InsumoLinha, 'id'>, valor: string | number) => {
      setInsumosLinha((prev) =>
        prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l))
      )
    },
    []
  )

  return {
    // Estado
    perfil, setPerfil,
    materiaisLinha, atualizarMaterialLinha, adicionarMaterialLinha, removerMaterialLinha,
    insumosLinha, atualizarInsumoLinha, adicionarInsumoLinha, removerInsumoLinha,
    maoDeObra, setMaoDeObra,
    embalagem, setEmbalagem,
    custoAquisicao, setCustoAquisicao,
    embalagemRevendedor, setEmbalagemRevendedor,
    categoriaIndex, setCategoriaIndex,
    tipoAnuncio, setTipoAnuncio,
    imposto, setImposto,
    lucroDesejado, setLucroDesejado,
    materiaisConfig,
    insumosConfig,
    configModalAberto, setConfigModalAberto,
    painelMobileAberto, setPainelMobileAberto,
    loading,
    // Calculado
    custoTotal,
    resultado,
    resultadoClassico,
    resultadoPremium,
    categoria,
    // Ações
    salvarConfig,
  }
}
