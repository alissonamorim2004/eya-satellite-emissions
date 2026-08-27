import { useState, useEffect } from 'react';
import { ArrowRight, Globe, BarChart3, FileText, Satellite, Leaf, Users } from 'lucide-react';
import SimpleGlobe from './SimpleGlobe';

interface LandingPageProps {
  onEnter: () => void;
  onEducational: () => void;
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

export default function LandingPage({ onEnter, onEducational }: LandingPageProps) {
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), 300); return () => clearTimeout(t); }, []);

  const pts   = useCountUp(2160, 1600, started);
  const cities = useCountUp(15,   1200, started);

  return (
    <div className="min-h-screen hero-bg text-[var(--text-1)]">

      {/* ── Nav ── */}
      <nav className="glass sticky top-0 z-50 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--teal), #0088cc)' }}
            >
              <Satellite className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wide text-[var(--text-1)]">EYA</span>
              <span className="text-[var(--text-3)] text-xs font-ui ml-2">Earth + IA</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-ui">
            {[['Missão', '#missao'], ['Tecnologia', '#tecnologia'], ['Dados', '#dados']].map(([label, href]) => (
              <a key={label} href={href}
                className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200">
                {label}
              </a>
            ))}
            <button onClick={onEducational}
              className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200">
              Guia
            </button>
            <button onClick={onEnter}
              className="px-5 py-2.5 rounded-lg font-medium text-[var(--void)] glow-teal transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: 'var(--teal)' }}>
              Acessar plataforma
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-8 lg:pt-20 lg:pb-12" style={{ overflow: 'visible' }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]" style={{ overflow: 'visible' }}>

          {/* Left */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-[var(--border)] glass opacity-0-init animate-fade-in"
              style={{ fontSize: 12 }}>
              <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-glow-pulse" style={{ color: 'var(--teal)' }} />
              <span className="font-ui text-[var(--teal)] font-medium">Dados ao vivo · Sentinel-5P/TROPOMI</span>
            </div>

            <h1 className="font-display font-extrabold leading-[1.05] mb-6 opacity-0-init animate-fade-up"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}>
              Monitoramento<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--teal) 0%, #4fc3f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                ambiental
              </span>
              <br />via satélite
            </h1>

            <p className="font-ui text-lg text-[var(--text-2)] leading-relaxed mb-10 max-w-lg opacity-0-init animate-fade-up delay-100"
              style={{ fontWeight: 400 }}>
              Análise geoespacial de emissões de CH₄ e NO₂ para gestão inteligente
              de resíduos urbanos. Dados do Copernicus/ESA em tempo real.
            </p>

            <div className="flex flex-wrap gap-4 mb-12 opacity-0-init animate-fade-up delay-200">
              <button onClick={onEnter}
                className="group flex items-center gap-3 px-7 py-3.5 rounded-xl font-ui font-semibold text-[var(--void)] glow-teal transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--teal)', fontSize: 15 }}>
                Abrir dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={onEducational}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-ui font-medium text-[var(--text-1)] border border-[var(--border-hi)] hover:border-[var(--teal)] hover:bg-[rgba(0,200,160,0.06)] transition-all duration-200"
                style={{ fontSize: 15 }}>
                <Leaf className="w-4 h-4 text-[var(--teal)]" />
                Guia educativo
              </button>
            </div>

            {/* Animated stats */}
            <div className="grid grid-cols-3 gap-4 opacity-0-init animate-fade-up delay-300">
              {[
                { val: pts.toLocaleString('pt-BR') + '+', label: 'Pontos monitorados', color: 'var(--teal)' },
                { val: String(cities),                   label: 'Cidades brasileiras', color: 'var(--teal)' },
                { val: '7 km',                           label: 'Resolução espacial',  color: 'var(--teal)' },
              ].map(({ val, label, color }) => (
                <div key={label} className="glass-card p-4">
                  <div className="font-display font-bold text-2xl mb-1" style={{ color }}>{val}</div>
                  <div className="font-ui text-xs text-[var(--text-3)] leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – globe (no clipping, let atmosphere bleed freely) */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center opacity-0-init animate-fade-in delay-200"
            style={{ overflow: 'visible' }}>
            <div style={{ overflow: 'visible', position: 'relative' }}>
              <SimpleGlobe size={520} />
            </div>

            {/* Live badge */}
            <div className="mt-2 flex items-center gap-6 glass px-6 py-3 rounded-xl border border-[var(--border)]">
              {[
                { k: 'Satélite', v: 'S5P-OFFL' },
                { k: 'Resolução', v: '7 × 7 km' },
                { k: 'Latência', v: '≤ 5 dias' },
              ].map(({ k, v }) => (
                <div key={k} className="text-center">
                  <div className="font-data text-[10px] text-[var(--text-3)] uppercase tracking-wider">{k}</div>
                  <div className="font-data text-xs text-[var(--teal)] mt-0.5 font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hr-glow my-4" />

      {/* ── Mission section ── */}
      <section id="missao" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14 max-w-xl">
          <div className="inline-flex items-center gap-2 mb-3 text-[var(--teal)] font-ui text-sm font-medium">
            <Globe className="w-4 h-4" />
            Missão
          </div>
          <h2 className="font-display font-bold text-4xl text-[var(--text-1)]" style={{ lineHeight: 1.2 }}>
            De dados de satélite<br />a ação pública
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Satellite className="w-5 h-5" />,
              title: 'Detecção precisa',
              color: 'var(--teal)',
              body: 'Sentinel-5P TROPOMI identifica CH₄ e NO₂ com resolução de 7 × 7 km e cobertura global diária, processado via Google Earth Engine.',
              tags: ['CH₄', 'NO₂', 'TROPOMI'],
            },
            {
              icon: <BarChart3 className="w-5 h-5" />,
              title: 'Análise integrada',
              color: '#4fc3f7',
              body: 'Correlação de emissões com densidade populacional, NDVI e categorias de resíduo para avaliar impacto e priorizar intervenções.',
              tags: ['NDVI', 'GEE', 'Risco'],
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: 'Decisão baseada em dados',
              color: 'var(--acid)',
              body: 'Dashboard interativo com exportação de relatórios técnicos em PDF. Insights acionáveis para gestores ambientais.',
              tags: ['Dashboard', 'PDF', 'Insights'],
            },
          ].map(({ icon, title, color, body, tags }, i) => (
            <div
              key={title}
              className="glass-card p-7"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}18`, color }}
              >
                {icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-1)] mb-3">{title}</h3>
              <p className="font-ui text-sm text-[var(--text-2)] leading-relaxed mb-5">{body}</p>
              <div className="flex gap-2 flex-wrap">
                {tags.map(tag => (
                  <span key={tag}
                    className="font-data text-[11px] px-2.5 py-1 rounded-md"
                    style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hr-glow" />

      {/* ── Technology section ── */}
      <section id="tecnologia" className="max-w-7xl mx-auto px-6 py-24">
        <div className="inline-flex items-center gap-2 mb-3 text-[var(--teal)] font-ui text-sm font-medium">
          <Satellite className="w-4 h-4" />
          Tecnologia
        </div>
        <h2 className="font-display font-bold text-4xl text-[var(--text-1)] mb-14" style={{ lineHeight: 1.2 }}>
          Fontes científicas de dados
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: 'Sentinel-5P TROPOMI',
              agency: 'European Space Agency — ESA',
              desc: 'Espectrômetro de imageamento para concentrações atmosféricas de CH₄ e NO₂. Resolução 7 × 7 km, cobertura diária global.',
              tags: [['CH₄', 'var(--teal)'], ['NO₂', 'var(--teal)'], ['7 × 7 km', 'var(--text-2)'], ['Diário', 'var(--text-2)']],
              accent: 'var(--teal)',
            },
            {
              name: 'MODIS Terra / Aqua',
              agency: 'NASA Earth Observing System',
              desc: 'Espectrômetro multiespectral para análise de NDVI e identificação de áreas degradadas e cobertura vegetal.',
              tags: [['NDVI', 'var(--acid)'], ['LST', 'var(--acid)'], ['250 m – 1 km', 'var(--text-2)'], ['Diário', 'var(--text-2)']],
              accent: 'var(--acid)',
            },
          ].map(({ name, agency, desc, tags, accent }) => (
            <div key={name} className="glass-card p-8">
              <div className="flex items-start gap-3 mb-5">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                <div>
                  <h4 className="font-display text-xl font-bold text-[var(--text-1)]">{name}</h4>
                  <p className="font-ui text-xs text-[var(--text-3)] mt-0.5">{agency}</p>
                </div>
              </div>
              <p className="font-ui text-sm text-[var(--text-2)] leading-relaxed mb-6">{desc}</p>
              <div className="flex gap-2 flex-wrap">
                {tags.map(([label, color]) => (
                  <span key={label}
                    className="font-data text-[11px] px-2.5 py-1 rounded-md border"
                    style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="hr-glow" />

      {/* ── CTA ── */}
      <section id="dados" className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="inline-flex items-center gap-2 mb-5 text-[var(--teal)] font-ui text-sm font-medium">
          <Users className="w-4 h-4" />
          Começar agora
        </div>
        <h2 className="font-display font-bold mb-5 text-[var(--text-1)]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
          Dados de satélite.<br />Decisões mais inteligentes.
        </h2>
        <p className="font-ui text-lg text-[var(--text-2)] mb-12 max-w-xl mx-auto leading-relaxed">
          Explore emissões atmosféricas em tempo real, gere relatórios técnicos
          e identifique áreas críticas em 15 cidades brasileiras.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={onEnter}
            className="group flex items-center gap-3 px-9 py-4 rounded-xl font-display font-bold text-[var(--void)] glow-teal transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] text-base"
            style={{ background: 'var(--teal)' }}>
            Abrir dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button onClick={onEducational}
            className="flex items-center gap-2.5 px-7 py-4 rounded-xl font-ui font-medium text-[var(--text-1)] border border-[var(--border-hi)] hover:border-[var(--teal)] hover:bg-[rgba(0,200,160,0.05)] transition-all duration-200 text-base">
            <Leaf className="w-5 h-5 text-[var(--teal)]" />
            Guia educativo
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="glass border-t border-[var(--border)] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--teal), #0088cc)' }}
            >
              <Satellite style={{ width: 14, height: 14, color: 'white' }} />
            </div>
            <span className="font-display font-bold text-sm text-[var(--text-1)]">EYA</span>
            <span className="text-[var(--border-hi)]">·</span>
            <span className="font-ui text-xs text-[var(--text-3)]">
              Plataforma de monitoramento ambiental via satélite
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-glow-pulse"
              style={{ color: 'var(--teal)' }} />
            <span className="font-data text-[10px] text-[var(--text-3)] tracking-wider uppercase">
              NASA · ESA · Copernicus · INPE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
