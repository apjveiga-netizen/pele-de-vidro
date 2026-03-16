import { useState } from "react";
import { supabase } from "../lib/supabase";
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
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          // If user already exists, try to sign in instead
          if (error.message.includes("already registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (signInError) throw signInError;
            if (onLogin) onLogin(signInData.user);
            return;
          }
          throw error;
        }

        // If signup was successful and we have a session, log them in
        if (data?.session) {
          if (onLogin) onLogin(data.user);
        } else {
          alert("Acesso configurado! Se você desativou a confirmação de e-mail, pode fazer login agora.");
          setIsRegister(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (onLogin) onLogin(data.user);
      }
    } catch (error) {
      alert(error.message || "Erro ao processar solicitação.");
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

        </div>
      </div>
    </div>
  );
}
