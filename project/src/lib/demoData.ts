import { supabase } from './supabase';

interface CityCoordinates {
  lat: number;
  lng: number;
}

const cities: Record<string, CityCoordinates> = {
  // São Paulo (SP) - 10 cidades
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Campinas': { lat: -22.9099, lng: -47.0626 },
  'Guarulhos': { lat: -23.4538, lng: -46.5333 },
  'Santos': { lat: -23.9608, lng: -46.3339 },
  'São Bernardo': { lat: -23.6914, lng: -46.5647 },
  'Osasco': { lat: -23.5329, lng: -46.7916 },
  'Ribeirão Preto': { lat: -21.1704, lng: -47.8103 },
  'Sorocaba': { lat: -23.5015, lng: -47.4526 },
  'São José dos Campos': { lat: -23.1791, lng: -45.8872 },
  'Piracicaba': { lat: -22.7253, lng: -47.6492 },

  // Rio de Janeiro (RJ) - 5 cidades
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Niterói': { lat: -22.8833, lng: -43.1036 },
  'Duque de Caxias': { lat: -22.7858, lng: -43.3054 },
  'Nova Iguaçu': { lat: -22.7592, lng: -43.4511 },
  'Campos dos Goytacazes': { lat: -21.7622, lng: -41.3181 },

  // Minas Gerais (MG) - 5 cidades
  'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
  'Uberlândia': { lat: -18.9186, lng: -48.2772 },
  'Contagem': { lat: -19.9320, lng: -44.0539 },
  'Juiz de Fora': { lat: -21.7642, lng: -43.3503 },
  'Montes Claros': { lat: -16.7350, lng: -43.8619 },

  // Bahia (BA) - 4 cidades
  'Salvador': { lat: -12.9714, lng: -38.5014 },
  'Feira de Santana': { lat: -12.2664, lng: -38.9663 },
  'Vitória da Conquista': { lat: -14.8615, lng: -40.8442 },
  'Ilhéus': { lat: -14.7889, lng: -39.0497 },

  // Paraná (PR) - 4 cidades
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Londrina': { lat: -23.3045, lng: -51.1696 },
  'Maringá': { lat: -23.4205, lng: -51.9333 },
  'Foz do Iguaçu': { lat: -25.5469, lng: -54.5882 },

  // Rio Grande do Sul (RS) - 4 cidades
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Caxias do Sul': { lat: -29.1634, lng: -51.1797 },
  'Pelotas': { lat: -31.7654, lng: -52.3376 },
  'Santa Maria': { lat: -29.6842, lng: -53.8069 },

  // Pernambuco (PE) - 3 cidades
  'Recife': { lat: -8.0476, lng: -34.877 },
  'Jaboatão dos Guararapes': { lat: -8.1130, lng: -35.0145 },
  'Caruaru': { lat: -8.2836, lng: -35.9761 },

  // Ceará (CE) - 3 cidades
  'Fortaleza': { lat: -3.7319, lng: -38.5267 },
  'Caucaia': { lat: -3.7361, lng: -38.6531 },
  'Juazeiro do Norte': { lat: -7.2131, lng: -39.3151 },

  // Amazonas (AM) - 5 cidades
  'Manaus': { lat: -3.1190, lng: -60.0217 },
  'Parintins': { lat: -2.6286, lng: -56.7356 },
  'Itacoatiara': { lat: -3.1431, lng: -58.4442 },
  'Manacapuru': { lat: -3.2997, lng: -60.6208 },
  'Coari': { lat: -4.0850, lng: -63.1411 },

  // Pará (PA) - 6 cidades
  'Belém': { lat: -1.4558, lng: -48.4902 },
  'Ananindeua': { lat: -1.3656, lng: -48.3722 },
  'Santarém': { lat: -2.4411, lng: -54.7083 },
  'Marabá': { lat: -5.3686, lng: -49.1178 },
  'Castanhal': { lat: -1.2933, lng: -47.9267 },
  'Parauapebas': { lat: -6.0675, lng: -49.9022 },

  // Goiás (GO) - 6 cidades
  'Goiânia': { lat: -16.6864, lng: -49.2643 },
  'Aparecida de Goiânia': { lat: -16.8239, lng: -49.2439 },
  'Anápolis': { lat: -16.3281, lng: -48.9528 },
  'Rio Verde': { lat: -17.7978, lng: -50.9269 },
  'Luziânia': { lat: -16.2528, lng: -47.9500 },
  'Catalão': { lat: -18.1656, lng: -47.9464 },

  // Distrito Federal (DF) - 3 regiões
  'Brasília': { lat: -15.8267, lng: -47.9218 },
  'Taguatinga': { lat: -15.8272, lng: -48.0481 },
  'Ceilândia': { lat: -15.8178, lng: -48.1097 },

  // Mato Grosso do Sul (MS) - 5 cidades
  'Campo Grande': { lat: -20.4697, lng: -54.6201 },
  'Dourados': { lat: -22.2211, lng: -54.8056 },
  'Três Lagoas': { lat: -20.7514, lng: -51.6789 },
  'Corumbá': { lat: -19.0078, lng: -57.6539 },
  'Ponta Porã': { lat: -22.5361, lng: -55.7256 },

  // Mato Grosso (MT) - 5 cidades
  'Cuiabá': { lat: -15.601, lng: -56.0974 },
  'Várzea Grande': { lat: -15.6467, lng: -56.1325 },
  'Rondonópolis': { lat: -16.4708, lng: -54.6353 },
  'Sinop': { lat: -11.8644, lng: -55.5031 },
  'Tangará da Serra': { lat: -14.6219, lng: -57.4931 },

  // Piauí (PI) - 4 cidades
  'Teresina': { lat: -5.0892, lng: -42.8019 },
  'Parnaíba': { lat: -2.9058, lng: -41.7767 },
  'Picos': { lat: -7.0769, lng: -41.4669 },
  'Floriano': { lat: -6.7697, lng: -43.0228 },

  // Rio Grande do Norte (RN) - 4 cidades
  'Natal': { lat: -5.7945, lng: -35.211 },
  'Mossoró': { lat: -5.1878, lng: -37.3444 },
  'Parnamirim': { lat: -5.9153, lng: -35.2628 },
  'Caicó': { lat: -6.4583, lng: -37.0978 },

  // Alagoas (AL) - 3 cidades
  'Maceió': { lat: -9.6658, lng: -35.735 },
  'Arapiraca': { lat: -9.7525, lng: -36.6611 },
  'Palmeira dos Índios': { lat: -9.4058, lng: -36.6289 },

  // Paraíba (PB) - 4 cidades
  'João Pessoa': { lat: -7.1195, lng: -34.845 },
  'Campina Grande': { lat: -7.2306, lng: -35.8811 },
  'Santa Rita': { lat: -7.1139, lng: -34.9781 },
  'Patos': { lat: -7.0242, lng: -37.2797 },

  // Santa Catarina (SC) - 3 cidades
  'Florianópolis': { lat: -27.5954, lng: -48.548 },
  'Joinville': { lat: -26.3045, lng: -48.8487 },
  'Blumenau': { lat: -26.9194, lng: -49.0661 },

  // Espírito Santo (ES) - 3 cidades
  'Vitória': { lat: -20.3155, lng: -40.3128 },
  'Vila Velha': { lat: -20.3297, lng: -40.2925 },
  'Cariacica': { lat: -20.2619, lng: -40.4164 },

  // Sergipe (SE) - 2 cidades
  'Aracaju': { lat: -10.9472, lng: -37.0731 },
  'Nossa Senhora do Socorro': { lat: -10.8550, lng: -37.1264 },

  // Maranhão (MA) - 4 cidades
  'São Luís': { lat: -2.5387, lng: -44.2825 },
  'Imperatriz': { lat: -5.5264, lng: -47.4911 },
  'São José de Ribamar': { lat: -2.5542, lng: -44.0578 },
  'Caxias': { lat: -4.8586, lng: -43.3561 },

  // Tocantins (TO) - 4 cidades
  'Palmas': { lat: -10.1840, lng: -48.3336 },
  'Araguaína': { lat: -7.1911, lng: -48.2072 },
  'Gurupi': { lat: -11.7292, lng: -49.0683 },
  'Porto Nacional': { lat: -10.7086, lng: -48.4178 },

  // Acre (AC) - 3 cidades
  'Rio Branco': { lat: -9.9753, lng: -67.8243 },
  'Cruzeiro do Sul': { lat: -7.6278, lng: -72.6753 },
  'Sena Madureira': { lat: -9.0658, lng: -68.6572 },

  // Rondônia (RO) - 4 cidades
  'Porto Velho': { lat: -8.7612, lng: -63.9004 },
  'Ji-Paraná': { lat: -10.8789, lng: -61.9317 },
  'Ariquemes': { lat: -9.9133, lng: -63.0406 },
  'Vilhena': { lat: -12.7406, lng: -60.1458 },

  // Roraima (RR) - 3 cidades
  'Boa Vista': { lat: 2.8235, lng: -60.6758 },
  'Rorainópolis': { lat: 0.9411, lng: -60.4394 },
  'Caracaraí': { lat: 1.8161, lng: -61.1275 },

  // Amapá (AP) - 3 cidades
  'Macapá': { lat: 0.0349, lng: -51.0694 },
  'Santana': { lat: -0.0586, lng: -51.1822 },
  'Laranjal do Jari': { lat: -0.8136, lng: -52.4906 },
};

