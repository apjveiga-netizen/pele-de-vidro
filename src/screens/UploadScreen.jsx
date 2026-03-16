import { useState, useRef } from "react";
import { colors } from "../theme";

export default function UploadScreen({ onNext }) {
  const [userData, setUserData] = useState({ name: "", age: "" });
  const [photoFront, setPhotoFront] = useState(null);
  const [photoLeft, setPhotoLeft] = useState(null);
  const [photoRight, setPhotoRight] = useState(null);
  const [activeSide, setActiveSide] = useState("front"); // front, left, right
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (activeSide === "front") setPhotoFront(base64);
      if (activeSide === "left") setPhotoLeft(base64);
      if (activeSide === "right") setPhotoRight(base64);
    };
    reader.readAsDataURL(file);
  };

  const isDataComplete = userData.name.length > 2 && userData.age.length > 0;
  const isPhotosComplete = photoFront && photoLeft && photoRight;
  const currentPhoto = activeSide === "front" ? photoFront : activeSide === "left" ? photoLeft : photoRight;

  const analysisSteps = [
    "Recebendo arquivos...",
    "Mapeando estrutura óssea...",
    "Identificando densidade dérmica...",
    "Cruzando dados com seu perfil...",
    "Criando seu protocolo exclusivo..."
  ];

  const handleStartAnalysis = () => {
    setAnalyzing(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= analysisSteps.length) {
        clearInterval(interval);
        // Pass base64 photos
        onNext({ ...userData, photos: { front: photoFront, left: photoLeft, right: photoRight } });
      } else {
        setAnalyzeStep(step);
      }
    }, 1200);
  };

  if (analyzing) {
    return (
      <div className="screen-wrapper">
        <div className="container-main" style={{ justifyContent: "center", alignItems: "center" }}>
          <div className="content-area" style={{ justifyContent: "center", alignItems: "center" }}>
            <div className="loader-ring" style={{ width: "80px", height: "80px", marginBottom: "32px", border: `3px solid rgba(201,169,110,0.1)`, borderTopColor: colors.gold, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div className="cormorant" style={{ fontSize: "24px", color: colors.cream, marginBottom: "8px", textAlign: "center" }}>
              Personalizando seu acesso
            </div>
            <div style={{ color: colors.gold, fontSize: "14px", letterSpacing: "0.05em", opacity: 0.8, animation: "pulse 1.5s infinite" }}>
              {analysisSteps[analyzeStep]}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Dados do Perfil */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.25em", marginBottom: "12px", fontWeight: 500 }}>
              PROTOCOLO PERSONALIZADO
            </div>
            <div className="cormorant" style={{ fontSize: "28px", color: colors.cream, lineHeight: 1.2, fontWeight: 300 }}>
              Sua análise inicia aqui
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "12px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "10px" }}>NOME COMPLETO</label>
                <input 
                  className="form-input"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="Ex: Maria Silva"
                  style={{ fontSize: "13px", padding: "12px" }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "10px" }}>IDADE</label>
                <input 
                  className="form-input"
                  type="number"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                  placeholder="Ex: 35"
                  style={{ fontSize: "13px", padding: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* Área de Fotos */}
          <div style={{ 
            opacity: isDataComplete ? 1 : 0.3, 
            pointerEvents: isDataComplete ? "auto" : "none",
            transition: "all 0.5s ease",
            flex: 1, display: "flex", flexDirection: "column"
          }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: colors.muted, fontSize: "11px", marginBottom: "12px", letterSpacing: "0.05em" }}>
                {isDataComplete ? "ESCOLHA O LADO PARA FOTOGRAFAR:" : "PREENCHA SEU NOME E IDADE PARA LIBERAR O SCANNER"}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["front", "left", "right"].map(side => (
                  <button 
                    key={side}
                    onClick={() => setActiveSide(side)}
                    style={{
                      flex: 1, padding: "8px", borderRadius: "8px", fontSize: "9px", fontWeight: 600,
                      background: activeSide === side ? "rgba(201,169,110,0.15)" : colors.card,
                      border: `1px solid ${activeSide === side ? colors.gold : colors.border}`,
                      color: activeSide === side ? colors.gold : colors.muted,
                      transition: "all 0.2s"
                    }}
                  >
                    {side === "front" ? "FRENTE" : side === "left" ? "ESQUERDA" : "DIREITA"}
                  </button>
                ))}
              </div>
            </div>

            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragging ? colors.gold : currentPhoto ? colors.gold : colors.border}`,
                borderRadius: "16px", cursor: "pointer", transition: "all 0.3s ease",
                marginBottom: "20px", overflow: "hidden",
                background: dragging ? "rgba(201,169,110,0.03)" : "rgba(30,25,20,0.2)",
                flex: 1, minHeight: "220px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", position: "relative"
              }}
            >
              {currentPhoto ? (
                <>
                  <img src={currentPhoto} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(10,9,8,0.8) 0%, transparent 50%)",
                    display: "flex", alignItems: "flex-end", padding: "12px",
                  }}>
                    <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.1em" }}>
                      ✓ FOTO PRONTA
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                      <path d="M24 12V36M12 24H36" stroke={colors.border} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ color: colors.muted, fontSize: "12px" }}>
                    Toque para capturar <br/> {activeSide === "front" ? "Frente" : "Lateral"}
                  </div>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        </div>

        <div className="button-group">
          {isPhotosComplete && (
            <button 
              className="btn-gold" 
              onClick={handleStartAnalysis}
            >
              INICIAR ANÁLISE IA →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
