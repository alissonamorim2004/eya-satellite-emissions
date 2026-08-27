"""
EYA Pipeline — Google Earth Engine → Supabase
=============================================
Extrai dados reais de CH₄ (Sentinel-5P/TROPOMI) e NO₂
via Google Earth Engine e insere no Supabase,
compatível com o schema existente do projeto.

Instalação:
    pip install earthengine-api supabase python-dotenv

Autenticação GEE (primeira vez):
    python -m earthengine authenticate
"""

import ee
import json
import os
import math
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# ─── Config ────────────────────────────────────────────────────────────────────

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # service key, não anon key

# Cidades brasileiras com bounding boxes (lat_min, lon_min, lat_max, lon_max)
CIDADES = {
    "São Paulo":       {"bbox": [-24.0, -46.9, -23.3, -46.3], "pop": 12_300_000},
    "Rio de Janeiro":  {"bbox": [-23.1, -43.8, -22.7, -43.1], "pop": 6_700_000},
    "Belo Horizonte":  {"bbox": [-20.1, -44.1, -19.7, -43.8], "pop": 2_500_000},
    "Manaus":          {"bbox": [-3.3,  -60.1, -2.9,  -59.8], "pop": 2_200_000},
    "Salvador":        {"bbox": [-13.1, -38.7, -12.8, -38.4], "pop": 2_900_000},
    "Curitiba":        {"bbox": [-25.6, -49.4, -25.3, -49.1], "pop": 1_900_000},
    "Recife":          {"bbox": [-8.2,  -35.1, -7.9,  -34.8], "pop": 1_600_000},
    "Fortaleza":       {"bbox": [-3.9,  -38.7, -3.6,  -38.4], "pop": 2_700_000},
    "Belém":           {"bbox": [-1.6,  -48.6, -1.3,  -48.3], "pop": 1_500_000},
    "Porto Alegre":    {"bbox": [-30.2, -51.3, -29.9, -51.0], "pop": 1_500_000},
    "Goiânia":         {"bbox": [-16.8, -49.4, -16.5, -49.1], "pop": 1_500_000},
    "Campo Grande":    {"bbox": [-20.6, -54.8, -20.3, -54.5], "pop": 900_000},
    "Cuiabá":          {"bbox": [-15.7, -56.2, -15.4, -55.9], "pop": 620_000},
    "Porto Velho":     {"bbox": [-8.9,  -64.1, -8.6,  -63.8], "pop": 540_000},
    "Vilhena":         {"bbox": [-12.78, -60.17, -12.68, -60.08], "pop": 100_000, "grid": 6},
}

# Quantos pontos de grid gerar por cidade (resolução do mapa)
GRID_POINTS = 12   # 12x12 = 144 pontos por cidade
DAYS_BACK   = 30   # janela temporal de coleta


# ─── GEE helpers ───────────────────────────────────────────────────────────────

def init_gee():
    """Inicializa o Earth Engine. Na primeira execução, autentique com:
       python -m earthengine authenticate
    """
    try:
        ee.Initialize(project=os.getenv("GEE_PROJECT_ID", "eya-monitoring"))
        print("✓ Google Earth Engine inicializado")
    except Exception as e:
        print(f"✗ Erro GEE: {e}")
        print("  Execute: python -m earthengine authenticate")
        raise