function randomOffset(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

function getSeverity(value: number, thresholds: [number, number, number]): 'low' | 'medium' | 'high' | 'critical' {
  if (value < thresholds[0]) return 'low';
  if (value < thresholds[1]) return 'medium';
  if (value < thresholds[2]) return 'high';
  return 'critical';
}

export async function generateDemoData(cityName: string = 'São Paulo', count: number = 20) {
  const city = cities[cityName] || cities['São Paulo'];

  const now = new Date();
  const airPollutionData = [];
  const soilPollutionData = [];

  for (let i = 0; i < count; i++) {
    const lat = randomOffset(city.lat, 0.2);
    const lng = randomOffset(city.lng, 0.2);
    const daysAgo = Math.floor(Math.random() * 7);
    const recordedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const no2Value = Math.random() * 150;
    airPollutionData.push({
      latitude: lat,
      longitude: lng,
      no2_value: no2Value,
      severity: getSeverity(no2Value, [40, 80, 120]),
      recorded_at: recordedAt,
      source: 'Sentinel-5P/TROPOMI (Demo)',
    });

    const wasteScore = Math.random() * 100;
    const ch4Value = wasteScore * 20 + Math.random() * 100;
    const ndviValue = 0.8 - (wasteScore / 100) * 0.7 - Math.random() * 0.2;
    const populationDensity = cityName === 'São Paulo' ? 7500 + Math.random() * 5000 :
                             cityName === 'Rio de Janeiro' ? 5000 + Math.random() * 3000 :
                             cityName === 'Brasília' ? 400 + Math.random() * 600 :
                             1000 + Math.random() * 2000;
    const pollutionIntensity = wasteScore < 35 ? 'Baixa' : wasteScore < 70 ? 'Média' : 'Alta';
    const categories = ['Resíduos Urbanos', 'Lixo Industrial', 'Deposição Irregular', 'Aterro'];
    soilPollutionData.push({
      latitude: randomOffset(city.lat, 0.2),
      longitude: randomOffset(city.lng, 0.2),
      waste_score: wasteScore,
      category: categories[Math.floor(Math.random() * categories.length)],
      severity: getSeverity(wasteScore, [25, 50, 75]),
      recorded_at: recordedAt,
      source: 'Sentinel-2 (Demo)',
      ch4_value: ch4Value,
      ndvi_value: ndviValue,
      risk_score: wasteScore,
      detected_at: new Date(now.getTime() - (daysAgo + 0.1) * 24 * 60 * 60 * 1000).toISOString(),
      population_density: Math.floor(populationDensity),
      pollution_intensity: pollutionIntensity,
    });

  }

  await Promise.all([
    supabase.from('air_pollution').insert(airPollutionData),
    supabase.from('soil_pollution').insert(soilPollutionData),
  ]);

  return {
    airPollution: airPollutionData.length,
    soilPollution: soilPollutionData.length,
  };
}

export async function clearDemoData() {
  await Promise.all([
    supabase.from('air_pollution').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    supabase.from('soil_pollution').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
  ]);
}

export async function generateAllBrazilData() {
  const allAirPollution = [];
  const allSoilPollution = [];
  const now = new Date();

  for (const [cityName, cityCoords] of Object.entries(cities)) {
    const isSaoPauloRegion = cityName.includes('São Paulo') ||
                              cityName === 'Campinas' ||
                              cityName === 'Guarulhos' ||
                              cityName === 'Santos' ||
                              cityName === 'São Bernardo' ||
                              cityName === 'Osasco' ||
                              cityName === 'Ribeirão Preto' ||
                              cityName === 'Sorocaba' ||
                              cityName === 'Piracicaba' ||
                              cityName === 'São José dos Campos';

    const isMajorCity = cityName === 'Rio de Janeiro' ||
                        cityName === 'Belo Horizonte' ||
                        cityName === 'Brasília' ||
                        cityName === 'Salvador' ||
                        cityName === 'Fortaleza' ||
                        cityName === 'Curitiba' ||
                        cityName === 'Porto Alegre' ||
                        cityName === 'Recife' ||
                        cityName === 'Manaus' ||
                        cityName === 'Belém';

    const count = isSaoPauloRegion ? 80 : isMajorCity ? 50 : 35;
    const spreadRange = isSaoPauloRegion ? 1.2 : isMajorCity ? 0.8 : 0.6;

    for (let i = 0; i < count; i++) {
      const lat = randomOffset(cityCoords.lat, spreadRange);
      const lng = randomOffset(cityCoords.lng, spreadRange);
      const daysAgo = Math.floor(Math.random() * 7);
      const recordedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      const no2Value = Math.random() * 150;
      allAirPollution.push({
        latitude: lat,
        longitude: lng,
        no2_value: no2Value,
        severity: getSeverity(no2Value, [40, 80, 120]),
        recorded_at: recordedAt,
        source: `Sentinel-5P/TROPOMI (${cityName})`,
      });

      const wasteScore = Math.random() * 100;
      const ch4Value = wasteScore * 20 + Math.random() * 100;
      const ndviValue = 0.8 - (wasteScore / 100) * 0.7 - Math.random() * 0.2;
      const populationDensity = isSaoPauloRegion ? 7500 + Math.random() * 5000 :
                               cityName === 'Rio de Janeiro' ? 5000 + Math.random() * 3000 :
                               cityName === 'Brasília' ? 400 + Math.random() * 600 :
                               1000 + Math.random() * 2000;
      const pollutionIntensity = wasteScore < 35 ? 'Baixa' : wasteScore < 70 ? 'Média' : 'Alta';
      const categories = ['Resíduos Urbanos', 'Lixo Industrial', 'Deposição Irregular', 'Aterro'];

      allSoilPollution.push({
        latitude: randomOffset(cityCoords.lat, spreadRange),
        longitude: randomOffset(cityCoords.lng, spreadRange),
        waste_score: wasteScore,
        category: categories[Math.floor(Math.random() * categories.length)],
        severity: getSeverity(wasteScore, [25, 50, 75]),
        recorded_at: recordedAt,
        source: `Sentinel-2 (${cityName})`,
        ch4_value: ch4Value,
        ndvi_value: ndviValue,
        risk_score: wasteScore,
        detected_at: new Date(now.getTime() - (daysAgo + 0.1) * 24 * 60 * 60 * 1000).toISOString(),
        population_density: Math.floor(populationDensity),
        pollution_intensity: pollutionIntensity,
      });
    }
  }

  await Promise.all([
    supabase.from('air_pollution').insert(allAirPollution),
    supabase.from('soil_pollution').insert(allSoilPollution),
  ]);

  return {
    airPollution: allAirPollution.length,
    soilPollution: allSoilPollution.length,
    cities: Object.keys(cities).length,
  };
}

export const availableCities = Object.keys(cities);
