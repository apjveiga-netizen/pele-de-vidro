/* ══════════════════════════════════════════════════════════════════════
   MOTOR DE PROTOCOLO INTELIGENTE — PELE DE VIDRO

   Mapeia zonas do scan → problemas faciais → exercícios recomendados.
   Gera protocolo personalizado de 8-12 exercícios.
   ══════════════════════════════════════════════════════════════════════ */

import exercisesBank from "./exercisesBank.js";

// ─── Mapeamento: zona do scan → problemas faciais ──────────────────

const zoneToProblems = {
  // Zonas detectadas pelo ResultScreen
  "Maçãs do rosto":                ["flacidez", "perda_tonus"],
  "Contorno da mandíbula":         ["flacidez", "papada", "perda_tonus"],
  "Testa / linhas de expressão":   ["rugas_testa"],
  "Pescoço":                       ["papada", "flacidez"],
  // Zonas extras para futura expansão do scanner
  "Olhos":                         ["pes_de_galinha", "palpebra_caida", "olheiras"],
  "Pálpebras":                     ["palpebra_caida", "pes_de_galinha"],
  "Região periorbital":            ["pes_de_galinha", "olheiras"],
  "Sulco nasogeniano":             ["bigode_chines"],
  "Lábios":                        ["bigode_chines", "perda_tonus"],
  "Bochechas":                     ["flacidez", "perda_tonus"],
  "Textura da pele":               ["manchas_textura"],
  "Rosto completo":                ["flacidez", "perda_tonus", "manchas_textura"],
  "Face completa":                 ["flacidez", "perda_tonus", "manchas_textura"],
  "Mandíbula":                     ["papada", "flacidez"],
};

// ─── Mapeamento de severidade → quantidade de exercícios ───────────

function getExerciseCount(severity) {
  if (severity >= 70) return 3;  // Severidade alta: mais exercícios
  if (severity >= 40) return 2;  // Severidade média
  return 1;                       // Severidade baixa
}

// ─── Gerador do Protocolo ──────────────────────────────────────────

/**
 * Gera um protocolo personalizado baseado nas zonas detectadas pelo scan.
 * 
 * @param {Array} zones - Array de zonas do scan: [{ zone, severity, label }]
 * @returns {Object} Protocolo com exercícios selecionados
 */
export function generateProtocol(zones) {
  const selectedIds = new Set();
  const protocolExercises = [];
  const detectedProblems = new Set();

  // Para cada zona detectada, encontrar problemas e selecionar exercícios
  for (const zoneData of zones) {
    const { zone, severity } = zoneData;
    const problems = zoneToProblems[zone] || [];
    const exerciseCount = getExerciseCount(severity);

    for (const problem of problems) {
      detectedProblems.add(problem);
      
      // Buscar exercícios deste problema
      const available = exercisesBank.filter(
        (ex) => ex.problem === problem && !selectedIds.has(ex.id)
      );

      if (available.length === 0) continue;

      // Selecionar mix de dificuldades: priorizar iniciante, depois intermediário
      const sorted = available.sort((a, b) => {
        const order = { iniciante: 0, "intermediário": 1, avançado: 2 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      });

      const toSelect = sorted.slice(0, exerciseCount);
      for (const ex of toSelect) {
        if (!selectedIds.has(ex.id)) {
          selectedIds.add(ex.id);
          protocolExercises.push({ ...ex });
        }
      }
    }
  }

  // Garantir mínimo de 4 e máximo de 5 exercícios
  // Se muito poucos, adicionar drenagem e tonificação geral
  if (protocolExercises.length < 4) {
    const extras = exercisesBank.filter(
      (ex) =>
        !selectedIds.has(ex.id) &&
        (ex.problem === "manchas_textura" || ex.problem === "perda_tonus") &&
        ex.difficulty === "iniciante"
    );
    for (const ex of extras) {
      if (protocolExercises.length >= 5) break;
      selectedIds.add(ex.id);
      protocolExercises.push({ ...ex });
    }
  }

  // Se ainda poucos, adicionar flacidez geral
  if (protocolExercises.length < 4) {
    const extras = exercisesBank.filter(
      (ex) => !selectedIds.has(ex.id) && ex.problem === "flacidez"
    );
    for (const ex of extras) {
      if (protocolExercises.length >= 5) break;
      selectedIds.add(ex.id);
      protocolExercises.push({ ...ex });
    }
  }

  // Se exceder 5, cortar os de menor prioridade
  const finalExercises = protocolExercises.slice(0, 5);

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    zones: zones.map((z) => z.zone),
    problems: [...detectedProblems],
    exercises: finalExercises,
    totalExercises: finalExercises.length,
  };
}

/**
 * Retorna os detalhes de problema de forma legível.
 */
export const problemLabels = {
  rugas_testa: { label: "Rugas na Testa", emoji: "📐", color: "#D4B87A" },
  pes_de_galinha: { label: "Pés de Galinha", emoji: "👁️", color: "#C4907A" },
  bigode_chines: { label: "Bigode Chinês", emoji: "💋", color: "#C9A96E" },
  flacidez: { label: "Flacidez Facial", emoji: "🔻", color: "#C47A7A" },
  palpebra_caida: { label: "Pálpebra Caída", emoji: "👀", color: "#8C7B6B" },
  manchas_textura: { label: "Manchas e Textura", emoji: "✨", color: "#7DAA8A" },
  perda_tonus: { label: "Perda de Tônus", emoji: "💪", color: "#C47A7A" },
  papada: { label: "Papada", emoji: "🦢", color: "#C4907A" },
  olheiras: { label: "Olheiras e Bolsas", emoji: "🌙", color: "#8C7B6B" },
};
