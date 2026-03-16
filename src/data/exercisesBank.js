/* ══════════════════════════════════════════════════════════════════════
   BANCO DE EXERCÍCIOS FACIAIS — PELE DE VIDRO
   
   ~39 exercícios organizados por problema facial.
   Baseados em técnicas com comprovação de eficácia:
   - Face Yoga Method (Fumiko Takatsu)
   - Ginástica Facial (Mamada Yoshiko)  
   - Isometria Facial
   - Drenagem Linfática Manual
   - Yoga Facial
   
   Campos image e video estão vazios (placeholder) —
   serão preenchidos com imagens do Freepik e vídeos do King AI.
   ══════════════════════════════════════════════════════════════════════ */

const exercisesBank = [

  // ═══════════════════════════════════════════════════════════════════
  // 1. RUGAS NA TESTA (rugas_testa) — 5 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_rugas_testa_01",
    name: "Alisamento Frontal Isométrico",
    problem: "rugas_testa",
    zone: "Testa",
    duration: "3 min",
    reps: "3×10",
    difficulty: "iniciante",
    image: "/images/exercises/ex_1.jpg",
    video: "",
    videoSteps: [
      "Coloque ambas as mãos espalmadas sobre a testa, dedos apontando para os lados",
      "Aplique pressão firme e uniforme sobre toda a superfície da testa",
      "Tente erguer as sobrancelhas contra a resistência das mãos — segure 5 segundos",
      "Relaxe lentamente e repita. Sinta a musculatura frontal trabalhando contra a pressão"
    ],
    instructions: "Coloque as mãos espalmadas na testa e aplique pressão firme. Tente levantar as sobrancelhas contra a resistência dos dedos — segure 5 segundos no ponto máximo. Este exercício fortalece o músculo frontal e suaviza linhas horizontais, prevenindo novas rugas.",
    benefits: "Suaviza rugas horizontais da testa, fortalece o músculo frontal, previne formação de novas linhas de expressão"
  },
  {
    id: "fb_rugas_testa_02",
    name: "Elevação Alternada de Sobrancelhas",
    problem: "rugas_testa",
    zone: "Testa",
    duration: "2 min",
    reps: "2×15",
    difficulty: "intermediário",
    image: "/images/exercises/ex_2.png",
    video: "",
    videoSteps: [
      "Coloque o indicador da mão direita sobre a sobrancelha direita",
      "Tente levantar apenas essa sobrancelha contra a resistência do dedo — segure 3s",
      "Repita do lado esquerdo com a mão esquerda",
      "Alterne os lados mantendo ritmo constante e pressão uniforme"
    ],
    instructions: "Trabalhe cada sobrancelha individualmente. Coloque o indicador sobre uma sobrancelha e tente levantá-la contra a resistência por 3 segundos. Alterne os lados. Este exercício cria controle muscular independente e alisa rugas assimétricas.",
    benefits: "Corrige assimetria facial, alisa linhas da testa de forma localizada, melhora controle muscular"
  },
  {
    id: "fb_rugas_testa_03",
    name: "Compressão Frontal com Deslizamento",
    problem: "rugas_testa",
    zone: "Testa",
    duration: "3 min",
    reps: "3×8",
    difficulty: "iniciante",
    image: "/images/exercises/ex_3.jpg",
    video: "",
    videoSteps: [
      "Una os dedos indicador e médio de cada mão no centro da testa",
      "Deslize lentamente para os lados com pressão moderada, alisando a pele",
      "Ao chegar nas têmporas, faça pequenos círculos com pressão leve",
      "Retorne ao centro e repita — cada passada deve durar 4 segundos"
    ],
    instructions: "Técnica de alisamento que combina pressão com deslizamento. Posicione os dedos no centro da testa e deslize para as têmporas com pressão constante. Nas têmporas, faça círculos suaves. Esta técnica estimula a circulação e suaviza rugas por relaxamento muscular.",
    benefits: "Relaxa a musculatura da testa, estimula circulação local, suaviza rugas por descontração muscular"
  },
  {
    id: "fb_rugas_testa_04",
    name: "Yoga Facial — O Pensador",
    problem: "rugas_testa",
    zone: "Testa",
    duration: "2 min",
    reps: "2×12",
    difficulty: "intermediário",
    image: "/images/exercises/ex_4.jpg",
    video: "",
    videoSteps: [
      "Feche os punhos e coloque os nós dos dedos sobre as sobrancelhas",
      "Aplique pressão para baixo enquanto tenta franzir a testa para cima",
      "Mantenha a tensão por 5 segundos — sinta a resistência total",
      "Solte e alise a testa com as palmas abertas em movimento descendente"
    ],
    instructions: "Usando os nós dos dedos sobre as sobrancelhas, aplique pressão para baixo enquanto tenta franzir a testa. Mantenha 5 segundos. Depois, alise com as palmas. Técnica de contraste que tonifica e depois relaxa o músculo frontal.",
    benefits: "Tonifica o músculo corrugador, alisa linhas entre as sobrancelhas, reduz marcas de expressão de preocupação"
  },
  {
    id: "fb_rugas_testa_05",
    name: "Lifting Digital da Testa",
    problem: "rugas_testa",
    zone: "Testa",
    duration: "4 min",
    reps: "3×10",
    difficulty: "avançado",
    image: "/images/exercises/ex_5.png",
    video: "",
    videoSteps: [
      "Coloque as pontas dos 10 dedos ao longo da linha do cabelo",
      "Puxe suavemente a pele para cima e para trás — segure a posição",
      "Com a pele elevada, tente fechar os olhos com força contra a tensão",
      "Mantenha 8 segundos e solte devagar — este é o lifting manual mais poderoso"
    ],
    instructions: "Posicione todos os dedos na linha do cabelo e puxe a pele para cima. Mantendo a tensão, tente fechar os olhos com força. Segure 8 segundos. Simula o efeito de um mini lifting, fortalecendo toda a cadeia muscular da parte superior da face.",
    benefits: "Efeito lifting imediato, fortalece cadeia muscular superior completa, combate ptose gravitacional da testa"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. PÉS DE GALINHA (pes_de_galinha) — 4 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_pes_galinha_01",
    name: "Pressão Orbital Lateral",
    problem: "pes_de_galinha",
    zone: "Olhos",
    duration: "2 min",
    reps: "3×15",
    difficulty: "iniciante",
    image: "/images/exercises/ex_6.png",
    video: "",
    videoSteps: [
      "Coloque os indicadores nas têmporas, ao lado externo dos olhos",
      "Aplique pressão suave mas firme, esticando levemente a pele",
      "Pisque com força contra a resistência, apertando bem os olhos",
      "Repita 15 vezes sentindo o músculo orbicular trabalhando intensamente"
    ],
    instructions: "Posicione os indicadores nas têmporas e aplique pressão lateral. Pisque com força contra a resistência dos dedos, 15 vezes. Este exercício fortalece o músculo orbicular dos olhos e reduz as linhas de expressão laterais (pés de galinha).",
    benefits: "Fortalece músculo orbicular, reduz pés de galinha, melhora a firmeza da pele periorbital"
  },
  {
    id: "fb_pes_galinha_02",
    name: "Círculos de Firmeza Ocular",
    problem: "pes_de_galinha",
    zone: "Olhos",
    duration: "3 min",
    reps: "2×20",
    difficulty: "iniciante",
    image: "/images/exercises/ex_7.png",
    video: "",
    videoSteps: [
      "Use as pontas dos anulares (dedos com menor pressão natural)",
      "Faça movimentos circulares suaves ao redor de toda a órbita ocular",
      "Comece no canto interno, suba pela sobrancelha, desça pelo canto externo",
      "20 círculos completos em cada olho — toque levíssimo, nunca puxe a pele"
    ],
    instructions: "Com as pontas dos anulares, faça círculos suaves ao redor dos olhos: canto interno → sobrancelha → canto externo → abaixo do olho. 20 repetições. Estimula colágeno e drenagem na região mais delicada do rosto.",
    benefits: "Estimula produção de colágeno periorbital, promove micro-drenagem, suaviza linhas finas"
  },
  {
    id: "fb_pes_galinha_03",
    name: "V-Lift dos Olhos",
    problem: "pes_de_galinha",
    zone: "Olhos",
    duration: "3 min",
    reps: "3×10",
    difficulty: "intermediário",
    image: "/images/exercises/ex_8.png",
    video: "",
    videoSteps: [
      "Forme um V com os dedos indicador e médio de cada mão",
      "Coloque o indicador no canto externo e o médio no canto interno de cada olho",
      "Aplique pressão leve e tente apertar os olhos como se estivesse míope",
      "Segure 5 segundos com os olhos semi-cerrados — relaxe e repita"
    ],
    instructions: "Forme um V com os dedos e posicione-os nos cantos dos olhos. Aplique pressão e semicerre os olhos como se estivesse tentando enxergar algo distante. Segure 5 segundos. Técnica do Face Yoga Method que combate pés de galinha e flacidez palpebral.",
    benefits: "Reduz pés de galinha, combate flacidez das pálpebras, define contorno dos olhos"
  },
  {
    id: "fb_pes_galinha_04",
    name: "Acupressão Anti-Rugas Orbital",
    problem: "pes_de_galinha",
    zone: "Olhos",
    duration: "2 min",
    reps: "1×30s por ponto",
    difficulty: "iniciante",
    image: "/images/exercises/ex_9.jpg",
    video: "",
    videoSteps: [
      "Identifique 4 pontos: canto interno, centro da sobrancelha, canto externo, abaixo do olho",
      "Pressione cada ponto com a ponta do dedo médio por 30 segundos",
      "Mantenha pressão firme mas confortável — respire profundamente durante",
      "Ao terminar os 4 pontos, alise a região inteira com movimentos suaves"
    ],
    instructions: "Técnica de acupressão facial. Pressione 4 pontos estratégicos ao redor dos olhos por 30 segundos cada: canto interno, arco da sobrancelha, canto externo e osso sob o olho. Estimula pontos de energia que melhoram circulação e regeneração celular.",
    benefits: "Ativa pontos de acupressão, melhora circulação periorbital, reduz inchaço e linhas finas"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. BIGODE CHINÊS / SULCO NASOGENIANO (bigode_chines) — 5 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_bigode_chines_01",
    name: "Preenchimento Natural do Sulco",
    problem: "bigode_chines",
    zone: "Sulco nasogeniano",
    duration: "4 min",
    reps: "3×10",
    difficulty: "iniciante",
    image: "/images/exercises/ex_10.jpg",
    video: "",
    videoSteps: [
      "Posicione os indicadores ao longo das linhas do nariz até a boca",
      "Aplique pressão suave seguindo o sulco de cima para baixo",
      "Sorria amplamente contra a pressão dos dedos, empurrando os músculos para fora",
      "Massageie em movimentos circulares por 10 segundos ao final de cada série"
    ],
    instructions: "Posicione os indicadores ao longo do sulco nasogeniano (do nariz aos cantos da boca). Aplique pressão e sorria contra a resistência. Depois massageie em círculos. Fortalece os músculos zigomáticos e cria volume natural que preenche o sulco.",
    benefits: "Preenche o sulco nasogeniano naturalmente, fortalece músculos zigomáticos, reduz profundidade das linhas"
  },
  {
    id: "fb_bigode_chines_02",
    name: "Inflação Zigomática",
    problem: "bigode_chines",
    zone: "Sulco nasogeniano",
    duration: "3 min",
    reps: "3×15",
    difficulty: "iniciante",
    image: "/images/exercises/ex_11.jpg",
    video: "",
    videoSteps: [
      "Encha as bochechas de ar ao máximo — boca bem fechada",
      "Transfira todo o ar para a bochecha direita — segure 3 segundos",
      "Transfira para a bochecha esquerda — segure 3 segundos",
      "Transfira para cima do lábio superior — segure 3 segundos e solte"
    ],
    instructions: "Encha as bochechas de ar e transfira de um lado para o outro, segurando 3 segundos de cada lado. Depois direcione o ar para cima do lábio superior. Infla e fortalece os músculos ao redor do sulco nasogeniano, criando volume e sustentação.",
    benefits: "Infla e sustenta os músculos laterais, cria volume nas bochechas, reduz profundidade do bigode chinês"
  },
  {
    id: "fb_bigode_chines_03",
    name: "Sorriso de Resistência Inversa",
    problem: "bigode_chines",
    zone: "Sulco nasogeniano",
    duration: "3 min",
    reps: "3×12",
    difficulty: "intermediário",
    image: "/images/exercises/ex_12.jpg",
    video: "",
    videoSteps: [
      "Coloque os indicadores nos cantos da boca, pressionando levemente",
      "Sorria o mais amplamente possível forçando os cantos para cima",
      "Seus dedos devem criar resistência — não deixe os cantos subirem facilmente",
      "Segure o sorriso máximo por 5 segundos contra a pressão e relaxe"
    ],
    instructions: "Com os indicadores nos cantos da boca criando resistência, force um sorriso máximo. Segure 5 segundos. A resistência obriga os músculos elevadores do lábio a trabalhar mais intensamente, combatendo a queda que causa o bigode chinês.",
    benefits: "Fortalece músculos elevadores do lábio superior, combate a queda dos tecidos, atenua sulco nasogeniano"
  },
  {
    id: "fb_bigode_chines_04",
    name: "Drenagem do Sulco Nasogeniano",
    problem: "bigode_chines",
    zone: "Sulco nasogeniano",
    duration: "3 min",
    reps: "1×20",
    difficulty: "iniciante",
    image: "/images/exercises/ex_13.jpg",
    video: "",
    videoSteps: [
      "Use os polegares posicionados no sulco, logo ao lado do nariz",
      "Deslize firmemente para baixo acompanhando o sulco até o canto da boca",
      "No canto da boca, desvie para a lateral em direção à orelha",
      "Repita 20 vezes — o movimento deve ser fluido e com pressão constante"
    ],
    instructions: "Drenagem específica para o sulco nasogeniano. Deslize os polegares desde o nariz até a boca, depois para a lateral. 20 repetições. Drena líquido retido que acentua o sulco e estimula renovação do colágeno na região.",
    benefits: "Drena retenção de líquido, reduz inchaço que aprofunda o sulco, estimula renovação celular"
  },
  {
    id: "fb_bigode_chines_05",
    name: "Yoga Facial — O Peixe",
    problem: "bigode_chines",
    zone: "Sulco nasogeniano",
    duration: "2 min",
    reps: "3×10",
    difficulty: "intermediário",
    image: "/images/exercises/ex_14.jpg",
    video: "",
    videoSteps: [
      "Sugue as bochechas para dentro como se fizesse cara de peixe",
      "Mantendo as bochechas sugadas, tente sorrir com os cantos da boca",
      "Segure essa posição por 5 segundos — sinta a queimação suave",
      "Relaxe completamente e repita — a queimação indica trabalho muscular eficaz"
    ],
    instructions: "Sugue as bochechas para dentro e tente sorrir ao mesmo tempo. Segure 5 segundos. A contração simultânea trabalha os músculos bucinadores e zigomáticos, tonificando toda a região do bigode chinês.",
    benefits: "Tonifica bucinadores e zigomáticos, cria sustentação natural para o terço médio do rosto"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. FLACIDEZ FACIAL (flacidez) — 5 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_flacidez_01",
    name: "Lifting Natural das Maçãs",
    problem: "flacidez",
    zone: "Maçãs do rosto",
    duration: "3 min",
    reps: "3×15",
    difficulty: "iniciante",
    image: "/images/exercises/ex_15.jpg",
    video: "",
    videoSteps: [
      "Posicione os dedos indicador e médio sobre as maçãs do rosto",
      "Sorria amplamente sentindo os músculos subirem contra os dedos",
      "Pressione as maçãs para cima em direção aos olhos por 3 segundos",
      "Solte lentamente mantendo a tensão — repita com ritmo constante"
    ],
    instructions: "Sorria amplamente e pressione os dedos sobre as maçãs do rosto. Levante as maçãs em direção aos olhos, segurando 3 segundos no topo. Este exercício devolve volume e definição às maçãs, criando um efeito lifting natural que combate a flacidez gravitacional.",
    benefits: "Devolve volume às maçãs, cria efeito lifting natural, combate flacidez gravitacional do terço médio"
  },
  {
    id: "fb_flacidez_02",
    name: "Escultura da Mandíbula",
    problem: "flacidez",
    zone: "Mandíbula",
    duration: "4 min",
    reps: "3×20",
    difficulty: "intermediário",
    image: "/images/exercises/ex_16.jpg",
    video: "",
    videoSteps: [
      "Incline levemente a cabeça para trás, olhando para o teto",
      "Movimente a mandíbula inferior para frente, projetando o queixo",
      "Mantenha os lábios fechados e pressione a língua contra o céu da boca",
      "Segure 3 segundos e volte devagar — sinta o maxilar e pescoço trabalhando"
    ],
    instructions: "Incline a cabeça para trás e projete a mandíbula para frente, com lábios fechados e língua pressionada no céu da boca. Segure 3 segundos. Esculpe o contorno da mandíbula, elimina queixo duplo e combate a flacidez do terço inferior.",
    benefits: "Esculpe contorno mandibular, elimina queixo duplo, firma toda a região inferior do rosto"
  },
  {
    id: "fb_flacidez_03",
    name: "Pressão Isométrica Total",
    problem: "flacidez",
    zone: "Face completa",
    duration: "4 min",
    reps: "2×8",
    difficulty: "avançado",
    image: "/images/exercises/ex_17.jpg",
    video: "",
    videoSteps: [
      "Coloque as palmas inteiras sobre o rosto cobrindo testa, bochechas e mandíbula",
      "Faça força tentando abrir a boca e erguer as sobrancelhas ao mesmo tempo",
      "Resista com as mãos mantendo o rosto completamente imóvel",
      "Segure 10 segundos e relaxe — este é o exercício mais potente contra flacidez"
    ],
    instructions: "Coloque as palmas sobre o rosto e tente abrir a boca e erguer as sobrancelhas simultaneamente, resistindo com as mãos. Segure 10 segundos. O exercício mais completo — trabalha todos os músculos faciais ao mesmo tempo para um lifting global.",
    benefits: "Trabalha todos os 43 músculos faciais simultaneamente, efeito lifting global, combate flacidez generalizada"
  },
  {
    id: "fb_flacidez_04",
    name: "Exercício do Leão (Simhasana Facial)",
    problem: "flacidez",
    zone: "Face completa",
    duration: "2 min",
    reps: "3×5",
    difficulty: "iniciante",
    image: "/images/exercises/ex_18.jpg",
    video: "",
    videoSteps: [
      "Inspire profundamente pelo nariz enchendo os pulmões",
      "Expire pela boca colocando a língua para fora e olhando para cima",
      "Abra os olhos ao máximo e estique todos os músculos do rosto",
      "Mantenha 10 segundos com máxima expressão — depois relaxe completamente"
    ],
    instructions: "Inspire fundo e expire colocando a língua para fora, olhos arregalados, e todos os músculos do rosto esticados ao máximo. Segure 10 segundos. Técnica de yoga (Simhasana) que ativa a circulação, oxigena tecidos e tonifica toda a face.",
    benefits: "Ativa circulação completa do rosto, oxigena tecidos, tonifica e revitaliza toda a musculatura facial"
  },
  {
    id: "fb_flacidez_05",
    name: "Contração e Relaxamento Progressivo",
    problem: "flacidez",
    zone: "Face completa",
    duration: "3 min",
    reps: "3×6",
    difficulty: "intermediário",
    image: "/images/exercises/ex_19.jpg",
    video: "",
    videoSteps: [
      "Contraia TODOS os músculos do rosto apertando olhos, boca e testa ao mesmo tempo",
      "Segure a contração máxima por 5 segundos — sinta cada músculo",
      "Relaxe COMPLETAMENTE deixando o rosto totalmente solto por 5 segundos",
      "Repita o ciclo — o contraste entre tensão e relaxamento tonifica profundamente"
    ],
    instructions: "Contraia todos os músculos faciais ao máximo (olhos, boca, testa) por 5 segundos, depois relaxe completamente por 5 segundos. A alternância de tensão e relaxamento fortalece a musculatura e melhora o tônus de toda a face.",
    benefits: "Fortalece musculatura profunda, melhora tônus facial, combate flacidez por inatividade muscular"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. PÁLPEBRA CAÍDA (palpebra_caida) — 4 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_palpebra_01",
    name: "Elevação Palpebral com Resistência",
    problem: "palpebra_caida",
    zone: "Pálpebras",
    duration: "3 min",
    reps: "3×12",
    difficulty: "iniciante",
    image: "/images/exercises/ex_20.jpg",
    video: "",
    videoSteps: [
      "Coloque os indicadores sob as sobrancelhas, apoiando no osso orbital",
      "Empurre suavemente as sobrancelhas para cima com os dedos",
      "Tente fechar os olhos contra a resistência dos dedos que puxam para cima",
      "Segure 5 segundos na posição semi-fechada e abra devagar — repita"
    ],
    instructions: "Posicione os indicadores sob as sobrancelhas e empurre para cima. Tente fechar os olhos contra essa resistência. Segure 5 segundos. Fortalece o músculo levantador da pálpebra, combatendo a ptose (queda) palpebral com resultados progressivos.",
    benefits: "Fortalece músculo levantador da pálpebra, combate ptose palpebral, abre o olhar"
  },
  {
    id: "fb_palpebra_02",
    name: "Abertura Máxima Controlada",
    problem: "palpebra_caida",
    zone: "Pálpebras",
    duration: "2 min",
    reps: "3×10",
    difficulty: "iniciante",
    image: "/images/exercises/ex_21.jpg",
    video: "",
    videoSteps: [
      "Olhe fixamente para um ponto à frente, mantendo o rosto relaxado",
      "Abra os olhos o máximo possível sem erguer as sobrancelhas",
      "Mantenha os olhos totalmente abertos por 5 segundos — sinta a pálpebra superior",
      "Relaxe e pisque suavemente 5 vezes antes de repetir"
    ],
    instructions: "Abra os olhos o máximo possível sem mover as sobrancelhas. Segure 5 segundos. O segredo é isolar o movimento da pálpebra. Este exercício treina o músculo levantador da pálpebra de forma isolada para máxima eficácia.",
    benefits: "Treina músculo levantador de forma isolada, corrige pálpebra pesada, rejuvenesce o olhar"
  },
  {
    id: "fb_palpebra_03",
    name: "Piscar Potente",
    problem: "palpebra_caida",
    zone: "Pálpebras",
    duration: "2 min",
    reps: "4×20",
    difficulty: "intermediário",
    image: "/images/exercises/ex_22.jpg",
    video: "",
    videoSteps: [
      "Pisque uma vez lentamente, fechando completamente os olhos por 2 segundos",
      "Abra rapidamente e o mais amplamente possível — segure 1 segundo",
      "Pisque novamente rápido e forte, depois abra ao máximo",
      "Repita em ritmo alternado: fecha lento → abre rápido, 20 vezes"
    ],
    instructions: "Alterne entre fechar os olhos lentamente (2 segundos) e abrir rapidamente ao máximo (1 segundo). 20 repetições por série. O contraste de velocidade trabalha as fibras rápidas e lentas do músculo orbicular e levantador.",
    benefits: "Trabalha fibras musculares rápidas e lentas, melhora elasticidade palpebral, combate olhar cansado"
  },
  {
    id: "fb_palpebra_04",
    name: "Yoga Ocular — Olhar do Templo",
    problem: "palpebra_caida",
    zone: "Pálpebras",
    duration: "3 min",
    reps: "2×8",
    difficulty: "avançado",
    image: "/images/exercises/ex_23.jpg",
    video: "",
    videoSteps: [
      "Coloque os médios no canto interno dos olhos e indicadores no canto externo",
      "Aplique pressão leve formando um óculos com os dedos ao redor dos olhos",
      "Olhe para cima e tente levantar as pálpebras inferiores (movimento de apertar)",
      "Segure 10 segundos sentindo a pálpebra superior subir — relaxe e repita"
    ],
    instructions: "Forme um 'óculos' com os dedos ao redor dos olhos. Olhe para cima e tente levantar as pálpebras inferiores. Segure 10 segundos. Técnica avançada que fortalece toda a musculatura orbital para pálpebras mais firmes e olhar aberto.",
    benefits: "Fortalece toda a musculatura orbital, levanta pálpebras, cria olhar mais aberto e jovem"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 6. MANCHAS E TEXTURA DA PELE (manchas_textura) — 4 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_manchas_01",
    name: "Drenagem Linfática Geral",
    problem: "manchas_textura",
    zone: "Rosto completo",
    duration: "5 min",
    reps: "1×30",
    difficulty: "iniciante",
    image: "/images/exercises/ex_24.jpg",
    video: "",
    videoSteps: [
      "Use os nós dos dedos para deslizar do centro do rosto para as orelhas",
      "Repita da testa ao queixo, sempre em direção às orelhas",
      "Desça pelo pescoço até as clavículas com pressão leve mas constante",
      "Repita 30 vezes toda a sequência — sinta o rosto desinchar progressivamente"
    ],
    instructions: "Técnica de drenagem linfática facial completa. Deslize do centro para as orelhas, depois desça pelo pescoço até as clavículas. 30 repetições. A drenagem elimina toxinas, reduz inchaço e melhora a luminosidade da pele uniformizando o tom.",
    benefits: "Elimina toxinas, reduz inchaço, melhora luminosidade, uniformiza tom da pele"
  },
  {
    id: "fb_manchas_02",
    name: "Estimulação Circulatória por Percussão",
    problem: "manchas_textura",
    zone: "Rosto completo",
    duration: "3 min",
    reps: "1×60s",
    difficulty: "iniciante",
    image: "/images/exercises/ex_25.jpg",
    video: "",
    videoSteps: [
      "Use as pontas dos dedos para dar tapinhas leves e rápidos em todo o rosto",
      "Comece pela testa — passe pelas bochechas — desça pela mandíbula",
      "Não pule nenhuma região — cubra todo o rosto uniformemente",
      "Continue por 60 segundos — o rosto deve ficar rosado (sinal de boa circulação)"
    ],
    instructions: "Percussão facial suave com pontas dos dedos em todo o rosto por 60 segundos. O movimento rápido e leve estimula a circulação sanguínea, trazendo nutrientes e oxigênio para a superfície da pele, melhorando textura e luminosidade.",
    benefits: "Estimula microcirculação, traz nutrientes à superfície, melhora textura e brilho natural da pele"
  },
  {
    id: "fb_manchas_03",
    name: "Massagem de Pontos de Luz",
    problem: "manchas_textura",
    zone: "Rosto completo",
    duration: "4 min",
    reps: "1×45s por zona",
    difficulty: "intermediário",
    image: "/images/exercises/ex_26.jpg",
    video: "",
    videoSteps: [
      "Identifique os pontos altos do rosto: ponte do nariz, maçãs, arco de cupido, queixo",
      "Em cada ponto, faça pequenos círculos com pressão média por 45 segundos",
      "Esses são os pontos onde a luz reflete — estimulá-los cria glow natural",
      "Finalize passando gelo enrolado em pano sobre os mesmos pontos por 10 segundos"
    ],
    instructions: "Massageie os pontos altos do rosto (ponte do nariz, maçãs, arco do cupido, queixo) em círculos por 45 segundos cada. Finalize com gelo embrulhado em pano. Estimula circulação nos pontos de reflexão de luz, criando o efeito glass skin.",
    benefits: "Cria efeito glass skin, estimula circulação nos pontos de destaque, uniformiza textura"
  },
  {
    id: "fb_manchas_04",
    name: "Automassagem de Renovação Celular",
    problem: "manchas_textura",
    zone: "Rosto completo",
    duration: "4 min",
    reps: "1×3 min",
    difficulty: "intermediário",
    image: "/images/exercises/ex_27.jpg",
    video: "",
    videoSteps: [
      "Aplique seu sérum ou óleo facial habitual como meio deslizante",
      "Com as palmas, faça movimentos ascendentes do queixo à testa — 20 vezes",
      "Com os nós dos dedos, faça movimentos laterais da linha central às orelhas — 20 vezes",
      "Finalize pressionando as palmas quentes sobre todo o rosto por 10 segundos"
    ],
    instructions: "Com sérum ou óleo facial, faça movimentos ascendentes e laterais cobrindo todo o rosto. 20 passadas em cada direção. Finalize com palmas quentes pressionadas por 10 segundos. Potencializa a absorção dos ativos e estimula renovação celular.",
    benefits: "Potencializa absorção de skincare, estimula renovação celular, melhora textura e luminosidade"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 7. PERDA DE TÔNUS / MÚSCULO DERRETENDO (perda_tonus) — 5 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_tonus_01",
    name: "Bombeio Facial Completo",
    problem: "perda_tonus",
    zone: "Face completa",
    duration: "3 min",
    reps: "3×10",
    difficulty: "intermediário",
    image: "/images/exercises/ex_28.jpg",
    video: "",
    videoSteps: [
      "Abra a boca formando um O grande, cobrindo os dentes com os lábios",
      "Com a boca em O, sorria puxando os cantos da boca para cima ao máximo",
      "Coloque os indicadores nas maçãs e empurre para cima enquanto mantém o O",
      "Segure 10 segundos no topo — depois solte lentamente a posição"
    ],
    instructions: "Abra a boca em O, cobrindo os dentes. Sorria puxando os cantos para cima mantendo o O, e empurre as maçãs com os dedos. Segure 10 segundos. Este bombeio facial ativa grupos musculares profundos e restaura o volume perdido pela idade.",
    benefits: "Ativa musculatura profunda, restaura volume perdido, reconstrói tônus facial"
  },
  {
    id: "fb_tonus_02",
    name: "Resistência das Bochechas",
    problem: "perda_tonus",
    zone: "Bochechas",
    duration: "3 min",
    reps: "3×12",
    difficulty: "iniciante",
    image: "/images/exercises/ex_29.jpg",
    video: "",
    videoSteps: [
      "Encha as bochechas de ar ao máximo — boca bem selada",
      "Use as palmas das mãos para pressionar as bochechas cheias de ar",
      "Resista à compressão — não deixe o ar escapar mesmo com pressão forte",
      "Mantenha 5 segundos sob pressão máxima e solte — repita"
    ],
    instructions: "Encha as bochechas de ar e pressione com as palmas. Resista à compressão sem soltar o ar por 5 segundos. A resistência isométrica das bochechas infladas é uma das técnicas mais eficazes para reconstruir tônus nos músculos zigomáticos.",
    benefits: "Reconstrói tônus dos zigomáticos, restaura volume das bochechas, combate face afinada pela idade"
  },
  {
    id: "fb_tonus_03",
    name: "Exercício do Trompete",
    problem: "perda_tonus",
    zone: "Lábios e bochechas",
    duration: "2 min",
    reps: "3×10",
    difficulty: "iniciante",
    image: "/images/exercises/ex_30.jpg",
    video: "",
    videoSteps: [
      "Faça um biquinho exagerado projetando os lábios o máximo para frente",
      "Mantenha o biquinho e sopre com força como se tocasse um trompete",
      "Sinta as bochechas e os lábios queimando pela contração intensa",
      "Segure 5 segundos soprando e relaxe — repita sem perder a intensidade"
    ],
    instructions: "Faça um biquinho máximo e sopre com força como um trompete, segurando 5 segundos. O movimento ativa profundamente o músculo orbicular da boca e os bucinadores, combatendo a perda de tônus ao redor da boca.",
    benefits: "Ativa orbicular da boca, tonifica bucinadores, combate perda de definição labial"
  },
  {
    id: "fb_tonus_04",
    name: "Contração Profunda da Face Inferior",
    problem: "perda_tonus",
    zone: "Mandíbula e queixo",
    duration: "3 min",
    reps: "3×8",
    difficulty: "avançado",
    image: "/images/exercises/ex_31.jpg",
    video: "",
    videoSteps: [
      "Abra a boca moderadamente e dobre o lábio inferior sobre os dentes de baixo",
      "Projete a mandíbula para frente sentindo a tensão no queixo",
      "Coloque o polegar sob o queixo e resista ao movimento da mandíbula",
      "Segure 8 segundos com máxima contração — este é o exercício mais intenso"
    ],
    instructions: "Dobre o lábio inferior sobre os dentes, projete a mandíbula e resista com o polegar sob o queixo por 8 segundos. Ativa o platisma e o mentoniano — músculos profundos que quando tonificados eliminam o efeito de rosto derretendo.",
    benefits: "Tonifica platisma e mentoniano, elimina efeito de rosto derretendo, redefine contorno inferior"
  },
  {
    id: "fb_tonus_05",
    name: "Face Building — Série Completa",
    problem: "perda_tonus",
    zone: "Face completa",
    duration: "5 min",
    reps: "2×5 de cada",
    difficulty: "avançado",
    image: "/images/exercises/ex_32.jpg",
    video: "",
    videoSteps: [
      "1. Erga as sobrancelhas ao máximo + abra a boca em O — segure 5s",
      "2. Aperte todos os músculos do rosto como se chupasse limão — segure 5s",
      "3. Abra tudo ao máximo (olhos, boca, língua para fora) — segure 5s",
      "4. Faça 'bochecho seco' com movimentos amplos de mandíbula — 10 vezes"
    ],
    instructions: "Série completa de face building com 4 movimentos sequenciais: abertura máxima, contração máxima, expansão completa e bochecho seco. 5 repetições de cada. É o treino mais completo para reconstrução muscular facial.",
    benefits: "Reconstrução muscular completa, reverte perda de tônus generalizada, rejuvenescimento estrutural"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 8. PAPADA / QUEIXO DUPLO (papada) — 4 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_papada_01",
    name: "Firmeza do Pescoço — Platisma",
    problem: "papada",
    zone: "Pescoço",
    duration: "3 min",
    reps: "3×12",
    difficulty: "iniciante",
    image: "/images/exercises/ex_1.jpg",
    video: "",
    videoSteps: [
      "Sente-se ereta e olhe para o teto inclinando a cabeça devagar",
      "Pressione firmemente a língua contra o céu da boca",
      "Sinta toda a região do pescoço e queixo se contraindo intensamente",
      "Mantenha 5 segundos e volte lentamente — repita com cuidado"
    ],
    instructions: "Olhe para cima e pressione a língua no céu da boca com força por 5 segundos. Toda a região sub-mental e do pescoço se contrai. Este exercício ativa o platisma e combate a papada fortalecendo a base do rosto.",
    benefits: "Ativa o platisma, combate papada, fortalece base muscular do rosto e pescoço"
  },
  {
    id: "fb_papada_02",
    name: "Beijo no Teto",
    problem: "papada",
    zone: "Pescoço",
    duration: "2 min",
    reps: "3×10",
    difficulty: "iniciante",
    image: "/images/exercises/ex_2.png",
    video: "",
    videoSteps: [
      "Incline a cabeça para trás olhando diretamente para o teto",
      "Projete os lábios como se fosse dar um beijo no teto — biquinho máximo",
      "Sinta a contração intensa sob o queixo e ao longo do pescoço",
      "Mantenha o beijo por 5 segundos e volte à posição neutra — repita"
    ],
    instructions: "Olhe para o teto e faça biquinho como se fosse beijar o teto. Segure 5 segundos sentindo a contração sob o queixo. Exercício clássico da Face Yoga que é extremamente eficaz para eliminar papada e definir o ângulo mandíbula-pescoço.",
    benefits: "Elimina papada, define ângulo mandíbula-pescoço, fortalece musculatura sub-mental"
  },
  {
    id: "fb_papada_03",
    name: "Exercício da Mandíbula com Resistência",
    problem: "papada",
    zone: "Mandíbula",
    duration: "3 min",
    reps: "3×10",
    difficulty: "intermediário",
    image: "/images/exercises/ex_3.jpg",
    video: "",
    videoSteps: [
      "Coloque o punho fechado sob o queixo",
      "Tente abrir a boca empurrando o queixo para baixo contra o punho",
      "Resista com o punho — a boca não deve abrir (contração isométrica pura)",
      "Segure 8 segundos em máxima tensão e relaxe — repita"
    ],
    instructions: "Punho sob o queixo, tente abrir a boca contra a resistência do punho (a boca não abre). Segure 8 segundos. Isometria pura que fortalece masseter, digástrico e milo-hioideo — os músculos que sustentam o ângulo da mandíbula.",
    benefits: "Fortalece masseter e digástrico, define ângulo da mandíbula, elimina queixo duplo"
  },
  {
    id: "fb_papada_04",
    name: "Drenagem Cervical Anti-Papada",
    problem: "papada",
    zone: "Pescoço",
    duration: "4 min",
    reps: "1×20",
    difficulty: "iniciante",
    image: "/images/exercises/ex_4.jpg",
    video: "",
    videoSteps: [
      "Com as costas dos dedos, deslize de baixo do queixo em direção à orelha",
      "Alterne os lados — 10 passadas de cada lado",
      "Depois deslize da orelha até a clavícula com pressão constante",
      "Finalize com movimentos circulares suaves acima das clavículas (linfonodos)"
    ],
    instructions: "Drenagem específica para papada. Deslize do queixo às orelhas, depois das orelhas às clavículas. Finalize com círculos sobre os linfonodos supraclaviculares. Remove retenção de líquido que acentua a papada.",
    benefits: "Remove retenção de líquido, desinfla a região sub-mental, complementa os exercícios de tonificação"
  },

  // ═══════════════════════════════════════════════════════════════════
  // 9. OLHEIRAS E BOLSAS (olheiras) — 3 exercícios
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "fb_olheiras_01",
    name: "Drenagem Periorbital",
    problem: "olheiras",
    zone: "Olhos",
    duration: "3 min",
    reps: "1×20",
    difficulty: "iniciante",
    image: "/images/exercises/ex_5.png",
    video: "",
    videoSteps: [
      "Use os anulares (menor pressão natural) sob os olhos",
      "Deslize suavemente do canto interno para o canto externo do olho",
      "No canto externo, desça em direção à orelha com pressão levíssima",
      "Repita 20 vezes em cada olho — o toque deve ser delicado como pluma"
    ],
    instructions: "Drenagem linfática específica para olheiras. Com os anulares, deslize do canto interno ao externo, depois para a orelha. 20 repetições por olho com toque delicadíssimo. Remove líquido acumulado que causa bolsas e olheiras por congestão.",
    benefits: "Remove líquido acumulado, reduz bolsas e olheiras, descongestiona a região periorbital"
  },
  {
    id: "fb_olheiras_02",
    name: "Compressão Térmica Alternada",
    problem: "olheiras",
    zone: "Olhos",
    duration: "4 min",
    reps: "1×5 ciclos",
    difficulty: "iniciante",
    image: "/images/exercises/ex_6.png",
    video: "",
    videoSteps: [
      "Prepare colheres: uma em água gelada e uma em água morna (não quente)",
      "Aplique a colher gelada sob os olhos por 30 segundos",
      "Troque pela colher morna por 30 segundos",
      "Alterne 5 vezes — o contraste térmico ativa circulação e drena"
    ],
    instructions: "Alterne colheres geladas e mornas sob os olhos, 30 segundos cada, 5 ciclos. O contraste térmico provoca vasoconstrição e vasodilatação alternadas, bombeando o sangue e drenando a região periorbital de forma intensa.",
    benefits: "Drena bolsas intensamente, reduz pigmentação das olheiras, ativa circulação por contraste térmico"
  },
  {
    id: "fb_olheiras_03",
    name: "Yoga Ocular Anti-Inchaço",
    problem: "olheiras",
    zone: "Olhos",
    duration: "2 min",
    reps: "2×10",
    difficulty: "intermediário",
    image: "/images/exercises/ex_7.png",
    video: "",
    videoSteps: [
      "Feche os olhos e olhe para baixo sem mover a cabeça",
      "Lentamente, mova os olhos para cima (ainda fechados) até olhar para o teto",
      "Abra os olhos arregalados quando chegar ao topo — segure 3 segundos",
      "Feche e repita — este ciclo bombeia o fluido estagnado da região"
    ],
    instructions: "Com olhos fechados, mova-os de baixo para cima e abra arregalados no topo por 3 segundos. Feche e repita. O movimento bomba fluidos estagnados e ativa os músculos que sustentam a pele sob os olhos.",
    benefits: "Bombeia fluidos estagnados, ativa músculos de sustentação da pele sob os olhos, reduz inchaço matinal"
  },
];

