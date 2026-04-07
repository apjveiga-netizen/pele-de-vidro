import { useState, useEffect, useRef } from "react";
import { colors } from "../theme";
import { getProfile, saveProfile, getStreak, getScans, getDailyProgress, getExercises, resetAllData } from "../data/store";

export default function ProfileScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("pele_de_vidro_email");
    if (!email) return alert("Erro: E-mail não encontrado.");

    setPasswordLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          oldPassword: passwordForm.oldPassword, 
          newPassword: passwordForm.newPassword 
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Senha alterada com sucesso!");
        setShowPasswordModal(false);
        setPasswordForm({ oldPassword: "", newPassword: "" });
      } else {
        alert(data.error || "Erro ao alterar senha.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setPasswordLoading(false);
    }
  };
  const [profile, setProfile] = useState({ name: "", age: 30, avatarUrl: "" });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", age: "" });
  const [showReset, setShowReset] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState({ streak: 0, scans: 0, todayDone: 0, totalExercises: 0 });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [email, setEmail] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const p = getProfile();
    const storedEmail = localStorage.getItem("pele_de_vidro_email") || "";
    setEmail(storedEmail);
    setProfile(p);
    setForm({ name: p.name, age: String(p.age) });
    setStats({
      streak: getStreak(),
      scans: getScans().length,
      todayDone: getDailyProgress().length,
      totalExercises: getExercises().length,
    });
    setTimeout(() => setVisible(true), 100);

    // Refresh profile from server
    if (storedEmail) {
      fetch(`http://localhost:3001/api/profile/${storedEmail}`)
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            const updated = {
              name: data.name || p.name,
              age: data.age || p.age,
              avatarUrl: data.avatar_url || ""
            };
            setProfile(updated);
            saveProfile(updated);
          }
        });
    }
  }, []);

  const handleSave = async () => {
    const updated = { name: form.name || "Usuária", age: parseInt(form.age) || 30 };
    saveProfile(updated);
    setProfile({ ...profile, ...updated });
    setEditing(false);

    // Sync with server
    const email = localStorage.getItem("pele_de_vidro_email");
    if (email) {
      await fetch("http://localhost:3001/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...updated })
      });
    }
  };

  const handleReset = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Cabeçalho */}
          <div style={{ marginBottom: "32px", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
            <div style={{ color: colors.gold, fontSize: "11px", letterSpacing: "0.3em", marginBottom: "12px", fontWeight: 600 }}>
              CONFIGURAÇÕES
            </div>
            <div className="cormorant" style={{ fontSize: "36px", color: colors.cream, fontWeight: 300, lineHeight: 1.1 }}>
              Área do <br/>Cliente
            </div>
          </div>

          {/* Avatar Simplificado */}
          <div className="card-glow" style={{
            padding: "40px 24px",
            marginBottom: "24px",
            textAlign: "center",
            opacity: visible ? 1 : 0, transition: "all 0.6s ease 0.1s",
          }}>
            <div style={{
                width: "84px", height: "84px", borderRadius: "50%", margin: "0 auto 24px",
                background: `linear-gradient(135deg, ${colors.gold}, #1a1410)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", color: "#000",
                border: `2px solid rgba(201,169,110,0.3)`,
                boxShadow: `0 0 20px rgba(201,169,110,0.2)`
              }}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>

            {editing ? (
              <div style={{ textAlign: "left" }}>
                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="form-label" style={{ fontSize: "11px", letterSpacing: "0.1em", color: colors.gold }}>NOME COMPLETO</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome"
                    style={{ borderRadius: "12px", padding: "14px", background: "rgba(255,255,255,0.03)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="btn-secondary btn-small" onClick={() => setEditing(false)} style={{ flex: 1 }}>
                    CANCELAR
                  </button>
                  <button className="btn-gold btn-small" onClick={handleSave} style={{ flex: 1 }}>
                    SALVAR
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="cormorant" style={{ fontSize: "32px", color: colors.cream, fontWeight: 300, marginBottom: "4px" }}>
                  {profile.name || "Usuária"}
                </div>
                <div style={{ color: colors.gold, fontSize: "14px", marginBottom: "32px", opacity: 0.8, letterSpacing: "0.02em" }}>
                  {email}
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setEditing(true)}
                  >
                    ✏️ EDITAR PERFIL
                  </button>
                  <button
                    className="btn-gold"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    🔐 ALTERAR SENHA
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div style={{ marginTop: "20px" }}>
             <button className="btn-text" onClick={() => setShowReset(true)} style={{ width: "100%", color: "#EA5455", opacity: 0.8 }}>
                REINICIAR TODOS OS DADOS
             </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "8px" }}>
              Resetar todos os dados?
            </div>
            <p style={{ color: colors.muted, fontSize: "13px", marginBottom: "20px", lineHeight: 1.5 }}>
              Todos os seus exercícios, scans, progresso e configurações serão apagados permanentemente.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost btn-small" onClick={() => setShowReset(false)} style={{ flex: 1 }}>
                CANCELAR
              </button>
              <button className="btn-danger btn-small" onClick={handleReset} style={{ flex: 1 }}>
                SIM, RESETAR
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="cormorant" style={{ fontSize: "24px", color: colors.cream, marginBottom: "20px", textAlign: "center" }}>
              Alterar Senha
            </h2>
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: colors.muted, fontSize: "11px", marginBottom: "8px", display: "block" }}>SENHA ATUAL</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label style={{ color: colors.muted, fontSize: "11px", marginBottom: "8px", display: "block" }}>NOVA SENHA</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" className="btn-ghost btn-small" onClick={() => setShowPasswordModal(false)} style={{ flex: 1 }}>
                  CANCELAR
                </button>
                <button type="submit" className="btn-gold btn-small" disabled={passwordLoading} style={{ flex: 1 }}>
                  {passwordLoading ? "..." : "SALVAR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
