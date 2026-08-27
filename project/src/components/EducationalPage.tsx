import { ArrowLeft, Flame, AlertTriangle, Heart, Leaf, Building2, Wind, Droplets, Satellite } from 'lucide-react';
import SimpleStarfield from './SimpleStarfield';

interface EducationalPageProps {
  onBack: () => void;
}

export default function EducationalPage({ onBack }: EducationalPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/10 to-transparent"></div>

      <SimpleStarfield />

      <nav className="relative z-10 border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">EYA</h1>
                <p className="text-xs text-slate-400">Earth + IA Platform</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Guia Educativo sobre{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Metano e Resíduos Urbanos
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Entenda os impactos ambientais, riscos à saúde e como prevenir a emissão de metano em áreas urbanas
              </p>
            </div>

            <div className="space-y-12">
              <section className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 animate-float" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                    <Flame className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-3xl font-bold">O que é Metano (CH₄)?</h3>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p className="text-lg leading-relaxed">
                    O metano (CH₄) é um gás incolor e inodoro que se forma naturalmente pela decomposição de matéria orgânica em ambientes com pouco ou nenhum oxigênio. É o principal componente do gás natural e um dos gases de efeito estufa mais potentes.
                  </p>
                  <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-6">
                    <p className="font-semibold text-orange-300 mb-2 text-lg">Potencial de Aquecimento Global</p>
                    <p className="text-lg">O metano é <strong className="text-orange-400">25 vezes mais potente</strong> que o dióxido de carbono (CO₂) em um período de 100 anos, tornando sua redução crucial para o combate às mudanças climáticas.</p>
                  </div>
                  <p className="text-lg">Em áreas urbanas, o metano é produzido principalmente por:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-lg">
                    <li>Aterros sanitários e lixões</li>
                    <li>Decomposição de resíduos orgânicos não tratados</li>
                    <li>Vazamentos em redes de esgoto</li>
                    <li>Deposição irregular de lixo</li>
                  </ul>
                </div>
              </section>

              <section className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 animate-float" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold">Impactos Ambientais</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-red-900/30 hover:border-red-500/50 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Wind className="w-6 h-6 text-red-400" />
                      <h4 className="font-semibold text-red-300 text-lg">Atmosfera</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Aquecimento global acelerado</li>
                      <li>• Contribuição para mudanças climáticas</li>
                      <li>• Degradação da qualidade do ar</li>
                      <li>• Formação de ozônio troposférico</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets className="w-6 h-6 text-blue-400" />
                      <h4 className="font-semibold text-blue-300 text-lg">Solo e Água</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Contaminação de lençóis freáticos</li>
                      <li>• Degradação da qualidade do solo</li>
                      <li>• Morte de vegetação local</li>
                      <li>• Poluição de córregos e rios</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-green-900/30 hover:border-green-500/50 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-6 h-6 text-green-400" />
                      <h4 className="font-semibold text-green-300 text-lg">Ecossistemas</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Perda de biodiversidade</li>
                      <li>• Destruição de habitat natural</li>
                      <li>• Desequilíbrio ecológico</li>
                      <li>• Redução de áreas verdes</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-900/30 hover:border-purple-500/50 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-6 h-6 text-purple-400" />
                      <h4 className="font-semibold text-purple-300 text-lg">Áreas Urbanas</h4>
                    </div>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Mau cheiro persistente</li>
                      <li>• Proliferação de vetores</li>
                      <li>• Desvalorização imobiliária</li>
                      <li>• Degradação da infraestrutura</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 animate-float" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                    <Heart className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-bold">Riscos à Saúde Pública</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                    <h4 className="font-semibold text-red-300 mb-3 text-xl">Exposição Aguda</h4>
                    <p className="text-slate-300 mb-3 text-lg">Em concentrações elevadas, o metano pode causar:</p>
                    <ul className="text-slate-300 space-y-2">
                      <li>• <strong>Asfixia:</strong> Deslocamento de oxigênio em ambientes fechados</li>
                      <li>• <strong>Tonturas e náuseas:</strong> Exposição em áreas mal ventiladas</li>
                      <li>• <strong>Dores de cabeça:</strong> Inalação prolongada</li>
                      <li>• <strong>Perda de consciência:</strong> Em níveis críticos de concentração</li>
                    </ul>
                  </div>

                  <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-300 mb-3 text-xl">Exposição Crônica</h4>
                    <p className="text-slate-300 mb-3 text-lg">Populações próximas a áreas de emissão podem desenvolver:</p>
                    <ul className="text-slate-300 space-y-2">
                      <li>• <strong>Problemas respiratórios:</strong> Asma, bronquite e irritação das vias aéreas</li>
                      <li>• <strong>Doenças infecciosas:</strong> Transmitidas por vetores</li>
                      <li>• <strong>Estresse e ansiedade:</strong> Devido ao mau cheiro e condições insalubres</li>
                      <li>• <strong>Alergias:</strong> Causadas por poeira e partículas suspensas</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-300 mb-3 text-xl">Grupos Vulneráveis</h4>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-slate-900/50 p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
                        <p className="text-4xl mb-2">👶</p>
                        <p className="font-medium">Crianças</p>
                      </div>
                      <div className="bg-slate-900/50 p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
                        <p className="text-4xl mb-2">👴</p>
                        <p className="font-medium">Idosos</p>
                      </div>
                      <div className="bg-slate-900/50 p-5 rounded-lg text-center hover:-translate-y-1 transition-transform">
                        <p className="text-4xl mb-2">🤒</p>
                        <p className="font-medium">Imunodeprimidos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="group bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/20 animate-float" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                    <Leaf className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold">Prevenção e Soluções</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-green-300 mb-4 text-2xl">Gestão Municipal de Resíduos</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-5 hover:-translate-y-1 transition-all">
                        <p className="font-medium mb-2 text-lg">✓ Coleta Seletiva Eficiente</p>
                        <p className="text-slate-400">Separação de orgânicos e recicláveis na fonte</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-5 hover:-translate-y-1 transition-all">
                        <p className="font-medium mb-2 text-lg">✓ Compostagem de Orgânicos</p>
                        <p className="text-slate-400">Tratamento aeróbico reduz emissões em 95%</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-5 hover:-translate-y-1 transition-all">
                        <p className="font-medium mb-2 text-lg">✓ Aterros Sanitários Modernos</p>
                        <p className="text-slate-400">Sistemas de captura e queima de metano</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-5 hover:-translate-y-1 transition-all">
                        <p className="font-medium mb-2 text-lg">✓ Fiscalização Rigorosa</p>
                        <p className="text-slate-400">Combate a deposições irregulares</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-cyan-300 mb-4 text-2xl">Tecnologias de Monitoramento</h4>
                    <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-6">
                      <ul className="space-y-4 text-slate-300">
                        <li className="flex items-start gap-3">
                          <span className="text-cyan-400 text-2xl mt-1">🛰️</span>
                          <div>
                            <p className="font-medium text-lg">Satélites de Observação</p>
                            <p className="text-slate-400">TROPOMI (Sentinel-5P) detecta emissões de CH₄ com resolução de 7x7 km</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-cyan-400 text-2xl mt-1">📡</span>
                          <div>
                            <p className="font-medium text-lg">Sensores IoT</p>
                            <p className="text-slate-400">Dispositivos urbanos para medição contínua de gases</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-cyan-400 text-2xl mt-1">🤖</span>
                          <div>
                            <p className="font-medium text-lg">Inteligência Artificial</p>
                            <p className="text-slate-400">Análise preditiva para identificar áreas de risco</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-300 mb-4 text-2xl">Benefícios da Captura de Metano</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6 text-center hover:-translate-y-2 transition-all">
                        <p className="text-5xl mb-3">⚡</p>
                        <p className="font-medium text-lg mb-1">Energia Renovável</p>
                        <p className="text-sm text-slate-400">Geração de eletricidade</p>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6 text-center hover:-translate-y-2 transition-all">
                        <p className="text-5xl mb-3">💰</p>
                        <p className="font-medium text-lg mb-1">Créditos de Carbono</p>
                        <p className="text-sm text-slate-400">Receita adicional</p>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6 text-center hover:-translate-y-2 transition-all">
                        <p className="text-5xl mb-3">🌍</p>
                        <p className="font-medium text-lg mb-1">Impacto Climático</p>
                        <p className="text-sm text-slate-400">Redução de emissões</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-xl border border-cyan-700/50">
                <h3 className="text-3xl font-bold mb-4">Como Esta Plataforma Ajuda</h3>
                <p className="text-slate-300 mb-6 text-lg">
                  O sistema EYA utiliza dados de satélite da NASA para fornecer aos gestores públicos informações em tempo real sobre emissões de metano em áreas urbanas, permitindo:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl">✓</span>
                    <div>
                      <p className="font-medium text-lg">Identificação Precisa</p>
                      <p className="text-slate-400">Localização exata de áreas críticas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl">✓</span>
                    <div>
                      <p className="font-medium text-lg">Priorização de Recursos</p>
                      <p className="text-slate-400">Intervenções baseadas em dados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl">✓</span>
                    <div>
                      <p className="font-medium text-lg">Monitoramento Contínuo</p>
                      <p className="text-slate-400">Acompanhamento de melhorias</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cyan-400 text-2xl">✓</span>
                    <div>
                      <p className="font-medium text-lg">Relatórios Técnicos</p>
                      <p className="text-slate-400">Documentação para decisões</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-16 text-center">
              <button
                onClick={onBack}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
              >
                Voltar ao Painel
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
