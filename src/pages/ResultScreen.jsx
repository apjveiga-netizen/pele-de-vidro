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

export default function ResultScreen({ onNext, goToProtocol, aiData }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    
    // Auto-save the real AI scan results
    if (aiData) {
      // Usar zonas específicas da AI ou fallback para diagnósticos gerais
      const analysisZones = aiData.zones ? 
        Object.entries(aiData.zones).map(([zone, severity]) => ({
          zone,
          severity: parseInt(severity) || 0,
          label: severity > 60 ? "Crítico" : (severity > 30 ? "Moderado" : "Leve")
        })) : [
        { zone: "Hidratação", severity: aiData.hydration, label: aiData.hydration > 70 ? "Boa" : "Melhorável" },
        { zone: "Elasticidade", severity: aiData.elasticity, label: aiData.elasticity > 70 ? "Firme" : "Baixa" },
        { zone: "Manchas", severity: aiData.spots, label: aiData.spots > 30 ? "Crítico" : "Leve" },
        { zone: "Rugas", severity: aiData.wrinkles, label: aiData.wrinkles > 30 ? "Visível" : "Incipiente" },
      ];

      addScan({
        realAge: getProfile().age,
        visualAge: aiData.visualAge,
        zones: analysisZones,
        mainIssue: aiData.mainIssue,
        summary: aiData.summary
      });

      // Generate and save the personalized protocol using the full AI data (for zones + recipes)
      const newProtocol = generateProtocol(aiData);
      saveProtocol(newProtocol);
      console.log("AI Data received:", aiData);
      console.log("Protocol Generated:", newProtocol);
      
      // Verify save
      const saved = localStorage.getItem("pdv_protocol");
      if (saved) {
        console.log("✓ Protocolo salvo com sucesso no armazenamento local.");
      } else {
        console.error("✗ FALHA ao salvar o protocolo no armazenamento local.");
      }
    }
  }, [aiData]);

  const profile = getProfile();
  const realAge = profile.age;
  
  // Data from AI
  const currentApparentAge = aiData?.visualAge || realAge + 5;
  const targetAge = realAge - 6; // Potential reduction goal
  const potentialAgeReduction = currentApparentAge - targetAge;

  const displayZones = aiData?.zones ? 
    Object.entries(aiData.zones).map(([zone, severity]) => {
      const s = parseInt(severity) || 0;
      let color = colors.success;
      let label = "Leve";
      if (s > 60) { color = colors.danger; label = "Crítico"; }
      else if (s > 30) { color = colors.gold; label = "Moderado"; }
      return { zone, severity: s, color, label };
    }) : [
    { zone: "Hidratação", severity: aiData?.hydration || 50, color: colors.success, label: (aiData?.hydration > 70 ? "Excelente" : "Ressecada") },
    { zone: "Elasticidade", severity: aiData?.elasticity || 50, color: colors.rose, label: (aiData?.elasticity > 70 ? "Firme" : "Flacidez") },
    { zone: "Manchas", severity: aiData?.spots || 50, color: colors.gold, label: (aiData?.spots > 30 ? "Hiperpigmentação" : "Uniforme") },
    { zone: "Rugas", severity: aiData?.wrinkles || 50, color: colors.danger, label: (aiData?.wrinkles > 30 ? "Profundas" : "Superficiais") },
  ];

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
        <div className="cormorant" style={{ fontSize: "36px", color: colors.cream, fontWeight: 300, lineHeight: 1.1, marginBottom: "16px" }}>
          Sua Análise
        </div>
        <div style={{ 
          background: "rgba(125,170,138,0.15)", border: `1px solid ${colors.success}`,
          color: colors.success, padding: "8px 16px", borderRadius: "20px",
          display: "inline-block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em"
        }}>
          PROTOCOLO GERADO COM SUCESSO ✓
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
                  <div className="cormorant" style={{ fontSize: "56px", color: colors.cream, fontWeight: 300, lineHeight: 1 }}>
                    {currentApparentAge}
                  </div>
                  <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.12em", marginTop: "4px" }}>IDADE VISUAL</div>
                </div>
                <div style={{ color: colors.border, fontSize: "28px", marginBottom: "16px", opacity: 0.5 }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div className="cormorant" style={{ fontSize: "62px", color: colors.success, fontWeight: 400, lineHeight: 1 }}>
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
              <div style={{ color: colors.success, fontSize: "26px", fontWeight: 800 }}>-{potentialAgeReduction > 0 ? potentialAgeReduction : 5}</div>
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
              ✨ <strong style={{ color: colors.gold }}>Resumo:</strong> {aiData?.summary || "Identificamos alta capacidade de regeneração. Seguindo o protocolo, sua face atingirá o pico de rejuvenescimento em 180 dias."}
            </p>
          </div>
        </div>
      </div>

      {/* Zonas de prioridade */}
      <div style={{ padding: "0 24px", opacity: visible ? 1 : 0, transition: "opacity 0.6s 0.4s", marginBottom: "32px" }}>
        <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "18px", fontWeight: 500 }}>
          MAPEAMENTO DE ZONAS CRÍTICAS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {displayZones.map((item, i) => (
            <div key={i} className="card-glow" style={{
              padding: "16px 20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
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
          <button className="btn-gold" onClick={goToProtocol}>
            LIBERAR MEU PROTOCOLO IA →
          </button>
        </div>
      </div>
    </div>
  );
}
