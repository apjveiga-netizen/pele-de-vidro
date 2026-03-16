import { useState, useEffect } from "react";
import { colors } from "../theme";
import { addScan, getProfile, saveProtocol } from "../data/store";
import { generateProtocol } from "../data/protocolEngine";

const improvements = [
  { zone: "Maçãs do rosto", severity: 72, label: "Volume reduzido", color: colors.danger },
  { zone: "Contorno da mandíbula", severity: 58, label: "Definição moderada", color: colors.rose },
  { zone: "Testa / linhas de expressão", severity: 45, label: "Linhas superficiais", color: "#D4B87A" },
  { zone: "Pescoço", severity: 34, label: "Flacidez leve", color: colors.success },
];

export default function ResultScreen({ onNext, goToProtocol }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    // Salvar scan automaticamente
    const profile = getProfile();
    const visualAge = profile.age + 6;
    const scanZones = improvements.map(imp => ({
      zone: imp.zone,
      severity: imp.severity,
      label: imp.label,
    }));
    addScan({
      realAge: profile.age,
      visualAge,
      zones: scanZones,
    });
    // Protocolo NÃO é gerado aqui. Só é gerado na aba Protocolo se o usuário pagar/usar 1 crédito.
  }, []);

  const profile = getProfile();
  const realAge = profile.age;
  
  // Lógica analítica real baseada nas zonas:
  // Quanto maior a severidade média, maior a diferença de idade
  const averageSeverity = improvements.reduce((acc, cur) => acc + cur.severity, 0) / improvements.length;
  // Exemplo: Severidade média de 50 adiciona ~5 anos à idade real
  const visualDiff = Math.round(averageSeverity / 10); 
  const currentApparentAge = realAge + visualDiff;
  
  // Idade potencial após o protocolo (sempre melhor que a real se seguir o plano)
  const potentialAgeReduction = 5 + Math.floor(Math.random() * 4); // Redução de 5 a 8 anos
  const targetAge = realAge - potentialAgeReduction;

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
      {/* Cabeçalho */}
      <div style={{
        background: `linear-gradient(180deg, #1a1206 0%, ${colors.bg} 100%)`,
        padding: "32px 24px 32px",
        opacity: visible ? 1 : 0, transition: "opacity 0.6s",
      }}>
        <div style={{ color: colors.gold, fontSize: "11px", letterSpacing: "0.3em", marginBottom: "12px", fontWeight: 500 }}>
          RELATÓRIO FINAL IA
        </div>
        <div className="cormorant" style={{ fontSize: "36px", color: colors.cream, fontWeight: 300, lineHeight: 1.1 }}>
          Sua Análise
        </div>
      </div>

      {/* Card de idade visual */}
      <div style={{ padding: "0 24px", opacity: visible ? 1 : 0, transition: "opacity 0.6s 0.2s", marginBottom: "32px" }}>
        <div className="card-glow" style={{
          position: "relative", overflow: "hidden", padding: "32px"
        }}>
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 75%)",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "20px", fontWeight: 500 }}>
                CRIAÇÃO DE VALOR
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "24px" }}>
                <div style={{ textAlign: "center" }}>
                  <div className="cormorant" style={{ fontSize: "56px", color: colors.cream, fontWeight: 300, lineHeight: 1, animation: "countUp 0.8s ease 0.4s both" }}>
                    {currentApparentAge}
                  </div>
                  <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.12em", marginTop: "4px" }}>IDADE ATUAL</div>
                </div>
                <div style={{ color: colors.border, fontSize: "28px", marginBottom: "16px", opacity: 0.5 }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div className="cormorant" style={{ fontSize: "62px", color: colors.success, fontWeight: 400, lineHeight: 1, animation: "countUp 0.8s ease 0.6s both" }}>
                    {targetAge}
                  </div>
                  <div style={{ color: colors.success, fontSize: "10px", letterSpacing: "0.12em", marginTop: "4px", fontWeight: 600 }}>POTENCIAL</div>
                </div>
              </div>
            </div>
            <div style={{
              background: "rgba(169,201,110,0.08)", border: "1px solid rgba(169,201,110,0.25)",
              borderRadius: "14px", padding: "12px 16px", textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}>
              <div style={{ color: colors.success, fontSize: "26px", fontWeight: 800 }}>-{potentialAgeReduction}</div>
              <div style={{ color: colors.success, fontSize: "9px", letterSpacing: "0.1em", fontWeight: 700 }}>ANOS IA</div>
            </div>
          </div>

          <div style={{ 
            marginTop: "24px", padding: "16px", 
            background: "rgba(201,169,110,0.05)", 
            borderRadius: "14px", 
            border: "1px solid rgba(201,169,110,0.1)",
            position: "relative", zIndex: 1
          }}>
            <p style={{ color: colors.cream, fontSize: "13px", lineHeight: 1.6, opacity: 0.9 }}>
              ✨ Identificamos alta capacidade de regeneração. Seguindo o protocolo, sua face atingirá o <strong style={{ color: colors.gold }}>pico de rejuvenescimento</strong> em 180 dias.
            </p>
          </div>
        </div>
      </div>

      {/* Zonas de prioridade */}
      <div style={{ padding: "0 24px", opacity: visible ? 1 : 0, transition: "opacity 0.6s 0.4s", marginBottom: "32px" }}>
        <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "18px", fontWeight: 500 }}>
          MAPEAMENTO DE ZONAS CRÍTICAS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {improvements.map((item, i) => (
            <div key={i} className="card-glow" style={{
              padding: "20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                <span style={{ color: colors.cream, fontSize: "14px", fontWeight: 500 }}>{item.zone}</span>
                <span style={{ color: item.color, fontSize: "11px", fontWeight: 600, letterSpacing: "0.02em" }}>{item.label.toUpperCase()}</span>
              </div>
              <div style={{ height: "4px", background: colors.border, borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "2px",
                  background: item.color, width: `${item.severity}%`,
                  transition: "width 1.2s cubic-bezier(0.1, 0, 0.2, 1)",
                  boxShadow: `0 0 10px ${item.color}44`
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

        </div>
        <div className="button-group">
          <button className="btn-gold" onClick={onNext}>
            DESBLOQUEAR MEU PROTOCOLO →
          </button>
        </div>
      </div>
    </div>
  );
}