def get_ch4_for_city(cidade: str, config: dict, days_back: int = DAYS_BACK) -> list[dict]:
    """
    Extrai concentração média de CH₄ (ppb) do Sentinel-5P/TROPOMI
    para uma cidade em um grid de pontos.

    Retorna lista de dicts compatível com a tabela air_pollution do Supabase.
    """
    bbox = config["bbox"]
    lat_min, lon_min, lat_max, lon_max = bbox

    end_date   = datetime.utcnow()
    start_date = end_date - timedelta(days=days_back)

    region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])

    # Sentinel-5P CH₄ — Offline (5 dias de latência, melhor qualidade)
    # bias_corrected já vem em ppb diretamente no GEE
    collection = (
        ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_CH4")
        .select("CH4_column_volume_mixing_ratio_dry_air_bias_corrected")
        .filterDate(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
        .filterBounds(region)
    )

    count = collection.size().getInfo()
    if count == 0:
        print(f"  ⚠ Sem dados CH₄ para {cidade} no período")
        return []

    # Mediana temporal — remove outliers de nuvens
    composite = collection.median()

    # Gera grid de pontos de amostragem (por cidade ou padrão global)
    grid = config.get("grid", GRID_POINTS)
    lat_step = (lat_max - lat_min) / grid
    lon_step = (lon_max - lon_min) / grid

    points = []
    for i in range(grid):
        for j in range(grid):
            lat = lat_min + (i + 0.5) * lat_step
            lon = lon_min + (j + 0.5) * lon_step
            points.append(ee.Feature(ee.Geometry.Point([lon, lat]), {"lat": lat, "lon": lon}))

    fc = ee.FeatureCollection(points)

    # Amostra o valor de CH₄ em cada ponto
    sampled = composite.sampleRegions(
        collection=fc,
        scale=7000,          # resolução nativa do TROPOMI ~7km
        geometries=True,
    )

    features = sampled.getInfo().get("features", [])

    records = []
    now_iso = datetime.utcnow().isoformat()

    for feat in features:
        props = feat.get("properties", {})
        ch4_ppb = props.get("CH4_column_volume_mixing_ratio_dry_air_bias_corrected")
        lat     = props.get("lat")
        lon     = props.get("lon")

        if ch4_ppb is None or math.isnan(ch4_ppb):
            continue

        # banda bias_corrected já vem em ppb diretamente

        # Anomalia: quanto acima do baseline regional (~1900 ppb)
        baseline  = 1900.0
        anomaly   = max(0, ch4_ppb - baseline)
        no2_equiv = anomaly * 0.08  # conversão aproximada para compatibilidade com schema

        severity = classify_severity_ch4(ch4_ppb)

        records.append({
            "latitude":    round(lat, 6),
            "longitude":   round(lon, 6),
            "no2_value":   round(no2_equiv, 4),
            "ch4_value":   round(ch4_ppb, 2),
            "severity":    severity,
            "recorded_at": now_iso,
            "source":      "Sentinel-5P/TROPOMI",
            "city":        cidade,
        })

    print(f"  ✓ {cidade}: {len(records)} pontos CH₄ extraídos (mediana {days_back}d)")
    return records


def get_no2_for_city(cidade: str, config: dict, days_back: int = DAYS_BACK) -> list[dict]:
    """
    Extrai concentração de NO₂ (mol/m²) do Sentinel-5P/TROPOMI.
    NO₂ tem versão Near Real-Time — latência de apenas 3h.
    """
    bbox = config["bbox"]
    lat_min, lon_min, lat_max, lon_max = bbox

    end_date   = datetime.utcnow()
    start_date = end_date - timedelta(days=days_back)

    region = ee.Geometry.Rectangle([lon_min, lat_min, lon_max, lat_max])

    collection = (
        ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
        .select("NO2_column_number_density")
        .filterDate(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
        .filterBounds(region)
    )

    if collection.size().getInfo() == 0:
        return []

    composite = collection.median()

    grid = config.get("grid", GRID_POINTS)
    lat_step = (lat_max - lat_min) / grid
    lon_step = (lon_max - lon_min) / grid

    points = [
        ee.Feature(
            ee.Geometry.Point([
                lon_min + (j + 0.5) * lon_step,
                lat_min + (i + 0.5) * lat_step,
            ]),
            {
                "lat": lat_min + (i + 0.5) * lat_step,
                "lon": lon_min + (j + 0.5) * lon_step,
            }
        )
        for i in range(grid)
        for j in range(grid)
    ]

    sampled = composite.sampleRegions(
        collection=ee.FeatureCollection(points),
        scale=3500,
        geometries=True,
    )

    features = sampled.getInfo().get("features", [])
    records  = []
    now_iso  = datetime.utcnow().isoformat()

    for feat in features:
        props = feat.get("properties", {})
        no2   = props.get("NO2_column_number_density")
        lat   = props.get("lat")
        lon   = props.get("lon")

        if no2 is None or math.isnan(no2):
            continue

        # NO₂ em mol/m² → converter para µmol/m² para escala legível
        no2_umol   = no2 * 1e6
        severity   = classify_severity_no2(no2_umol)

        records.append({
            "latitude":    round(lat, 6),
            "longitude":   round(lon, 6),
            "no2_value":   round(no2_umol, 4),
            "severity":    severity,
            "recorded_at": now_iso,
            "source":      "Sentinel-5P/TROPOMI",
            "city":        cidade,
        })

    print(f"  ✓ {cidade}: {len(records)} pontos NO₂ extraídos")
    return records


# ─── Classificação de severidade ───────────────────────────────────────────────

def classify_severity_ch4(ch4_ppb: float) -> str:
    """
    Classifica severidade de CH₄ em ppb.
    Baseline atmosférico global: ~1900 ppb
    """
    if ch4_ppb < 1900:  return "low"
    if ch4_ppb < 1920:  return "medium"
    if ch4_ppb < 1950:  return "high"
    return "critical"


def classify_severity_no2(no2_umol: float) -> str:
    """
    WHO guidelines:
    - < 25 µmol/m²  → baixo
    - 25–75          → médio
    - 75–150         → alto
    - > 150          → crítico
    """
    if no2_umol < 25:   return "low"
    if no2_umol < 75:   return "medium"
    if no2_umol < 150:  return "high"
    return "critical"


# ─── Supabase ──────────────────────────────────────────────────────────────────

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env\n"
            "Use a service key (não a anon key) para poder inserir dados."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def upsert_air_pollution(client: Client, records: list[dict]):
    """Insere registros na tabela air_pollution."""
    if not records:
        return

    # Remove campos extras que não estão no schema original
    clean = []
    for r in records:
        clean.append({
            "latitude":    r["latitude"],
            "longitude":   r["longitude"],
            "no2_value":   r["no2_value"],
            "severity":    r["severity"],
            "recorded_at": r["recorded_at"],
            "source":      r["source"],
        })

    resp = client.table("air_pollution").insert(clean).execute()
    print(f"  ✓ {len(clean)} registros inseridos em air_pollution")
    return resp


def upsert_soil_pollution(client: Client, ch4_records: list[dict]):
    """
    Usa os pontos de CH₄ elevado para popular soil_pollution
    (que no schema representa pontos de risco de resíduo/metano).
    Só insere pontos com severity >= medium.
    """
    if not ch4_records:
        return

    high_risk = [r for r in ch4_records if r["severity"] in ("medium", "high", "critical")]
    if not high_risk:
        return

    clean = []
    for r in high_risk:
        ch4    = r.get("ch4_value", 1900)
        anomaly = max(0, ch4 - 1900)
        # waste_score: 0-100 baseado na anomalia de CH₄
        waste_score = min(100, anomaly * 2.5)

        clean.append({
            "latitude":           r["latitude"],
            "longitude":          r["longitude"],
            "waste_score":        round(waste_score, 2),
            "category":           "methane_emission",
            "severity":           r["severity"],
            "recorded_at":        r["recorded_at"],
            "source":             r["source"],
            "ch4_value":          round(ch4, 2),
            "ndvi_value":         0.0,      # será preenchido quando integrar Sentinel-2
            "risk_score":         round(waste_score / 10, 1),
            "detected_at":        r["recorded_at"],
            "population_density": 0,        # será cruzado com IBGE futuramente
            "pollution_intensity": r["severity"],
        })

    resp = client.table("soil_pollution").insert(clean).execute()
    print(f"  ✓ {len(clean)} pontos de risco inseridos em soil_pollution")
    return resp


# ─── Runner principal ───────────────────────────────────────────────────────────

def run_pipeline(cidades: list[str] | None = None, dry_run: bool = False):
    """
    Executa o pipeline completo para as cidades especificadas.

    Args:
        cidades:  Lista de nomes de cidades. None = todas.
        dry_run:  Se True, extrai mas não insere no Supabase.
    """
    print("\n🛰  EYA Pipeline — GEE → Supabase")
    print(f"   Período: últimos {DAYS_BACK} dias")
    print(f"   Modo: {'DRY RUN (sem inserção)' if dry_run else 'PRODUÇÃO'}\n")

    init_gee()

    if not dry_run:
        supabase = get_supabase()

    alvo = cidades or list(CIDADES.keys())

    total_ch4 = 0
    total_no2 = 0

    for cidade in alvo:
        if cidade not in CIDADES:
            print(f"⚠ Cidade não encontrada: {cidade}")
            continue

        config = CIDADES[cidade]
        print(f"\n📍 Processando: {cidade}")

        # CH₄
        ch4_records = get_ch4_for_city(cidade, config)
        total_ch4  += len(ch4_records)

        # NO₂
        no2_records = get_no2_for_city(cidade, config)
        total_no2  += len(no2_records)

        if not dry_run and (ch4_records or no2_records):
            # NO₂ → air_pollution
            if no2_records:
                upsert_air_pollution(supabase, no2_records)

            # CH₄ alto → air_pollution (como fonte extra) + soil_pollution
            if ch4_records:
                upsert_air_pollution(supabase, ch4_records)
                upsert_soil_pollution(supabase, ch4_records)

        elif dry_run and ch4_records:
            # Preview dos dados
            sample = ch4_records[:3]
            print(f"  Preview CH₄: {json.dumps(sample, indent=2, ensure_ascii=False)}")

    print(f"\n✅ Pipeline concluído")
    print(f"   CH₄: {total_ch4} pontos | NO₂: {total_no2} pontos")


# ─── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="EYA — Pipeline GEE → Supabase")
    parser.add_argument(
        "--cidades", nargs="+",
        help='Cidades a processar. Ex: "São Paulo" "Rio de Janeiro"',
        default=None,
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Extrai dados mas não insere no Supabase",
    )
    parser.add_argument(
        "--days", type=int, default=DAYS_BACK,
        help=f"Janela temporal em dias (padrão: {DAYS_BACK})",
    )
    args = parser.parse_args()

    DAYS_BACK = args.days

    run_pipeline(
        cidades=args.cidades,
        dry_run=args.dry_run,
    )
