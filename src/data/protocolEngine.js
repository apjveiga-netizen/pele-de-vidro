import exercisesBank from "./exercisesBank.js";
import { recipesBank } from "./recipesBank.js";

// ─── Mapeamento: zona do scan → problemas faciais ──────────────────

const zoneToProblems = {
  // Zonas detectadas pelo ResultScreen
  "Maçãs do rosto":                ["flacidez", "perda_tonus"],
  "Contorno da mandíbula":         ["flacidez", "papada", "perda_tonus"],
  "Testa":                         ["rugas_testa"],
  "Pescoço":                       ["papada", "flacidez"],
  "Olhos":                         ["pes_de_galinha", "palpebra_caida", "olheiras"],
  "Pálpebras":                     ["palpebra_caida", "pes_de_galinha"],
  "Região periorbital":            ["pes_de_galinha", "olheiras"],
  "Sulco Nasogeniano":             ["bigode_chines"],
  "Lábios":                        ["bigode_chines", "perda_tonus"],
  "Bochechas":                     ["flacidez", "perda_tonus"],
  "Textura da pele":               ["manchas_textura"],
  "Rosto completo":                ["flacidez", "perda_tonus", "manchas_textura"],
  "Face completa":                 ["flacidez", "perda_tonus", "manchas_textura"],
  "Mandíbula":                     ["papada", "flacidez"],
  // Mapeamento direto do ResultScreen / AI result
  "Hidratação":                    ["manchas_textura"],
  "Elasticidade":                  ["flacidez", "perda_tonus"],
  "Manchas":                       ["manchas_textura"],
  "Rugas":                         ["rugas_testa", "pes_de_galinha"],
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
 * @param {Array|Object} scanData - Array de zonas ou objeto com zonas de severidade
 * @returns {Object} Protocolo com exercícios selecionados
 */
export function generateProtocol(scanData) {
  // --- NOVA LÓGICA: Se a IA já selecionou os exercícios (Bridge), use-os! ---
  if (scanData && scanData.selectedExercises && Array.isArray(scanData.selectedExercises)) {
    const aiExercises = scanData.selectedExercises
      .map(id => exercisesBank.find(ex => ex.id === id))
      .filter(Boolean);
    
    if (aiExercises.length >= 3) { // Se a IA retornou um número razoável
      const selectedRecipes = [];
      // Pegar receitas baseadas nos problemas detectados na análise
      const detectedProblems = new Set();
      if (scanData.zones) {
        Object.entries(scanData.zones).forEach(([zone, severity]) => {
          if (parseInt(severity) > 20) {
            const problems = zoneToProblems[zone] || [];
            problems.forEach(p => detectedProblems.add(p));
          }
        });
      }

      const problemList = [...detectedProblems];
      if (problemList.length > 0) {
        problemList.slice(0, 2).forEach(prob => {
          const rec = recipesBank.find(r => r.problem === prob);
          if (rec) selectedRecipes.push(rec);
        });
      }
      if (selectedRecipes.length < 1) selectedRecipes.push(recipesBank[0]);

      return {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        createdAt: new Date().toISOString(),
        zones: scanData.zones ? Object.keys(scanData.zones) : [],
        problems: problemList,
        exercises: aiExercises,
        recipes: selectedRecipes,
        totalExercises: aiExercises.length,
      };
    }
  }

  const selectedIds = new Set();
  const protocolExercises = [];
  const detectedProblems = new Set();

  // Normalizar dados de entrada (pode vir como array do scanner ou objeto da AI)
  let zonesInput = [];
  if (Array.isArray(scanData)) {
    zonesInput = scanData;
  } else if (scanData && scanData.zones) {
    // Vem do ResultScreen/AI
    // Normalizar as chaves para bater com o zoneToProblems (que usa CamelCase ou específico)
    zonesInput = Object.entries(scanData.zones).map(([zone, severity]) => {
      // Tentar encontrar a chave correta no zoneToProblems ignorando case
      const normalizedZone = Object.keys(zoneToProblems).find(
        k => k.toLowerCase() === zone.toLowerCase()
      ) || zone;

      return {
        zone: normalizedZone,
        severity: parseInt(severity) || 0
      };
    });
  }

  // Para cada zona detectada, encontrar problemas e selecionar exercícios
  for (const zoneData of zonesInput) {
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

  // Selecionar Receitas (1-2 baseadas nos problemas mais severos ou problemas gerais)
  const selectedRecipes = [];
  const problemList = [...detectedProblems];
  
  if (problemList.length > 0) {
    // Tentar pegar 1 receita para cada um dos 2 principais problemas
    const topProblems = problemList.slice(0, 2);
    for (const prob of topProblems) {
      const rec = recipesBank.find(r => r.problem === prob);
      if (rec) selectedRecipes.push(rec);
    }
  }

  // Se não tem receitas suficientes, adicionar padrão
  if (selectedRecipes.length < 1) {
    selectedRecipes.push(recipesBank[0]);
  }

  // Garantir mínimo de 4 e máximo de 8 exercícios
  // Se muito poucos, adicionar tonificação geral
  if (protocolExercises.length < 4) {
    const extras = exercisesBank.filter(
      (ex) =>
        !selectedIds.has(ex.id) &&
        (ex.problem === "manchas_textura" || ex.problem === "perda_tonus") &&
        ex.difficulty === "iniciante"
    );
    for (const ex of extras) {
      if (protocolExercises.length >= 8) break;
      selectedIds.add(ex.id);
      protocolExercises.push({ ...ex });
    }
  }

  // Se exceder 8, cortar os de menor prioridade
  const finalExercises = protocolExercises.slice(0, 8);

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    zones: zonesInput.map((z) => z.zone),
    problems: [...detectedProblems],
    exercises: finalExercises,
    recipes: selectedRecipes,
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
