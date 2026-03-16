/* ── Store de Dados — CRUD com localStorage ── */

const KEYS = {
  exercises: "pdv_exercises",
  profile: "pdv_profile",
  scans: "pdv_scans",
  dailyProgress: "pdv_daily_progress",
  streak: "pdv_streak",
  hasOnboarded: "pdv_onboarded",
  protocol: "pdv_protocol",
};

function get(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── EXERCÍCIOS (CRUD) ────────────────────────────────────────────

const defaultExercises = [
  {
    id: "ex1",
    name: "Levantar as maçãs",
    duration: "3 min",
    reps: "3×15",
    zone: "Maçãs",
    image: "/images/exercises/cheeks.png",
    videoSteps: [
      "Posicione os dedos indicador e médio sobre as maçãs do rosto",
      "Sorria amplamente sentindo os músculos subirem contra os dedos",
      "Pressione as maçãs para cima em direção aos olhos por 2 segundos",
      "Solte lentamente mantendo a tensão — repita com ritmo constante",
    ],
    instructions: "Sorria amplamente e pressione os dedos sobre as maçãs do rosto. Levante as maçãs em direção aos olhos, segurando 2 segundos no topo. Desça lentamente e repita. Este exercício devolve volume e definição às maçãs, criando um efeito lifting natural.",
  },
  {
    id: "ex2",
    name: "Definir a mandíbula",
    duration: "4 min",
    reps: "3×20",
    zone: "Mandíbula",
    image: "/images/exercises/jawline.png",
    videoSteps: [
      "Incline levemente a cabeça para trás, olhando para o teto",
      "Movimente a mandíbula inferior para frente, sentindo a tensão",
      "Mantenha os lábios fechados e pressione a língua contra o céu da boca",
      "Segure 3 segundos e volte devagar — sinta o maxilar trabalhar",
    ],
    instructions: "Incline a cabeça ligeiramente para trás. Projete a mandíbula para frente, mantendo os lábios fechados e a língua pressionada contra o céu da boca. Segure 3 segundos e volte. Este movimento esculpe o contorno do rosto e elimina o queixo duplo.",
  },
  {
    id: "ex3",
    name: "Suavizar as rugas da testa",
    duration: "2 min",
    reps: "2×10",
    zone: "Testa",
    image: "/images/exercises/forehead.png",
    videoSteps: [
      "Coloque ambas as mãos espalmadas na testa, dedos para os lados",
      "Aplique pressão suave mas firme sobre toda a superfície",
      "Tente erguer as sobrancelhas contra a resistência das mãos",
      "Segure 5 segundos no topo e relaxe — sinta a pele alisar",
    ],
    instructions: "Coloque os dedos espalmados na testa e aplique pressão firme. Tente levantar as sobrancelhas contra a resistência dos dedos — segure 5 segundos no ponto máximo. Este exercício suaviza linhas horizontais e previne novas rugas.",
  },
  {
    id: "ex4",
    name: "Firmar o pescoço",
    duration: "3 min",
    reps: "3×12",
    zone: "Pescoço",
    image: "/images/exercises/neck.png",
    videoSteps: [
      "Sente-se ereta e olhe para o teto inclinando a cabeça devagar",
      "Pressione firmemente a língua contra o céu da boca",
      "Sinta toda a região do pescoço e queixo se contraindo",
      "Mantenha 5 segundos e volte lentamente — repita com cuidado",
    ],
    instructions: "Olhe para cima inclinando a cabeça devagar. Pressione a língua contra o céu da boca com força e segure 5 segundos. Sinta toda a região sob o queixo e pescoço se contraindo. Este exercício combate a flacidez e define o ângulo do pescoço.",
  },
  {
    id: "ex5",
    name: "Contorno dos olhos",
    duration: "2 min",
    reps: "2×20",
    zone: "Olhos",
    image: "/images/exercises/eyes.png",
    videoSteps: [
      "Coloque os indicadores nas têmporas, ao lado externo dos olhos",
      "Aplique pressão leve e tente fechar os olhos apertando forte",
      "Resista com os dedos, mantendo a pele esticada",
      "Pisque 20 vezes contra a resistência — sinta os músculos ao redor",
    ],
    instructions: "Coloque os indicadores na parte externa dos olhos, nas têmporas. Pisque com força contra a resistência dos dedos, 20 vezes. Este exercício reduz olheiras, pés de galinha e levanta as pálpebras caídas.",
  },
  {
    id: "ex6",
    name: "Lábios e bochechas",
    duration: "3 min",
    reps: "3×15",
    zone: "Lábios",
    image: "/images/exercises/lips.png",
    videoSteps: [
      "Faça um biquinho exagerado projetando os lábios para frente",
      "Mova os lábios fechados para a esquerda — segure 2 segundos",
      "Agora mova para a direita — segure 2 segundos",
      "Encha as bochechas de ar e passe de um lado para outro 15 vezes",
    ],
    instructions: "Faça um biquinho e movimente os lábios de um lado para o outro, segurando 2 segundos de cada lado. Depois encha as bochechas de ar e transfira o ar de uma bochecha para a outra, 15 vezes. Este exercício volumiza os lábios e tonifica as bochechas.",
  },
  {
    id: "ex7",
    name: "Levantamento do Sorriso",
    duration: "3 min",
    reps: "3×12",
    zone: "Sorriso",
    image: "/images/exercises/cheeks.png",
    videoSteps: [
      "Sorria o mais amplamente possível sem abrir os lábios",
      "Use os dedos indicadores para pressionar os cantos da boca para cima",
      "Resista com os músculos do rosto tentando puxar os cantos para baixo",
      "Segure 5 segundos e relaxe — repita sentindo o queimar leve",
    ],
    instructions: "Sorria amplamente sem abrir os lábios. Use os indicadores para empurrar os cantos da boca para cima enquanto resiste com os músculos faciais. Segure 5 segundos. Este exercício combate a queda natural dos cantos da boca e cria um sorriso mais jovem.",
  },
  {
    id: "ex8",
    name: "Suavização do bigode chinês",
    duration: "4 min",
    reps: "3×10",
    zone: "Sulco nasogeniano",
    image: "/images/exercises/lips.png",
    videoSteps: [
      "Posicione os indicadores ao longo das linhas do nariz até a boca",
      "Aplique pressão suave seguindo o sulco de cima para baixo",
      "Sorria contra a pressão dos dedos, empurrando os músculos",
      "Massageie por 10 segundos em movimentos circulares — repita",
    ],
    instructions: "Posicione os indicadores ao longo do sulco nasogeniano (do nariz até os cantos da boca). Aplique pressão e sorria contra a resistência. Depois massageie em movimentos circulares por 10 segundos. Este exercício suaviza as marcas de expressão mais visíveis.",
  },
  {
    id: "ex9",
    name: "Drenagem facial",
    duration: "5 min",
    reps: "1×30",
    zone: "Rosto completo",
    image: "/images/exercises/jawline.png",
    videoSteps: [
      "Use os nós dos dedos para deslizar do centro do rosto para as orelhas",
      "Repita da testa ao queixo, sempre em direção às orelhas",
      "Desça pelo pescoço até as clavículas com pressão leve",
      "Repita 30 vezes toda a sequência — sinta o rosto desinchar",
    ],
    instructions: "Técnica de drenagem linfática facial. Use os nós dos dedos para deslizar do centro do rosto para as orelhas, depois desça pelo pescoço até as clavículas. Repita 30 vezes. Ideal para fazer ao acordar — reduz inchaço e define os contornos do rosto imediatamente.",
  },
  {
    id: "ex10",
    name: "Pressão isométrica",
    duration: "4 min",
    reps: "2×15",
    zone: "Face completa",
    image: "/images/exercises/forehead.png",
    videoSteps: [
      "Coloque as palmas inteiras sobre o rosto cobrindo testa e bochechas",
      "Faça força tentando abrir a boca e erguer as sobrancelhas ao mesmo tempo",
      "Resista com as mãos mantendo o rosto imóvel",
      "Segure 10 segundos e relaxe — este é o exercício mais potente",
    ],
    instructions: "Coloque as palmas sobre o rosto cobrindo testa e bochechas. Tente abrir a boca e erguer as sobrancelhas ao mesmo tempo, resistindo com as mãos. Segure 10 segundos. Este é o exercício mais completo — trabalha todos os músculos faciais simultaneamente para um lifting total.",
  },
];

export function getExercises() {
  return get(KEYS.exercises, defaultExercises);
}

export function saveExercises(list) {
  set(KEYS.exercises, list);
}

export function addExercise({ name, duration, reps, zone, instructions, image, videoSteps }) {
  const list = getExercises();
  const newEx = {
    id: generateId(),
    name,
    duration,
    reps,
    zone,
    instructions: instructions || "",
    image: image || "",
    videoSteps: videoSteps || [],
  };
  list.push(newEx);
  saveExercises(list);
  return newEx;
}

export function updateExercise(id, data) {
  const list = getExercises();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  saveExercises(list);
  return list[idx];
}

export function deleteExercise(id) {
  const list = getExercises().filter((e) => e.id !== id);
  saveExercises(list);
  return list;
}

export function getExerciseById(id) {
  return getExercises().find((e) => e.id === id) || null;
}

// ─── PERFIL ──────────────────────────────────────────────────────────

const defaultProfile = { name: "Usuária", age: 30, avatarUrl: "" };

export function getProfile() {
  return get(KEYS.profile, defaultProfile);
}

export function saveProfile(data) {
  set(KEYS.profile, { ...getProfile(), ...data });
}

// ─── ONBOARDING ─────────────────────────────────────────────────────

export function hasOnboarded() {
  return get(KEYS.hasOnboarded, false);
}

export function setOnboarded() {
  set(KEYS.hasOnboarded, true);
}

// ─── SCANS (HISTÓRICO) ─────────────────────────────────────────────

export function getScans() {
  return get(KEYS.scans, []);
}

export function addScan({ realAge, visualAge, zones }) {
  const scans = getScans();
  const newScan = {
    id: generateId(),
    date: new Date().toISOString(),
    realAge,
    visualAge,
    zones: zones || [],
  };
  scans.unshift(newScan);
  set(KEYS.scans, scans);
  return newScan;
}

export function deleteScan(id) {
  const scans = getScans().filter((s) => s.id !== id);
  set(KEYS.scans, scans);
  return scans;
}

// ─── PROGRESSO DIÁRIO ───────────────────────────────────────────────

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyProgress() {
  const data = get(KEYS.dailyProgress, {});
  const today = getTodayKey();
  return data[today] || [];
}

export function toggleExerciseDone(exerciseId) {
  const data = get(KEYS.dailyProgress, {});
  const today = getTodayKey();
  const todayList = data[today] || [];

  if (todayList.includes(exerciseId)) {
    data[today] = todayList.filter((id) => id !== exerciseId);
  } else {
    data[today] = [...todayList, exerciseId];
  }
  set(KEYS.dailyProgress, data);
  updateStreak();
  return data[today];
}

export function isExerciseDone(exerciseId) {
  return getDailyProgress().includes(exerciseId);
}

// ─── STREAK ──────────────────────────────────────────────────────────

function updateStreak() {
  const data = get(KEYS.dailyProgress, {});
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (data[key] && data[key].length > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  set(KEYS.streak, streak);
}

export function getStreak() {
  return get(KEYS.streak, 0);
}

// ─── PROTOCOLO PERSONALIZADO ────────────────────────────────────────

export function saveProtocol(protocol) {
  set(KEYS.protocol, protocol);
}

export function getProtocol() {
  return get(KEYS.protocol, null);
}

export function clearProtocol() {
  localStorage.removeItem(KEYS.protocol);
}

/** Retorna exercícios do protocolo ativo, ou defaultExercises se não houver */
export function getActiveExercises() {
  const protocol = getProtocol();
  if (protocol && protocol.exercises && protocol.exercises.length > 0) {
    return protocol.exercises;
  }
  return getExercises();
}

// ─── RESET ──────────────────────────────────────────────────────────

export function resetAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
