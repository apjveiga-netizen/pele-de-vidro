import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getScans, addScan, deleteScan, getProfile, getDailyProgress } from "../data/store";

export default function ScanHistoryScreen() {
  const [scans, setScans] = useState([]);
  const [practicedDays, setPracticedDays] = useState(0);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ realAge: "30", visualAge: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    setScans(getScans());
    const progress = getDailyProgress();
    // Count unique days in progress
    const uniqueDays = new Set(progress.map(p => p.date)).size;
    setPracticedDays(uniqueDays);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleCreateScan = () => {
    const realAge = parseInt(form.realAge) || 30;
    const visualAge = parseInt(form.visualAge) || realAge + 5;
    const zones = [
      { zone: "Maçãs do rosto", severity: Math.floor(Math.random() * 40 + 40), label: "Volume reduzido" },
      { zone: "Contorno da mandíbula", severity: Math.floor(Math.random() * 40 + 30), label: "Definição moderada" },
      { zone: "Testa / linhas de expressão", severity: Math.floor(Math.random() * 40 + 20), label: "Linhas superficiais" },
      { zone: "Pescoço", severity: Math.floor(Math.random() * 40 + 15), label: "Flacidez leve" },
    ];
    addScan({ realAge, visualAge, zones });
    setScans(getScans());
    setShowNewScan(false);
    setForm({ realAge: String(realAge), visualAge: "" });
  };

  const handleDelete = (id) => {
    deleteScan(id);
    setScans(getScans());
    setConfirmDelete(null);
    setSelectedScan(null);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: "24px", opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}>
        <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.25em", marginBottom: "8px" }}>
          HISTÓRICO
        </div>
        <div className="cormorant" style={{ fontSize: "28px", color: colors.cream, fontWeight: 300, lineHeight: 1.2, marginBottom: "8px" }}>
          Evolução
        </div>
        <p style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.5 }}>
          Acompanhe a evolução da sua pele ao longo do tempo.
        </p>
        <div style={{ 
          marginTop: "16px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`,
          padding: "12px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px"
        }}>
          <span style={{ fontSize: "20px" }}>📅</span>
          <div>
            <div style={{ color: colors.gold, fontSize: "16px", fontWeight: 600 }}>{practicedDays} dias</div>
            <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.05em" }}>DE PRÁTICA ATÉ AGORA</div>
          </div>
        </div>
      </div>

      {/* Botão novo scan */}
      <button
        className="btn-gold"
        onClick={() => setShowNewScan(true)}
        style={{ marginBottom: "20px", opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.1s" }}
      >
        📊 NOVO SCAN
      </button>

      {/* Lista de scans */}
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.2s" }}>
        <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "14px" }}>
          {scans.length} SCAN{scans.length !== 1 ? "S" : ""} REGISTRADO{scans.length !== 1 ? "S" : ""}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {scans.map((scan) => {
            const diff = scan.visualAge - scan.realAge;
            return (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                style={{
                  background: colors.card, border: `1px solid ${colors.border}`,
                  borderRadius: "16px", padding: "16px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: colors.muted, fontSize: "12px" }}>{formatDate(scan.date)}</span>
                  <div style={{
                    background: diff > 0 ? "rgba(196,122,122,0.12)" : "rgba(125,170,138,0.12)",
                    border: `1px solid ${diff > 0 ? "rgba(196,122,122,0.3)" : "rgba(125,170,138,0.3)"}`,
                    borderRadius: "8px", padding: "4px 10px",
                  }}>
                    <span style={{ color: diff > 0 ? colors.danger : colors.success, fontSize: "12px", fontWeight: 600 }}>
                      {diff > 0 ? `+${diff}` : diff} anos
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.1em" }}>REAL</div>
                    <div className="cormorant" style={{ fontSize: "28px", color: colors.cream, fontWeight: 300 }}>
                      {scan.realAge}
                    </div>
                  </div>
                  <div style={{ color: colors.border, fontSize: "20px", alignSelf: "center" }}>→</div>
                  <div>
                    <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.1em" }}>VISUAL</div>
                    <div className="cormorant" style={{ fontSize: "28px", color: diff > 0 ? colors.danger : colors.success, fontWeight: 400 }}>
                      {scan.visualAge}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {scans.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: colors.muted }}>
              <p style={{ fontSize: "14px", marginBottom: "4px" }}>Nenhum scan registrado ainda.</p>
              <p style={{ fontSize: "12px" }}>Faça seu primeiro scan para acompanhar sua evolução.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Novo Scan */}
      {showNewScan && (
        <div className="modal-overlay" onClick={() => setShowNewScan(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "6px" }}>
              NOVO SCAN
            </div>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "20px" }}>
              Registrar análise
            </div>

            <div className="form-group">
              <label className="form-label">Idade Real</label>
              <input
                className="form-input"
                type="number"
                value={form.realAge}
                onChange={(e) => setForm({ ...form, realAge: e.target.value })}
                placeholder="Ex: 35"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Idade Visual (resultado do scan)</label>
              <input
                className="form-input"
                type="number"
                value={form.visualAge}
                onChange={(e) => setForm({ ...form, visualAge: e.target.value })}
                placeholder="Ex: 40"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn-ghost btn-small" onClick={() => setShowNewScan(false)} style={{ flex: 1 }}>
                CANCELAR
              </button>
              <button className="btn-gold btn-small" onClick={handleCreateScan} style={{ flex: 1 }}>
                REGISTRAR SCAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Scan */}
      {selectedScan && (
        <div className="modal-overlay" onClick={() => setSelectedScan(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "6px" }}>
              DETALHES DO SCAN
            </div>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "4px" }}>
              Análise de {formatDate(selectedScan.date)}
            </div>

            <div style={{ display: "flex", gap: "20px", margin: "16px 0", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div className="cormorant" style={{ fontSize: "36px", color: colors.cream, fontWeight: 300 }}>{selectedScan.realAge}</div>
                <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "0.1em" }}>CRONOLÓGICA</div>
              </div>
              <div style={{ color: colors.border, fontSize: "20px", alignSelf: "center" }}>→</div>
              <div style={{ textAlign: "center" }}>
                <div className="cormorant" style={{ fontSize: "36px", color: colors.danger, fontWeight: 400 }}>{selectedScan.visualAge}</div>
                <div style={{ color: colors.danger, fontSize: "10px", letterSpacing: "0.1em", opacity: 0.8 }}>VISUAL ATUAL</div>
              </div>
            </div>

            {selectedScan.zones && selectedScan.zones.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.15em", marginBottom: "10px" }}>
                  ZONAS DE PRIORIDADE
                </div>
                {selectedScan.zones.map((z, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: colors.cream, fontSize: "12px" }}>{z.zone}</span>
                      <span style={{ color: colors.muted, fontSize: "11px" }}>{z.severity}%</span>
                    </div>
                    <div style={{ height: "3px", background: colors.border, borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "2px", background: colors.gold, width: `${z.severity}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn-ghost btn-small" onClick={() => setSelectedScan(null)} style={{ flex: 1 }}>
                FECHAR
              </button>
              <button className="btn-danger btn-small" onClick={() => { setConfirmDelete(selectedScan.id); }} style={{ flex: 1 }}>
                🗑 APAGAR SCAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar exclusão */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "8px" }}>
              Apagar este scan?
            </div>
            <p style={{ color: colors.muted, fontSize: "13px", marginBottom: "20px" }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost btn-small" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>
                CANCELAR
              </button>
              <button className="btn-danger" onClick={() => handleDelete(confirmDelete)} style={{ flex: 1 }}>
                SIM, APAGAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
