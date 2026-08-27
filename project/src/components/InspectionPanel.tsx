import { X, Download, MapPin, Clock, Satellite } from 'lucide-react';
import jsPDF from 'jspdf';

interface InspectionPanelProps {
  feature: { type: string; properties: any; coordinates: [number, number] };
  onClose: () => void;
}

function Row({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="font-data text-[9px] text-[var(--text-3)] tracking-widest uppercase flex-shrink-0 pt-0.5 w-28">{label}</span>
      <span className="font-data text-xs text-right" style={{ color: color || 'var(--text-1)' }}>
        {value}{unit && <span className="text-[var(--text-3)] ml-1 text-[9px]">{unit}</span>}
      </span>
    </div>
  );
}

function severityStyle(s: string): { color: string; label: string } {
  switch (s) {
    case 'low':      return { color: 'var(--teal)',    label: 'BAIXO' };
    case 'medium':   return { color: 'var(--amber)',   label: 'MÉDIO' };
    case 'high':     return { color: 'var(--acid)',    label: 'ALTO' };
    case 'critical': return { color: 'var(--crimson)', label: 'CRÍTICO' };
    default:         return { color: 'var(--text-2)',  label: s.toUpperCase() };
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function InspectionPanel({ feature, onClose }: InspectionPanelProps) {
  const { type, properties, coordinates } = feature;
  const isAir  = type === 'air-pollution';
  const isSoil = type === 'soil-pollution';
  const sev    = severityStyle(properties.severity || '');

  async function handleExportPDF() {
    const pdf = new jsPDF();
    const m = 20; let y = m;
    pdf.setFontSize(18); pdf.setFont('helvetica', 'bold');
    pdf.text('EYA — Relatório de Inspeção', m, y); y += 12;
    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(120);
    pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, m, y); y += 10;
    pdf.setTextColor(0); pdf.setFontSize(12); pdf.setFont('helvetica', 'bold');
    pdf.text(isAir ? 'Emissão Atmosférica (CH₄/NO₂)' : 'Risco de Solo / Metano', m, y); y += 9;
    pdf.setFontSize(10); pdf.setFont('helvetica', 'normal');
    if (isAir) {
      pdf.text(`Valor: ${properties.value?.toFixed(2)} ppb`, m, y); y += 7;
    } else {
      pdf.text(`Score de risco: ${(properties.risk_score ?? properties.score)?.toFixed(2)}`, m, y); y += 7;
      pdf.text(`CH₄: ${properties.ch4_value?.toFixed(2) ?? 'N/A'} ppb`, m, y); y += 7;
      pdf.text(`NDVI: ${properties.ndvi_value?.toFixed(3) ?? 'N/A'}`, m, y); y += 7;
      pdf.text(`Pop. Density: ${properties.population_density ?? 'N/A'} hab/km²`, m, y); y += 7;
    }
    pdf.text(`Gravidade: ${properties.severity}`, m, y); y += 7;
    pdf.text(`Fonte: ${properties.source}`, m, y); y += 7;
    pdf.text(`Data: ${formatDate(properties.recorded_at)}`, m, y); y += 7;
    pdf.text(`Coords: ${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`, m, y);
    pdf.save(`eya-inspecao-${Date.now()}.pdf`);
  }

  return (
    <div
      className="absolute top-4 right-4 w-80 z-10 animate-slide-right"
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="glass rounded-2xl border border-[var(--border)] flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 2rem)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Satellite className="w-3.5 h-3.5 text-[var(--teal)]" />
            <span className="font-data text-[9px] text-[var(--teal)] tracking-widest uppercase">
              {isAir ? '// emissão atmosférica' : '// risco de solo'}
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Severity hero */}
        <div className="px-4 py-4 border-b border-[var(--border)]" style={{ background: `rgba(${sev.color === 'var(--teal)' ? '0,232,208' : sev.color === 'var(--amber)' ? '255,178,36' : sev.color === 'var(--acid)' ? '184,255,87' : '255,61,90'},0.05)` }}>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-data text-[9px] text-[var(--text-3)] tracking-widest uppercase mb-1">
                {isAir ? 'Concentração' : 'Risk Score'}
              </div>
              <div className="font-data text-3xl font-semibold leading-none" style={{ color: sev.color }}>
                {isAir
                  ? `${properties.value?.toFixed(1) ?? '—'}`
                  : `${(properties.risk_score ?? properties.score)?.toFixed(1) ?? '—'}`}
                <span className="text-sm font-normal text-[var(--text-3)] ml-1">
                  {isAir ? 'ppb' : '/10'}
                </span>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-sm font-data text-[10px] tracking-widest"
              style={{
                color: sev.color,
                border: `1px solid ${sev.color}`,
                background: `rgba(${sev.color === 'var(--teal)' ? '0,232,208' : sev.color === 'var(--amber)' ? '255,178,36' : sev.color === 'var(--acid)' ? '184,255,87' : '255,61,90'},0.1)`,
              }}
            >
              {sev.label}
            </div>
          </div>
        </div>

        {/* Data rows */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="py-1">
            {isAir && (
              <Row label="Fonte" value={properties.source ?? '—'} />
            )}

            {isSoil && (
              <>
                <Row label="Categoria" value={properties.category ?? '—'} />
                <Row
                  label="CH₄"
                  value={properties.ch4_value?.toFixed(2) ?? '—'}
                  unit="ppb"
                  color="var(--amber)"
                />
                <Row
                  label="NDVI"
                  value={properties.ndvi_value?.toFixed(3) ?? '—'}
                  color={properties.ndvi_value < 0.2 ? 'var(--crimson)' : properties.ndvi_value < 0.4 ? 'var(--amber)' : 'var(--teal)'}
                />
                <Row
                  label="Pop. Afetada"
                  value={properties.population_density ?? '—'}
                  unit="hab/km²"
                />
                <Row
                  label="Intensidade"
                  value={properties.pollution_intensity ?? '—'}
                  color={
                    properties.pollution_intensity === 'Alta' ? 'var(--crimson)' :
                    properties.pollution_intensity === 'Média' ? 'var(--amber)' : 'var(--teal)'
                  }
                />
                <Row label="Fonte" value={properties.source ?? '—'} />
              </>
            )}

            <div className="flex items-start justify-between py-2.5 border-b border-[var(--border)]">
              <span className="font-data text-[9px] text-[var(--text-3)] tracking-widest uppercase flex-shrink-0 pt-0.5 w-28 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />data
              </span>
              <span className="font-data text-xs text-[var(--text-1)] text-right">
                {formatDate(properties.recorded_at)}
              </span>
            </div>

            <div className="flex items-start justify-between py-2.5">
              <span className="font-data text-[9px] text-[var(--text-3)] tracking-widest uppercase flex-shrink-0 pt-0.5 w-28 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />coords
              </span>
              <span className="font-data text-[10px] text-[var(--text-2)] text-right leading-relaxed">
                {coordinates[1].toFixed(5)}<br />{coordinates[0].toFixed(5)}
              </span>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center justify-center gap-2 py-2.5 font-ui font-semibold text-sm text-[var(--void)] bg-[var(--teal)] hover:opacity-90 transition-all duration-200 rounded-xl glow-teal"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
