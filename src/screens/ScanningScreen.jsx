import { useState, useEffect } from "react";
import { colors } from "../theme";

const scanSteps = [
  "Detectando estrutura facial...",
  "Analisando textura da pele...",
  "Mapeando rugas e linhas de expressão...",
  "Avaliando flacidez e contorno...",
  "Identificando manchas e hiperpigmentação...",
  "Calculando idade visual...",
  "Gerando protocolo 100% personalizado...",
];

export default function ScanningScreen({ onNext, userEmail, credits, useCredit, goToOffer, userPhotos, user }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startScan = async () => {
      if (!userEmail) {
        setError("Por favor, vincule seu e-mail para usar seus créditos.");
        return;
      }

      if (credits <= 0) {
        setError("Você não possui créditos suficientes para uma nova análise.");
        return;
      }

      setHasStarted(true);
      
      // Simulate visual progress while backend works
      const progInterval = setInterval(() => {
        setProgress(p => p < 90 ? p + 0.5 : p);
      }, 100);

      const stepInterval = setInterval(() => {
        setStep(s => s < scanSteps.length - 1 ? s + 1 : s);
      }, 2000);

      try {
        // 1. Use the credit first
        const success = await useCredit();
        if (!success) throw new Error("Erro ao processar crédito.");

        // 2. Call the AI backend
        console.log("Enviando 3 fotos para análise real (Frente, Esquerda, Direita)...");
        console.log("Fazendo fetch para /api/analyze-face com dados:", { userId: user?.id, email: userEmail });
        const response = await fetch("/api/analyze-face", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            email: userEmail,
            photos: userPhotos // Sending the object with {front, left, right}
          })
        });

        console.log("Resposta da API recebida. Status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro na API (texto):", errorText);
          throw new Error(`Falha na comunicação com a IA (Status ${response.status})`);
        }
        
        const result = await response.json();
        
        // Finalize progress smoothly
        clearInterval(progInterval);
        clearInterval(stepInterval);
        setProgress(100);
        setTimeout(() => onNext(result), 500);

      } catch (err) {
        setError(err.message || "Erro inesperado na análise.");
      }

      return () => { clearInterval(progInterval); clearInterval(stepInterval); };
    };

    startScan();
  }, [userEmail, credits]);

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area" style={{ justifyContent: "center", alignItems: "center" }}>
          {error ? (
            <div style={{ 
              textAlign: "center", 
              animation: "fadeUp 0.5s ease",
              padding: "40px 32px",
              background: "rgba(196,122,122,0.05)",
              borderRadius: "18px",
              border: `1px solid rgba(196,122,122,0.15)`,
              maxWidth: "320px"
            }}>
              <div style={{ fontSize: "56px", marginBottom: "24px" }}>🔒</div>
              <div className="cormorant" style={{ fontSize: "28px", color: colors.gold, marginBottom: "16px", fontWeight: 300 }}>
                Acesso Restrito
              </div>
              <p style={{ color: colors.muted, fontSize: "15px", lineHeight: 1.6, marginBottom: "32px", opacity: 0.9 }}>
                {error}
              </p>
            </div>
          ) : (
            <>
              {/* Animação do scan */}
              <div style={{
                width: "260px", height: "300px", position: "relative",
                marginBottom: "56px", animation: hasStarted ? "scanPulse 2s ease-in-out infinite" : "none",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="260" height="300" viewBox="0 0 260 300" fill="none" style={{ position: "absolute" }}>
                  <path d="M30 80 L30 30 L80 30" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <path d="M180 30 L230 30 L230 80" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <path d="M30 220 L30 270 L80 270" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <path d="M180 270 L230 270 L230 220" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                  <ellipse cx="130" cy="150" rx="75" ry="100" stroke={colors.gold} strokeWidth="1" strokeDasharray="6 4" opacity="0.2"/>
                  {[[100,120],[160,120],[130,160],[110,190],[150,190]].map(([x,y], i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill={colors.gold} opacity={progress > i * 18 ? 0.9 : 0.05} style={{ transition: "opacity 0.4s" }}/>
                  ))}
                </svg>

                {/* Linha de scan */}
                {hasStarted && (
                  <div style={{
                    position: "absolute", left: "30px", right: "30px", height: "3px",
                    background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
                    boxShadow: `0 0 20px ${colors.gold}`,
                    animation: "scanLine 2.2s ease-in-out infinite",
                    zIndex: 2
                  }} />
                )}

                {/* Grid */}
                <div style={{
                  position: "absolute", inset: "30px",
                  backgroundImage: `linear-gradient(rgba(201,169,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.06) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                  borderRadius: "18px",
                  opacity: 0.5
                }} />
              </div>

              <div className="cormorant shimmer-text" style={{ fontSize: "22px", letterSpacing: "0.25em", marginBottom: "12px", fontWeight: 300 }}>
                ANALISANDO
              </div>

              <div style={{ color: colors.muted, fontSize: "14px", marginBottom: "40px", minHeight: "22px", letterSpacing: "0.02em", opacity: 0.8 }}>
                {hasStarted ? scanSteps[step] : "Validando identidade segura..."}
              </div>

              {/* Barra de progresso */}
              <div style={{ width: "100%", maxWidth: "300px" }}>
                <div style={{
                  height: "4px", background: colors.border, borderRadius: "2px",
                  marginBottom: "12px", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldLight})`,
                    width: `${progress}%`, transition: "width 0.1s linear",
                    boxShadow: `0 0 12px ${colors.gold}`,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: colors.muted, fontSize: "12px", fontWeight: 500 }}>{hasStarted ? "Mantenha o rosto imóvel" : "Aguarde..."}</span>
                  <span style={{ color: colors.gold, fontSize: "14px", fontWeight: 700 }}>{Math.round(progress)}%</span>
                </div>
              </div>
            </>
          )}
        </div>
        {error && (
          <div className="button-group">
            <button className="btn-gold" onClick={goToOffer}>
              ADQUIRIR NOVAS ANÁLISES
            </button>
            <button className="btn-ghost" onClick={() => window.location.reload()}>
              RECOMESSAR PROCESSO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
