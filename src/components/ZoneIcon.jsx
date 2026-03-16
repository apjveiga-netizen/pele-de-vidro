/* ══════════════════════════════════════════════════════════════════════
   SVG Icons por Zona Facial — Pele de Vidro
   
   Ilustrações SVG inline premium (dark/gold) para cada zona do rosto.
   Usadas como fallback quando não há imagem real do exercício.
   ══════════════════════════════════════════════════════════════════════ */

import React from "react";

const gold = "#C9A96E";
const goldLight = "#E8CFA0";

/**
 * Retorna um SVG inline baseado na zona do exercício.
 * Usado quando ex.image está vazio.
 */
export default function ZoneIcon({ zone, size = 64, style = {} }) {
  const s = size;
  const half = s / 2;
  const props = {
    width: s,
    height: s,
    viewBox: "0 0 64 64",
    fill: "none",
    style: { display: "block", ...style },
  };

  const zoneLower = (zone || "").toLowerCase();

  // TESTA
  if (zoneLower.includes("testa")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <path d="M14 28 Q32 14 50 28" stroke={goldLight} strokeWidth="2" strokeLinecap="round" fill="none" />
        <line x1="20" y1="22" x2="44" y2="22" stroke={gold} strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
        <line x1="18" y1="26" x2="46" y2="26" stroke={gold} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
        <circle cx="26" cy="34" r="2" fill={gold} opacity="0.5" />
        <circle cx="38" cy="34" r="2" fill={gold} opacity="0.5" />
      </svg>
    );
  }

  // OLHOS / PÁLPEBRAS / PERIORBITAL
  if (zoneLower.includes("olho") || zoneLower.includes("pálpeb") || zoneLower.includes("palpeb") || zoneLower.includes("periorb")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <ellipse cx="22" cy="30" rx="8" ry="4" stroke={goldLight} strokeWidth="1.8" fill="none" />
        <ellipse cx="42" cy="30" rx="8" ry="4" stroke={goldLight} strokeWidth="1.8" fill="none" />
        <circle cx="22" cy="30" r="2" fill={gold} opacity="0.7" />
        <circle cx="42" cy="30" r="2" fill={gold} opacity="0.7" />
        <path d="M14 30 Q12 24 18 22" stroke={gold} strokeWidth="1" opacity="0.5" strokeLinecap="round" fill="none" />
        <path d="M50 30 Q52 24 46 22" stroke={gold} strokeWidth="1" opacity="0.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // SULCO NASOGENIANO / BIGODE CHINÊS / LÁBIOS
  if (zoneLower.includes("sulco") || zoneLower.includes("nasog") || zoneLower.includes("lábio") || zoneLower.includes("labio")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <path d="M26 32 Q24 40 26 46" stroke={goldLight} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M38 32 Q40 40 38 46" stroke={goldLight} strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="32" cy="44" rx="6" ry="3" stroke={gold} strokeWidth="1.2" fill="none" />
        <line x1="32" y1="28" x2="32" y2="38" stroke={gold} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  // MANDÍBULA
  if (zoneLower.includes("mandíb") || zoneLower.includes("mandib")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <path d="M12 34 Q16 54 32 56 Q48 54 52 34" stroke={goldLight} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M18 38 Q20 48 32 50 Q44 48 46 38" stroke={gold} strokeWidth="1" opacity="0.4" fill="none" />
      </svg>
    );
  }

  // MAÇÃS DO ROSTO / BOCHECHAS
  if (zoneLower.includes("maçã") || zoneLower.includes("maca") || zoneLower.includes("bochech")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <circle cx="20" cy="36" r="6" stroke={goldLight} strokeWidth="1.8" fill="none" />
        <circle cx="44" cy="36" r="6" stroke={goldLight} strokeWidth="1.8" fill="none" />
        <circle cx="20" cy="36" r="2" fill={gold} opacity="0.4" />
        <circle cx="44" cy="36" r="2" fill={gold} opacity="0.4" />
        <path d="M26 42 Q32 46 38 42" stroke={gold} strokeWidth="1" opacity="0.4" fill="none" />
      </svg>
    );
  }

  // PESCOÇO
  if (zoneLower.includes("pescoço") || zoneLower.includes("pescoco")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="24" rx="16" ry="18" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <path d="M22 38 L20 58" stroke={goldLight} strokeWidth="2" strokeLinecap="round" />
        <path d="M42 38 L44 58" stroke={goldLight} strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="46" x2="42" y2="46" stroke={gold} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
        <line x1="21" y1="50" x2="43" y2="50" stroke={gold} strokeWidth="1" opacity="0.2" strokeDasharray="3 3" />
      </svg>
    );
  }

  // ROSTO COMPLETO / FACE COMPLETA
  if (zoneLower.includes("rosto") || zoneLower.includes("face") || zoneLower.includes("complet")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="34" rx="20" ry="26" stroke={goldLight} strokeWidth="1.8" fill="none" />
        <circle cx="24" cy="28" r="2.5" fill={gold} opacity="0.6" />
        <circle cx="40" cy="28" r="2.5" fill={gold} opacity="0.6" />
        <line x1="32" y1="30" x2="32" y2="38" stroke={gold} strokeWidth="1" opacity="0.4" />
        <path d="M26 42 Q32 46 38 42" stroke={gold} strokeWidth="1.2" opacity="0.6" fill="none" />
        <circle cx="32" cy="10" r="1.5" fill={gold} opacity="0.3" />
        {/* Pontos de energia */}
        {[[16, 20], [48, 20], [12, 38], [52, 38], [22, 54], [42, 54]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1" fill={gold} opacity="0.25" />
        ))}
      </svg>
    );
  }

  // SORRISO
  if (zoneLower.includes("sorris")) {
    return (
      <svg {...props}>
        <ellipse cx="32" cy="36" rx="22" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.3" />
        <path d="M20 40 Q32 52 44 40" stroke={goldLight} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="30" r="2" fill={gold} opacity="0.5" />
        <circle cx="40" cy="30" r="2" fill={gold} opacity="0.5" />
      </svg>
    );
  }

  // DEFAULT / GENÉRICO
  return (
    <svg {...props}>
      <ellipse cx="32" cy="34" rx="20" ry="26" stroke={gold} strokeWidth="1.2" opacity="0.4" />
      <circle cx="24" cy="28" r="2" fill={gold} opacity="0.5" />
      <circle cx="40" cy="28" r="2" fill={gold} opacity="0.5" />
      <line x1="32" y1="30" x2="32" y2="38" stroke={gold} strokeWidth="1" opacity="0.3" />
      <path d="M26 42 Q32 46 38 42" stroke={gold} strokeWidth="1" opacity="0.4" fill="none" />
    </svg>
  );
}
