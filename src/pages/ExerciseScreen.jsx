import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getExerciseById, toggleExerciseDone, isExerciseDone, getProtocol } from "../data/store";
import ZoneIcon from "../components/ZoneIcon";
import VideoPlayer from "../components/VideoPlayer";

export default function ExerciseScreen({ exerciseId, onBack }) {
  const [exercise, setExercise] = useState(null);
  const [phase, setPhase] = useState("ready"); // "ready", "active", "rest", "paused", "done"
  const [timer, setTimer] = useState(10);
  const [rep, setRep] = useState(1);
  const [activeVideoStep, setActiveVideoStep] = useState(0);
  const [previousPhase, setPreviousPhase] = useState("ready"); // Para lembrar qual fase estava rodando antes de pausar
  const totalReps = 15;

  useEffect(() => {
    // Buscar no store antigo e no protocolo
    let ex = getExerciseById(exerciseId);
    if (!ex) {
      // Fallback for immediate protocol match if not in store yet
      const protocol = getProtocol();
      if (protocol && protocol.exercises) {
        ex = protocol.exercises.find((e) => e.id === exerciseId) || null;
      }
    }
    if (!ex) { onBack(); return; }
    setExercise(ex);
  }, [exerciseId, onBack]);

  useEffect(() => {
    if (phase !== "active" && phase !== "rest") return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (phase === "active") {
            if (rep >= totalReps) { setPhase("done"); return 0; }
            setPhase("rest"); setTimer(3); setRep((r) => r + 1); return 3;
          } else {
            setPhase("active"); setTimer(10); return 10;
          }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, rep]);

  // Controle do Passo-a-passo (Cadência Contínua e Lenta)
  useEffect(() => {
    if (!exercise?.videoSteps?.length || phase === "done" || phase === "ready") return;
    
    // Rotação contínua de 6s, independente das repetições/descanso
    const totalSteps = exercise.videoSteps.length;
    const intervalRef = setInterval(() => {
      // Avança o passo apenas se NÃO estiver pausado
      if (phase !== "paused") {
        setActiveVideoStep((s) => (s + 1) % totalSteps);
      }
    }, 6000); 

    return () => clearInterval(intervalRef);
  }, [exercise?.id, phase === "done", phase === "ready"]); 

  const handleDone = () => {
    if (exercise && !isExerciseDone(exercise.id)) {
      toggleExerciseDone(exercise.id);
    }
    onBack();
  };

  if (!exercise) return null;

  const videoSteps = exercise.videoSteps && exercise.videoSteps.length > 0
    ? exercise.videoSteps
    : ["Realize o exercício conforme indicado", "Respire normalmente durante todo o exercício"];

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Voltar */}
          <button onClick={onBack} className="btn-text" style={{ padding: 0, width: "auto", marginBottom: "16px" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: "6px" }}>
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            VOLTAR
          </button>

          {exercise.video ? (
            <div style={{ marginBottom: "20px" }}>
              <VideoPlayer src={exercise.video} poster={exercise.image} />
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "4px" }}>
                  #{exercise.zone.toUpperCase()}
                </div>
                <div className="cormorant" style={{ fontSize: "24px", color: colors.cream, fontWeight: 300 }}>
                  {exercise.name}
                </div>
              </div>
            </div>
          ) : exercise.image ? (
            <div style={{
              borderRadius: "16px", overflow: "hidden", marginBottom: "16px",
              height: "180px", position: "relative",
            }}>
              <img
                src={exercise.image}
                alt={exercise.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.2) 50%, transparent 100%)",
              }} />
              <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "14px" }}>
                <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "4px" }}>
                  #{exercise.zone.toUpperCase()}
                </div>
                <div className="cormorant" style={{ fontSize: "24px", color: colors.cream, fontWeight: 300 }}>
                  {exercise.name}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              borderRadius: "16px", overflow: "hidden", marginBottom: "16px",
              height: "160px", position: "relative",
              background: "linear-gradient(135deg, #1C1408, #130E06)",
              border: `1px solid ${colors.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "12px",
            }}>
              <ZoneIcon zone={exercise.zone} size={64} />
              <div style={{ textAlign: "center", padding: "0 14px" }}>
                <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "4px" }}>
                  #{exercise.zone.toUpperCase()}
                </div>
                <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300 }}>
                  {exercise.name}
                </div>
              </div>
            </div>
          )}

          {/* Timer circular */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ position: "relative", width: "140px", height: "140px" }}>
              <svg width="140" height="140" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r="70" stroke={colors.border} strokeWidth="8" fill="none"/>
                <circle cx="80" cy="80" r="70" fill="none"
                  stroke={phase === "active" ? colors.gold : phase === "rest" ? colors.success : colors.border}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (timer / 10)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div className="cormorant" style={{ fontSize: "42px", color: colors.cream, fontWeight: 300, lineHeight: 1 }}>
                  {phase === "ready" ? "GO" : phase === "done" ? "✓" : timer}
                </div>
                <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.15em" }}>
                  {phase === "ready" ? "PRONTA?" : phase === "active" ? "ATIVO" : phase === "rest" ? "DESCANSO" : phase === "paused" ? "PAUSADO" : "CONCLUÍDO"}
                </div>
              </div>
            </div>
          </div>

          {/* Contador de reps */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "5px", flexWrap: "wrap",
            marginBottom: "18px"
          }}>
            {Array.from({ length: totalReps }).map((_, i) => (
              <div key={i} style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: i < rep - 1 ? colors.gold : i === rep - 1 && phase === "active" ? colors.goldLight : colors.border,
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          {/* Vídeo tutorial step-by-step */}
          <div style={{
            background: `linear-gradient(135deg, #1C1408, #130E06)`,
            borderRadius: "16px", padding: "16px",
            border: `1px solid rgba(201,169,110,0.15)`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ color: colors.gold, fontSize: "11px", letterSpacing: "0.15em" }}>
                🎬 PASSO {activeVideoStep + 1}/{videoSteps.length}
              </div>
            </div>
            <p style={{ color: colors.cream, fontSize: "13px", lineHeight: 1.5, minHeight: "45px" }}>
              {videoSteps[activeVideoStep]}
            </p>
          </div>
        </div>

        <div className="button-group">
          {phase === "done" ? (
            <button className="btn-gold" onClick={handleDone}>
              ✓ CONCLUÍDO
            </button>
          ) : (
            <button className="btn-gold" onClick={() => {
              if (phase === "ready") {
                setPhase("active");
              } else if (phase === "active" || phase === "rest") {
                setPreviousPhase(phase);
                setPhase("paused");
              } else if (phase === "paused") {
                setPhase(previousPhase);
              }
            }}>
              {phase === "ready" ? "▶ INICIAR" : (phase === "active" || phase === "rest") ? "⏸ PAUSAR" : "▶ RETOMAR"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
