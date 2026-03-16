import { useState } from "react";
import { colors } from "../theme";

const slides = [
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke={colors.gold} strokeWidth="0.8" opacity="0.4"/>
        <path d="M32 8C40 16 44 24 32 32C20 40 16 52 32 56" stroke={colors.gold} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="4" fill={colors.gold} opacity="0.8"/>
        <path d="M20 16C24 20 28 26 32 32" stroke={colors.goldLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: "Scan facial IA",
    subtitle: {
      sophisticated: "Análise facial em segundos. Primeiros resultados em 2 semanas.",
      square: "Nossa tecnologia analisa sua pele em segundos e cria o protocolo certo pra você."
    },
    accent: "COMEÇAR",
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="16" width="48" height="36" rx="4" stroke={colors.gold} strokeWidth="1.2" opacity="0.5"/>
        <path d="M20 28 L28 36 L44 24" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="48" cy="12" r="8" fill={colors.gold} opacity="0.9"/>
        <path d="M44 12 L47 15 L52 9" stroke={colors.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Protocolo\npersonalizado\npara você",
    subtitle: "Exercícios de Face Yoga selecionados pela IA conforme seus pontos de melhoria específicos",
    accent: "PROTOCOLO EXCLUSIVO",
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L36 24H52L40 34L44 52L32 42L20 52L24 34L12 24H28L32 8Z" stroke={colors.gold} strokeWidth="1.2" fill="rgba(201,169,110,0.1)"/>
        <circle cx="32" cy="32" r="6" fill={colors.gold} opacity="0.8"/>
      </svg>
    ),
    title: "Reduza 7 anos\nda sua aparência\nem 30 dias",
    subtitle: "Resultados visíveis em semanas. Sem botox, sem procedimentos invasivos, sem sair de casa",
    accent: "RESULTADOS REAIS",
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goNext = () => {
    if (slide < 2) {
      setAnimating(true);
      setTimeout(() => { setSlide(s => s + 1); setAnimating(false); }, 300);
    } else {
      onFinish();
    }
  };

  const s = slides[slide];

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Pular */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <button onClick={onFinish} className="btn-ghost" style={{
              padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
              letterSpacing: "0.05em", width: "auto",
            }}>
              PULAR
            </button>
          </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        opacity: animating ? 0 : 1, transition: "opacity 0.3s ease",
      }}>
        <div style={{ marginBottom: "32px", animation: "float 3s ease-in-out infinite" }}>
          {s.icon}
        </div>

        <div style={{
          background: `rgba(201,169,110,0.1)`, border: `1px solid rgba(201,169,110,0.25)`,
          borderRadius: "20px", padding: "4px 14px", marginBottom: "20px",
          color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", fontWeight: 500,
        }}>
          {s.accent}
        </div>

        <div className="cormorant" style={{
          fontSize: "38px", fontWeight: 300, color: colors.cream,
          lineHeight: 1.15, marginBottom: "16px", whiteSpace: "pre-line",
        }}>
          {s.title}
        </div>

        {typeof s.subtitle === "object" ? (
          <div style={{ maxWidth: "280px" }}>
            <p className="cormorant" style={{
              color: colors.muted, fontSize: "20px", lineHeight: 1.4,
              marginBottom: "16px", fontStyle: "italic", fontWeight: 300
            }}>
              {s.subtitle.sophisticated}
            </p>
            <p style={{
              color: colors.muted, fontSize: "12px", lineHeight: 1.6,
              letterSpacing: "0.02em", textTransform: "uppercase", opacity: 0.8
            }}>
              {s.subtitle.square}
            </p>
          </div>
        ) : (
          <p style={{
            color: colors.muted, fontSize: "14px", lineHeight: 1.6,
            maxWidth: "280px", fontWeight: 300,
          }}>
            {s.subtitle}
          </p>
        )}
      </div>

        </div>
        <div className="button-group">
          {/* Indicadores */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} onClick={() => setSlide(i)} style={{
                height: "4px", borderRadius: "2px", cursor: "pointer",
                width: i === slide ? "24px" : "8px",
                background: i === slide ? colors.gold : colors.border,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <button className="btn-gold" onClick={goNext}>
            {slide < 2 ? "➔ PRÓXIMO" : "FAZER MEU SCAN GRATUITO"}
          </button>
        </div>
      </div>
    </div>
  );
}
