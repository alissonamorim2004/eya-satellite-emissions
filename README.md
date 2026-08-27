# EYA — Earth + IA Platform

Plataforma de detecção e visualização de emissões de metano (CH₄) e dióxido de
nitrogênio (NO₂) a partir de imagens de satélite, com cruzamento dos focos
detectados contra bases de locais de resíduos sólidos para identificar prováveis
fontes.

🏆 **NASA Space Apps Challenge 2025 — Global Nominee**
Desafio: *Data Pathways to Healthy Cities and Human Settlements*
[Verificar na lista oficial](https://www.spaceappschallenge.org/2025/awards/global-nominees/) (busque por "nexla")

---

## O problema

O desafio da NASA pedia caminhos de dados para cidades e assentamentos saudáveis.
E existe um dado abundante que quase nenhuma cidade usa: **o satélite já mede a
qualidade do ar sobre ela, todos os dias, de graça.**

O Sentinel-5P/TROPOMI mede metano e dióxido de nitrogênio globalmente. Os dados
são públicos e gratuitos. Mas ficam num formato que só quem trabalha com
geoprocessamento consegue abrir — coleções de imagem, projeções, bandas
espectrais.

O resultado é que o gestor municipal, que é quem decide onde fiscalizar, nunca vê
esse dado. Ele descobre um lixão irregular por denúncia, meses depois.

E há uma lacuna adicional: **detectar um foco de emissão não diz o que o causa.**
Uma concentração alta de metano pode ser aterro, criação animal, área alagada ou
atividade industrial. Sem cruzar com o que existe no chão, o dado vira alarme sem
endereço.

---

## A solução

Um pipeline que traduz dado de satélite em informação acionável, e uma interface
que apresenta isso para quem não é especialista.

### Pipeline de extração

Consulta o Google Earth Engine sobre bounding boxes de cidades brasileiras,
extrai as concentrações médias de CH₄ e NO₂ por célula de grade, e persiste no
banco.

A resolução da grade é ajustada por cidade: área metropolitana grande recebe
malha mais fina, cidade menor recebe malha proporcional ao seu tamanho — o que
evita gerar milhares de pontos vazios para municípios pequenos.

### Cruzamento com fontes prováveis

O `validate_points.py` cruza cada foco detectado com locais conhecidos de resíduos
sólidos, consultando três fontes em ordem de prioridade:

1. **OpenStreetMap**, via Overpass API
2. **SNIS** — Sistema Nacional de Informações sobre Saneamento
3. **`known_sites.json`** — cadastro manual, para quando as duas primeiras não
   cobrem o município

Cada site do cadastro manual exige fonte e ano declarados. Isso é deliberado: dado
sem procedência em análise ambiental não serve para embasar decisão.

### Interface

Visualização em mapa com camadas de concentração, painel de inspeção por ponto,
globo terrestre em Three.js com textura real da Terra, página educativa
explicando o que cada poluente significa, e exportação de relatório em PDF.

---

## Arquitetura

```
   ┌─────────────────────────────────────────────┐
   │        GOOGLE EARTH ENGINE                  │
   │   Sentinel-5P / TROPOMI                     │
   │   CH₄ · NO₂ — cobertura global diária       │
   └────────────────────┬────────────────────────┘
                        ▼
   ┌─────────────────────────────────────────────┐
   │            pipeline.py                      │
   │                                             │
   │  • bounding box por cidade                  │
   │  • resolução de grade proporcional          │
   │  • média de concentração por célula         │
   │  • normalização e persistência              │
   └────────────────────┬────────────────────────┘
                        ▼
   ┌─────────────────────────────────────────────┐
   │         validate_points.py                  │
   │                                             │
   │  cruzamento com fontes prováveis:           │
   │   1. OpenStreetMap (Overpass API)           │
   │   2. SNIS (resíduos sólidos)                │
   │   3. known_sites.json (cadastro manual)     │
   │                                             │
   │  → distância do foco ao site mais próximo   │
   └────────────────────┬────────────────────────┘
                        ▼
   ┌─────────────────────────────────────────────┐
   │              SUPABASE                       │
   │   PostgreSQL · leituras e sites             │
   └────────────────────┬────────────────────────┘
                        ▼
   ┌─────────────────────────────────────────────┐
   │        APLICAÇÃO WEB (React + Vite)         │
   │                                             │
   │  ┌────────────┐  ┌──────────────────────┐   │
   │  │ MapView    │  │ InspectionPanel      │   │
   │  │ MapLibre GL│  │ detalhe por ponto    │   │
   │  └────────────┘  └──────────────────────┘   │
   │  ┌────────────┐  ┌──────────────────────┐   │
   │  │ Dashboard  │  │ SimpleGlobe (Three.js│   │
   │  │ indicadores│  │ textura NASA)        │   │
   │  └────────────┘  └──────────────────────┘   │
   │  ┌────────────┐  ┌──────────────────────┐   │
   │  │ Landing    │  │ EducationalPage      │   │
   │  └────────────┘  └──────────────────────┘   │
   │                                             │
   │  Exportação de relatório em PDF             │
   └─────────────────────────────────────────────┘
```

---

## Stack

**Pipeline:** Python · Google Earth Engine API · Supabase · Overpass API
**Frontend:** React · TypeScript · Vite · MapLibre GL · Three.js · Tailwind CSS
**Dados:** PostgreSQL (Supabase)
**Exportação:** jsPDF · html2canvas
**Deploy:** Vercel

---

## Decisões técnicas

### Cruzar o foco com a fonte provável

Esta é a decisão que separa o projeto de uma visualização bonita de dado de
satélite.

Detectar concentração alta de metano é o passo fácil — o satélite entrega isso. O
que torna o dado utilizável para um gestor é responder "provavelmente vem
daquele aterro, a 800 metros do foco". Sem isso, o mapa mostra manchas coloridas
que ninguém sabe o que fazer com.

### Três fontes em cascata, com procedência obrigatória

OSM primeiro por ser aberto e atualizado pela comunidade. SNIS depois, por ser
oficial mas defasado. Cadastro manual por último, e cada entrada exige fonte e
ano declarados no próprio JSON.

A obrigatoriedade da procedência é regra de análise ambiental: informação sem
origem rastreável não embasa decisão pública, e um cadastro que aceita coordenada
sem fonte degrada em poucos meses.

### Resolução de grade proporcional à cidade

Cada município tem sua malha calculada a partir do tamanho do bounding box, em vez
de uma resolução fixa global.

Grade fixa fina gera dezenas de milhares de células vazias em cidade pequena —
custo de processamento e ruído visual. Grade fixa grossa perde variação dentro de
área metropolitana, que é justamente onde a informação importa.

### Bounding box urbano, não municipal

O recorte usa a mancha urbana, não o limite político do município. Área rural
dentro do município tem assinatura de emissão completamente diferente, e incluí-la
dilui a média da região que interessa.

### Service key só no pipeline

A aplicação web usa a chave anônima; o pipeline, que escreve no banco, usa a
service key e roda fora do navegador.

Separação básica e frequentemente ignorada: qualquer chave no frontend está ao
alcance de quem abrir o DevTools.

### Globo com textura real

O globo em Three.js usa a textura Blue Marble, da NASA, em vez de uma esfera
estilizada.

Numa competição da NASA, e num produto sobre observação da Terra, a Terra tem que
parecer a Terra. É decisão de comunicação, não de engenharia — e num hackathon
onde a apresentação conta, isso pesa.

---

## Estrutura

```
eya-satellite-emissions/
├── pipeline/
│   ├── pipeline.py            # extração Earth Engine → Supabase
│   ├── validate_points.py     # cruzamento com fontes de resíduos
│   ├── known_sites.json       # cadastro manual com procedência
│   └── requirements.txt
└── project/
    ├── src/
    │   ├── components/
    │   │   ├── MapView.tsx           # MapLibre GL
    │   │   ├── InspectionPanel.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── SimpleGlobe.tsx       # Three.js
    │   │   ├── EducationalPage.tsx
    │   │   └── LandingPage.tsx
    │   └── lib/
    └── supabase/migrations/
```

---

## Rodando

**Pipeline:**

```bash
cd pipeline
cp .env.example .env          # preencher Supabase e GEE_PROJECT_ID
pip install -r requirements.txt
python -m earthengine authenticate
python pipeline.py
python validate_points.py
```

**Aplicação:**

```bash
cd project
cp .env.example .env          # URL e anon key do Supabase
npm install
npm run dev
```

---

## Origem

Construído em 48 horas durante o NASA Space Apps Challenge 2025, e mantido depois
do evento. O projeto foi selecionado como Global Nominee entre os trabalhos
avaliados pelos júris locais e universais.

---

## Roadmap

**Série temporal.** Hoje o pipeline captura um recorte. Acompanhar a evolução de
um foco ao longo dos meses é o que permitiria distinguir emissão contínua de
evento pontual.

**Mais fontes de cruzamento.** Resíduos sólidos é o começo. Cadastro industrial,
rebanho por município e áreas alagadas cobririam as outras causas prováveis.

**Alerta por limiar.** Notificar quando uma célula ultrapassa um patamar
configurável, em vez de depender de alguém abrir o mapa.

---

> Sanitizado para publicação. Chaves de API, identificador do projeto Supabase e
> webhooks foram removidos. As coordenadas em `known_sites.json` são aproximadas e
> declaram fonte e ano, conforme a política do próprio arquivo.
