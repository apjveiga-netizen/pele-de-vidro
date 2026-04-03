import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getActiveExercises, getDailyProgress, toggleExerciseDone, getStreak, getProfile, getProtocol } from "../data/store";
import ZoneIcon from "../components/ZoneIcon";

export default function DashboardScreen({ onExercise, credits, userEmail, refreshCredits, onNavigate, screens }) {
  const [exercises, setExercises] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [streak, setStreak] = useState(0);
  const [profile, setProfile] = useState({ name: "Usuária" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setExercises(getActiveExercises());
    setDoneList(getDailyProgress());
    setStreak(getStreak());
    setProfile(getProfile());
    
    // Atualiza os créditos ao montar a tela se houver e-mail
    if (userEmail) {
      refreshCredits(userEmail);
    }
    
    setTimeout(() => setVisible(true), 100);
  }, [userEmail]);

  const completed = doneList.length;
  const total = exercises.length;

  const handleToggle = (exId) => {
    const updated = toggleExerciseDone(exId);
    setDoneList(updated);
    setStreak(getStreak());
  };

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
      {/* Sistema de Créditos / Conta */}
      <div className="card-glow" style={{
        marginBottom: "24px", 
        display: "flex", justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.15em", marginBottom: "4px" }}>CRÉDITOS IA</div>
          <div style={{ color: colors.gold, fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "20px" }}>✨</span> {credits} análises
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.15em", marginBottom: "4px" }}>CONTA</div>
          <div style={{ color: colors.cream, fontSize: "12px", opacity: 0.9 }}>{userEmail || "Não vinculada"}</div>
        </div>
      </div>

      {/* Logo + Cabeçalho Premium */}
      <div style={{
        paddingBottom: "24px", marginBottom: "24px",
        borderBottom: `1px solid ${colors.border}`,
        opacity: visible ? 1 : 0, transition: "opacity 0.5s",
        textAlign: "center"
      }}>
        {/* Animated Logo from Splash */}
        <div style={{ width: "64px", height: "64px", margin: "0 auto 16px" }}>
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke={colors.gold} strokeWidth="0.5" opacity="0.5"/>
            <circle cx="40" cy="40" r="28" stroke={colors.gold} strokeWidth="1" opacity="0.8"/>
            <path d="M40 12 C52 24 56 36 40 40 C24 44 20 56 40 68" stroke={colors.gold} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M28 20 C40 28 44 36 40 40 C36 44 28 48 32 60" stroke="#E6C88A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
            <circle cx="40" cy="40" r="3" fill={colors.gold}/>
          </svg>
        </div>
        
        <div className="cormorant" style={{ fontSize: "28px", letterSpacing: "0.15em", fontWeight: 300, lineHeight: 1.1, marginBottom: "8px" }}>
          PELE DE VIDRO
        </div>
        <div style={{ color: colors.muted, fontSize: "9px", letterSpacing: "0.25em", fontWeight: 300, marginBottom: "20px" }}>
          ANÁLISE FACIAL POR INTELIGÊNCIA ARTIFICIAL
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", textAlign: "left" }}>
          <div>
            <div style={{ color: colors.muted, fontSize: "13px", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Olá, {profile.name} ✨
            </div>
            <div className="cormorant" style={{ fontSize: "26px", color: colors.cream, fontWeight: 300, lineHeight: 1.1 }}>
              Bem-vinda
            </div>
          </div>
          <div className="card-glow" style={{ padding: "10px 16px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ color: colors.gold, fontSize: "20px", fontWeight: 700 }}>🔥 {streak}</div>
            <div style={{ color: colors.muted, fontSize: "8px", letterSpacing: "0.12em", fontWeight: 500 }}>DIAS SEGUIDOS</div>
          </div>
        </div>
      </div>

      {/* Área Dinâmica: Protocolo ou Nova Análise */}
      <div style={{ marginTop: "auto", paddingTop: "20px", opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.1s" }}>
        {exercises.length > 0 && (exercises[0].id.startsWith("fb_") || exercises[0].id.includes("_")) ? (
          <div className="card-glow" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ color: colors.gold, fontSize: "11px", letterSpacing: "0.15em", marginBottom: "4px" }}>PROTOCOLO ATIVO</div>
                <div className="cormorant" style={{ fontSize: "20px", color: colors.cream }}>
                  {doneList.length === exercises.length ? "✨ Concluído hoje!" : `${exercises.length - doneList.length} pendentes`}
                </div>
              </div>
              <button 
                onClick={() => onNavigate(screens.PROTOCOL)}
                style={{ 
                  background: "rgba(201,169,110,0.1)", border: `1px solid ${colors.gold}`,
                  color: colors.gold, padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 600
                }}
              >
                DETALHES
              </button>
            </div>
            
            {/* Barra de Progresso Simples */}
            <div style={{ height: "4px", background: colors.border, borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
              <div style={{ 
                height: "100%", background: colors.gold, 
                width: `${(doneList.length / exercises.length) * 100}%`,
                transition: "width 0.5s ease" 
              }} />
            </div>

            <button
              className="btn-gold"
              onClick={() => onNavigate(screens.UPLOAD)}
              style={{ width: "100%", padding: "12px", fontSize: "12px", marginTop: "8px", opacity: 0.8 }}
            >
              NOVA ANÁLISE IA
            </button>
          </div>
        ) : (
          <button
            className="btn-gold"
            onClick={() => onNavigate(screens.UPLOAD)}
            style={{ 
              width: "100%", 
              padding: "18px", 
              fontSize: "14px", 
              letterSpacing: "0.2em",
              fontWeight: 600,
              boxShadow: "0 8px 32px rgba(201,169,110,0.2)"
            }}
          >
            AVANÇAR PARA A ANÁLISE
          </button>
        )}
      </div>
        </div>
        {/* If there were global buttons, they would go here in .button-group */}
      </div>
    </div>
  );
}