export default exercisesBank;

// ─── Utilitários do Banco ──────────────────────────────────────────

/** Retorna todos os problemas únicos disponíveis */
export function getAllProblems() {
  const problems = [...new Set(exercisesBank.map(e => e.problem))];
  return problems;
}

/** Retorna exercícios filtrados por problema */
export function getExercisesByProblem(problem) {
  return exercisesBank.filter(e => e.problem === problem);
}

/** Retorna exercícios filtrados por zona */
export function getExercisesByZone(zone) {
  return exercisesBank.filter(e => e.zone.toLowerCase().includes(zone.toLowerCase()));
}

/** Retorna exercícios filtrados por dificuldade */
export function getExercisesByDifficulty(difficulty) {
  return exercisesBank.filter(e => e.difficulty === difficulty);
}

/** Mapa de labels legíveis para os problemas */
export const problemLabels = {
  rugas_testa: "Rugas na Testa",
  pes_de_galinha: "Pés de Galinha",
  bigode_chines: "Bigode Chinês",
  flacidez: "Flacidez Facial",
  palpebra_caida: "Pálpebra Caída",
  manchas_textura: "Manchas e Textura",
  perda_tonus: "Perda de Tônus Muscular",
  papada: "Papada / Queixo Duplo",
  olheiras: "Olheiras e Bolsas",
};
