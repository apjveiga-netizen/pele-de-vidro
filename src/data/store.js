/* ── Store de Dados — CRUD com localStorage ── */
import exercisesBank from "./exercisesBank.js";

const KEYS = {
  exercises: "pdv_exercises",
  profile: "pdv_profile",
  scans: "pdv_scans",
  dailyProgress: "pdv_daily_progress",
  streak: "pdv_streak",
  hasOnboarded: "pdv_onboarded",
  protocol: "pdv_protocol",
  schemaVersion: "pdv_schema_version", // New key
};

export const CURRENT_SCHEMA_VERSION = "2024-04-10-v5";


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

// --- UNIFICAÇÃO V.3: Usando apenas o exercisesBank centralizado ---
const defaultExercises = exercisesBank;

export function getExercises() {
  return get(KEYS.exercises, defaultExercises);
}

export function saveExercises(list) {
  set(KEYS.exercises, list);
}

// --- CRUD Manual desabilitado na V.3 para manter integridade do banco ---
export function addExercise() { return null; }

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

export function addScan({ realAge, visualAge, zones, mainIssue, summary }) {
  const scans = getScans();
  const newScan = {
    id: generateId(),
    date: new Date().toISOString(),
    realAge,
    visualAge,
    zones: zones || [],
    mainIssue: mainIssue || "",
    summary: summary || "",
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

/** Verifica se um objeto é um protocolo válido e personalizado (V.8.2.4) */
export function isValidProtocol(p) {
  if (!p || !p.exercises || !Array.isArray(p.exercises)) return false;
  // Se tiver menos de 10 exercícios (o banco tem ~39), é um protocolo personalizado da IA
  return p.exercises.length > 0 && p.exercises.length < 20; 
}

/** Retorna exercícios do protocolo ativo, ou defaultExercises se não houver um protocolo válido */
export function getActiveExercises() {
  const protocol = getProtocol();
  if (isValidProtocol(protocol)) {
    return protocol.exercises;
  }
  // Se for o banco de dados completo (fallback), não é um protocolo ativo real
  return []; 
}

// ─── RESET ──────────────────────────────────────────────────────────

export function resetAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
