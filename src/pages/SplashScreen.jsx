import { useState, useEffect } from "react";
import { colors } from "../theme";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => onFinish(), 3000);
  }, []);

  return (
    <div className="screen-wrapper">
      <div className="container-main" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="content-area" style={{ justifyContent: "center", alignItems: "center" }}>
          {/* Anéis atmosféricos */}
          {[200, 280, 360].map((s, i) => (
            <div key={i} style={{
              position: "absolute", width: s, height: s,
              borderRadius: "50%", border: `1px solid rgba(201,169,110,${0.08 - i * 0.02})`,
              animation: `glowPulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}

          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease", textAlign: "center" }}>
            {/* Logo */}
            <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", animation: "float 3s ease-in-out infinite" }}>
              <svg viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke={colors.gold} strokeWidth="0.5" opacity="0.5"/>
                <circle cx="40" cy="40" r="28" stroke={colors.gold} strokeWidth="1" opacity="0.8"/>
                <path d="M40 12 C52 24 56 36 40 40 C24 44 20 56 40 68" stroke={colors.gold} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M28 20 C40 28 44 36 40 40 C36 44 28 48 32 60" stroke={colors.goldLight} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
                <circle cx="40" cy="40" r="3" fill={colors.gold}/>
              </svg>
            </div>

            <div className="cormorant shimmer-text" style={{ fontSize: "36px", letterSpacing: "0.12em", fontWeight: 300, lineHeight: 1.1 }}>
              PELE DE VIDRO
            </div>
            <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.3em", marginTop: "8px", fontWeight: 300 }}>
              ANÁLISE FACIAL POR INTELIGÊNCIA ARTIFICIAL
            </div>
          </div>

          {/* Pontos de carregamento */}
          <div style={{
            position: "absolute", bottom: "80px",
            display: "flex", gap: "8px", opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.5s",
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: colors.gold,
                animation: `dotPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
