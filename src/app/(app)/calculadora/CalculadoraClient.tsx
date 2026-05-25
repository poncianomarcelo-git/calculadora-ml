'use client'

import { useCalculadora } from '@/hooks/useCalculadora'
import { Header } from '@/components/Header'
import { ProfileSelector } from '@/components/ProfileSelector'
import { FabricanteForm } from '@/components/FabricanteForm'
import { RevendedorForm } from '@/components/RevendedorForm'
import { ResultadoPanel } from '@/components/ResultadoPanel'
import { ConfigModal } from '@/components/ConfigModal'

interface CalculadoraClientProps {
  email: string
}

export function CalculadoraClient({ email }: CalculadoraClientProps) {
  const calc = useCalculadora()

  if (calc.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-ml-gray-dark text-sm animate-pulse">Carregando suas configurações...</div>
      </div>
    )
  }

  return (
    <>
      <Header email={email} />

      <ProfileSelector
        perfil={calc.perfil}
        onChange={calc.setPerfil}
        onOpenConfig={() => calc.setConfigModalAberto(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-5 pb-24 md:pb-5">
        <div className="md:grid md:grid-cols-[1fr_360px] md:gap-5 md:items-start">
          {/* Formulário */}
          <div>
            {calc.perfil === 'fabricante' ? (
              <FabricanteForm
                materiaisConfig={calc.materiaisConfig}
                insumosConfig={calc.insumosConfig}
                materiaisLinha={calc.materiaisLinha}
                insumosLinha={calc.insumosLinha}
                maoDeObra={calc.maoDeObra}
                embalagem={calc.embalagem}
                categoriaIndex={calc.categoriaIndex}
                tipoAnuncio={calc.tipoAnuncio}
                imposto={calc.imposto}
                lucroDesejado={calc.lucroDesejado}
                onAddMaterial={calc.adicionarMaterialLinha}
                onRemoveMaterial={calc.removerMaterialLinha}
                onUpdateMaterial={calc.atualizarMaterialLinha}
                onAddInsumo={calc.adicionarInsumoLinha}
                onRemoveInsumo={calc.removerInsumoLinha}
                onUpdateInsumo={calc.atualizarInsumoLinha}
                onMaoDeObraChange={calc.setMaoDeObra}
                onEmbalagemChange={calc.setEmbalagem}
                onOpenConfig={() => calc.setConfigModalAberto(true)}
                onCategoriaChange={calc.setCategoriaIndex}
                onTipoAnuncioChange={calc.setTipoAnuncio}
                onImpostoChange={calc.setImposto}
                onLucroChange={calc.setLucroDesejado}
              />
            ) : (
              <RevendedorForm
                custoAquisicao={calc.custoAquisicao}
                embalagem={calc.embalagemRevendedor}
                categoriaIndex={calc.categoriaIndex}
                tipoAnuncio={calc.tipoAnuncio}
                imposto={calc.imposto}
                lucroDesejado={calc.lucroDesejado}
                onCustoAquisicaoChange={calc.setCustoAquisicao}
                onEmbalagemChange={calc.setEmbalagemRevendedor}
                onCategoriaChange={calc.setCategoriaIndex}
                onTipoAnuncioChange={calc.setTipoAnuncio}
                onImpostoChange={calc.setImposto}
                onLucroChange={calc.setLucroDesejado}
              />
            )}
          </div>

          {/* Resultado (desktop: sticky) */}
          <ResultadoPanel
            resultado={calc.resultado}
            resultadoClassico={calc.resultadoClassico}
            resultadoPremium={calc.resultadoPremium}
            tipoAnuncio={calc.tipoAnuncio}
            custoTotal={calc.custoTotal}
            lucroDesejado={calc.lucroDesejado}
            mobileAberto={calc.painelMobileAberto}
            onToggleMobile={() => calc.setPainelMobileAberto((v) => !v)}
            className="sticky top-20"
          />
        </div>
      </main>

      {/* Config Modal */}
      {calc.configModalAberto && (
        <ConfigModal
          materiaisConfig={calc.materiaisConfig}
          insumosConfig={calc.insumosConfig}
          custoPorHora={calc.maoDeObra.custoPorHora}
          imposto={calc.imposto}
          onSave={calc.salvarConfig}
          onClose={() => calc.setConfigModalAberto(false)}
        />
      )}
    </>
  )
}
