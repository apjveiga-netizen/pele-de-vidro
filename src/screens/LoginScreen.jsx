import { useState } from "react";
import { colors } from "../theme";

export default function LoginScreen({ onLogin, onRegisterToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Por favor, preencha todos os campos.");

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        if (isRegister) {
          alert("Acesso definido com sucesso! Agora faça login.");
          setIsRegister(false);
        } else {
          onLogin(data.user);
        }
      } else {
        alert(data.error || "Erro ao processar solicitação.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-wrapper">
      <div className="container-main" style={{ justifyContent: "center" }}>
        <div className="content-area" style={{ justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="cormorant shimmer-text" style={{ fontSize: "48px", color: colors.cream, fontWeight: 300, lineHeight: 1 }}>
              Pele de Vidro
            </div>
            <p style={{ color: colors.gold, fontSize: "12px", letterSpacing: "0.3em", marginTop: "12px", fontWeight: 600 }}>
              PROTOCOLOS EXCLUSIVOS
            </p>
          </div>

          <div className="card-glow" style={{ 
            padding: "40px 28px", 
            marginBottom: "24px",
            animation: "fadeUp 0.6s ease"
          }}>
            <h2 className="cormorant" style={{ fontSize: "28px", color: colors.cream, marginBottom: "32px", textAlign: "center", fontWeight: 300 }}>
              {isRegister ? "Definir senha de acesso" : "Bem-vinda de volta"}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "11px", letterSpacing: "0.1em", color: colors.gold }}>E-MAIL DE COMPRA</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="Seu melhor e-mail"
                  className="form-input"
                  style={{ borderRadius: "14px", padding: "16px", background: "rgba(255,255,255,0.03)" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "11px", letterSpacing: "0.1em", color: colors.gold }}>SENHA</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="form-input"
                  style={{ borderRadius: "14px", padding: "16px", background: "rgba(255,255,255,0.03)" }}
                />
                {isRegister && (
                  <p style={{ color: colors.gold, fontSize: "11px", marginTop: "12px", fontWeight: 500, lineHeight: 1.5 }}>
                    💡 Use o mesmo e-mail que você utilizou para adquirir seus créditos.
                  </p>
                )}
              </div>

              <button className="btn-gold" disabled={loading} style={{ marginTop: "12px" }}>
                {loading ? "PROCESSANDO..." : isRegister ? "DEFINIR MEU ACESSO" : "ENTRAR NO SISTEMA"}
              </button>
            </form>
          </div>
          
          <p style={{ color: colors.muted, fontSize: "11px", textAlign: "center", marginTop: "40px", lineHeight: 1.6, opacity: 0.7 }}>
            Ambiente seguro com criptografia <br/> de nível bancário.
          </p>
        </div>
        
        <div className="button-group">
          <button 
            className="btn-text"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Já possui acesso? Fazer Login" : "Primeiro acesso? Definir Senha"}
          </button>

          <button 
            onClick={() => onLogin({ email: "demo@peledevidro.com.br", name: "Usuária VIP" })}
            className="btn-secondary"
            style={{ 
              background: "rgba(201,169,110,0.08)", border: `1px solid rgba(201,169,110,0.2)`, color: colors.gold, 
              fontSize: "12px", fontWeight: 600
            }}
          >
            🔓 ACESSO DE TESTE (Modo Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
