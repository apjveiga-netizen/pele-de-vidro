import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getProtocol, getDailyProgress, toggleExerciseDone, getStreak } from "../data/store";
import { problemLabels } from "../data/protocolEngine";
import ZoneIcon from "../components/ZoneIcon";

// Removed hardcoded NATURAL_RECIPES in favor of personalized ones from the protocol

export default function ProtocolScreen({ onExercise, onBack, credits = 0, onUseCredit, onBuyCredits }) {
  const [protocol, setProtocol] = useState(null);
  const [doneList, setDoneList] = useState([]);
  const [streak, setStreak] = useState(0);
  const [visible, setVisible] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [unlocked, setUnlocked] = useState(true); // Default to true as requested

  useEffect(() => {
    const p = getProtocol();
    setProtocol(p);
    setDoneList(getDailyProgress());
    setStreak(getStreak());
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleToggle = (exId) => {
    const updated = toggleExerciseDone(exId);
    setDoneList(updated);
    setStreak(getStreak());
  };

  const handleUnlock = () => {
    setUnlocked(true);
  };

  if (!protocol || !protocol.exercises || protocol.exercises.length === 0) {
    return (
      <div className="screen-wrapper">
        <div className="container-main">
          <div className="content-area" style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", padding: "40px 32px", animation: "fadeUp 0.5s ease" }}>
              <div style={{ fontSize: "56px", marginBottom: "24px" }}>🔬</div>
              <div className="cormorant" style={{ fontSize: "28px", color: colors.gold, marginBottom: "16px", fontWeight: 300 }}>
                Nenhum Protocolo Ativo
              </div>
              <p style={{ color: colors.muted, fontSize: "15px", lineHeight: 1.6, marginBottom: "32px", opacity: 0.9 }}>
                Para gerar seu protocolo, volte para a aba Análise, faça o upload de suas fotos e aguarde o relatório.
              </p>
            </div>
          </div>
          <div className="button-group">
            <button className="btn-gold" onClick={onBack}>
              VOLTAR AO INÍCIO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paywall Check
  if (!unlocked) {
    return (
      <div className="screen-wrapper">
        <div className="container-main">
          <div className="content-area" style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", padding: "40px 32px", animation: "fadeUp 0.5s ease" }}>
              <div style={{ fontSize: "56px", marginBottom: "24px" }}>🔒</div>
              <div className="cormorant" style={{ fontSize: "32px", color: colors.cream, marginBottom: "8px", fontWeight: 300, lineHeight: 1.1 }}>
                Protocolo Gerado
              </div>
              <p style={{ color: colors.muted, fontSize: "14px", lineHeight: 1.6, marginBottom: "24px", opacity: 0.9 }}>
                Sua IA finalizou a seleção de exercícios e receitas naturais essenciais para sua face. 
              </p>
              
              <div style={{ 
                background: "rgba(201,169,110,0.06)", borderRadius: "14px", padding: "20px", marginBottom: "32px",
                border: `1px solid rgba(201,169,110,0.2)`
              }}>
                <div style={{ color: colors.gold, fontSize: "12px", letterSpacing: "0.15em", marginBottom: "8px", fontWeight: 600 }}>
                  SEU SALDO ATUAL
                </div>
                <div className="cormorant" style={{ fontSize: "42px", color: colors.cream, lineHeight: 1 }}>
                  {credits} <span style={{ fontSize: "24px", color: colors.muted }}>créditos</span>
                </div>
              </div>

              {credits > 0 ? (
                <button className="btn-gold" onClick={handleUnlock}>
                  🔓 DESBLOQUEAR PROTOCOLO (-1 Crédito)
                </button>
              ) : (
                <button className="btn-gold" onClick={onBuyCredits} style={{ background: `linear-gradient(135deg, ${colors.bg}, #1A1A1A)` }}>
                  💎 COMPRAR CRÉDITOS
                </button>
              )}
            </div>
          </div>
          <div className="button-group">
            <button className="btn-ghost" onClick={onBack}>
              ← CANCELAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar exercícios por problema
  const grouped = {};
  for (const ex of protocol.exercises) {
    if (!grouped[ex.problem]) grouped[ex.problem] = [];
    grouped[ex.problem].push(ex);
  }

  const completed = protocol.exercises.filter((ex) => doneList.includes(ex.id)).length;
  const total = protocol.exercises.length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Cabeçalho */}
          <div
            style={{
              background: `linear-gradient(180deg, #1a1206 0%, ${colors.bg} 100%)`,
              padding: "32px 24px 24px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s",
            }}
          >
            <div
              style={{
                color: colors.gold,
                fontSize: "11px",
                letterSpacing: "0.3em",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            >
              PROTOCOLO IA PERSONALIZADO
            </div>
            <div
              className="cormorant"
              style={{
                fontSize: "34px",
                color: colors.cream,
                fontWeight: 300,
                lineHeight: 1.1,
                marginBottom: "16px",
              }}
            >
              Seu Protocolo
            </div>
            <p
              style={{
                color: colors.muted,
                fontSize: "13px",
                lineHeight: 1.5,
                opacity: 0.8,
              }}
            >
              Exercícios selecionados especificamente para as suas necessidades
              faciais, com base na análise da IA.
            </p>
          </div>

          {/* Progresso */}
          <div
            style={{
              padding: "0 24px",
              marginBottom: "28px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s 0.1s",
            }}
          >
            <div
              className="card-glow"
              style={{ display: "flex", gap: "20px", alignItems: "center" }}
            >
              <div style={{ position: "relative" }}>
                <svg width="72" height="72" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={colors.border}
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={colors.gold}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - (total > 0 ? completed / total : 0))}`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <text
                    x="40"
                    y="44"
                    textAnchor="middle"
                    fill={colors.cream}
                    fontSize="14"
                    fontFamily="Cormorant Garamond"
                    fontWeight="400"
                  >
                    {progressPercent}%
                  </text>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: colors.cream,
                    fontSize: "15px",
                    marginBottom: "4px",
                    fontWeight: 600,
                  }}
                >
                  {completed} de {total} exercícios
                </div>
                <div style={{ color: colors.muted, fontSize: "12px", marginBottom: "8px" }}>
                  {completed === total && total > 0
                    ? "✨ Protocolo completo!"
                    : "Continue seu protocolo diário"}
                </div>
                {streak > 0 && (
                  <div
                    style={{
                      color: colors.gold,
                      fontSize: "11px",
                      background: "rgba(201,169,110,0.12)",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      display: "inline-block",
                      border: "1px solid rgba(201,169,110,0.2)",
                      fontWeight: 500,
                    }}
                  >
                    🔥 {streak} dias seguidos
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Problemas detectados (badges) */}
          <div
            style={{
              padding: "0 24px",
              marginBottom: "24px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s 0.15s",
            }}
          >
            <div
              style={{
                color: colors.muted,
                fontSize: "11px",
                letterSpacing: "0.2em",
                marginBottom: "14px",
                fontWeight: 500,
              }}
            >
              ÁREAS EM TRATAMENTO
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.keys(grouped).map((problem) => {
                const info = problemLabels[problem] || {
                  label: problem,
                  emoji: "💎",
                  color: colors.gold,
                };
                return (
                  <div
                    key={problem}
                    onClick={() =>
                      setExpandedProblem(
                        expandedProblem === problem ? null : problem
                      )
                    }
                    style={{
                      background:
                        expandedProblem === problem
                          ? "rgba(201,169,110,0.15)"
                          : "rgba(201,169,110,0.06)",
                      border: `1px solid ${expandedProblem === problem ? "rgba(201,169,110,0.35)" : "rgba(201,169,110,0.12)"}`,
                      borderRadius: "20px",
                      padding: "6px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>{info.emoji}</span>
                    <span
                      style={{
                        color: info.color,
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {info.label}
                    </span>
                    <span
                      style={{
                        color: colors.muted,
                        fontSize: "10px",
                      }}
                    >
                      ({grouped[problem].length})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista de exercícios */}
          <div
            style={{
              padding: "0 24px",
              paddingBottom: "24px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s 0.2s",
            }}
          >
            <div
              style={{
                color: colors.muted,
                fontSize: "11px",
                letterSpacing: "0.2em",
                marginBottom: "16px",
                fontWeight: 500,
              }}
            >
              {expandedProblem
                ? (problemLabels[expandedProblem]?.label || expandedProblem).toUpperCase()
                : "TODOS OS EXERCÍCIOS"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(expandedProblem ? grouped[expandedProblem] || [] : protocol.exercises).map(
                (ex, idx) => {
                  const done = doneList.includes(ex.id);
                  const info = problemLabels[ex.problem] || {
                    label: ex.problem,
                    emoji: "💎",
                    color: colors.gold,
                  };
                  return (
                    <div
                      key={ex.id}
                      className="card-glow"
                      style={{
                        padding: 0,
                        overflow: "hidden",
                        background: done ? "rgba(125,170,138,0.06)" : undefined,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "stretch" }}>
                        {/* Thumbnail: imagem real ou SVG */}
                        <div
                          onClick={() => onExercise(ex.id)}
                          style={{
                            width: "76px",
                            minHeight: "76px",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: ex.image
                              ? undefined
                              : `linear-gradient(135deg, #1C1408, #130E06)`,
                            backgroundImage: ex.image ? `url(${ex.image})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: done ? 0.35 : 0.9,
                            transition: "opacity 0.3s",
                            cursor: "pointer",
                            borderRight: `1px solid ${colors.border}`,
                          }}
                        >
                          {!ex.image && (
                            <ZoneIcon zone={ex.zone} size={48} />
                          )}
                        </div>

                        {/* Info */}
                        <div
                          style={{
                            flex: 1,
                            padding: "14px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {/* Check */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(ex.id);
                            }}
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              background: done ? colors.success : "transparent",
                              border: `2px solid ${done ? colors.success : colors.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              cursor: "pointer",
                              transition:
                                "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                              transform: done ? "scale(1.1)" : "scale(1)",
                            }}
                          >
                            {done && (
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke={colors.bg}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Text */}
                          <div
                            style={{ flex: 1, cursor: "pointer" }}
                            onClick={() => onExercise(ex.id)}
                          >
                            <div
                              style={{
                                color: done ? colors.muted : colors.cream,
                                fontSize: "14px",
                                fontWeight: 500,
                                textDecoration: done ? "line-through" : "none",
                                lineHeight: 1.3,
                                marginBottom: "4px",
                              }}
                            >
                              {ex.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: info.color,
                                  fontSize: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {info.emoji} {ex.zone}
                              </span>
                              <span
                                style={{
                                  width: "3px",
                                  height: "3px",
                                  borderRadius: "50%",
                                  background: colors.muted,
                                  opacity: 0.5,
                                  display: "inline-block",
                                }}
                              />
                              <span
                                style={{
                                  color: colors.muted,
                                  fontSize: "10px",
                                }}
                              >
                                {ex.duration} · {ex.reps}
                              </span>
                              {ex.difficulty && (
                                <>
                                  <span
                                    style={{
                                      width: "3px",
                                      height: "3px",
                                      borderRadius: "50%",
                                      background: colors.muted,
                                      opacity: 0.5,
                                      display: "inline-block",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color:
                                        ex.difficulty === "avançado"
                                          ? colors.rose
                                          : ex.difficulty === "intermediário"
                                            ? colors.gold
                                            : colors.success,
                                      fontSize: "10px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {ex.difficulty}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Receitas Naturais */}
          <div
            style={{
              padding: "0 24px",
              paddingBottom: "32px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s 0.3s",
              marginTop: "16px"
            }}
          >
            <div
              style={{
                color: colors.muted,
                fontSize: "11px",
                letterSpacing: "0.2em",
                marginBottom: "16px",
                fontWeight: 500,
              }}
            >
              TRATAMENTOS NATURAIS SEMANAIS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(protocol.recipes || []).map((rec) => (
                <div key={rec.id} className="card-glow" style={{ padding: "16px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ 
                    width: "48px", height: "48px", borderRadius: "12px", background: "rgba(201,169,110,0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0,
                    border: "1px solid rgba(201,169,110,0.2)"
                  }}>
                    {rec.icon}
                  </div>
                  <div>
                    <div style={{ color: colors.cream, fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                      {rec.name}
                    </div>
                    <div style={{ display: "inline-block", background: "rgba(201,169,110,0.15)", padding: "2px 8px", borderRadius: "4px", color: colors.gold, fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "8px" }}>
                      ⏱️ {rec.freq}
                    </div>
                    <div style={{ color: colors.muted, fontSize: "12px", lineHeight: 1.5, opacity: 0.9 }}>
                      {rec.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Botão voltar */}
        <div className="button-group">
          <button className="btn-ghost" onClick={onBack}>
            ← VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
}
