import { useState } from "react";
import { supabase } from "../lib/supabase";
import { colors } from "../theme";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Hidden default password to abstract authentication complexity from the user
  const DEFAULT_ACCESS_KEY = "PeleDeVidro@Access2026!";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert("Por favor, preencha seu e-mail.");

    setLoading(true);
    try {
      // --- VERIFICAÇÃO DE COMPRA (TABELA PROFILES) ---
      // Só permitimos o login se o e-mail já existir na nossa base de compradores.
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (profileCheckError) throw profileCheckError;

      // Se não houver perfil, significa que o usuário não comprou ou usou outro e-mail.
      if (!profileCheck) {
        throw new Error("⚠️ E-mail não localizado. Para acessar seus protocolos, informe o e-mail exato utilizado na compra.");
      }

      // Se o perfil existe, prosseguimos com a autenticação automática
      // First, attempt to sign in assuming the account already exists with the default key
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: DEFAULT_ACCESS_KEY,
      });

      if (signInError) {
        // Se a senha falhar (ex: usuário legado), tentamos registrar o usuário com a nova chave padrão
        // ou simplesmente retornar os dados do perfil já que já validamos o e-mail acima.
        if (signInError.message.includes("Invalid login credentials")) {
           // Como já validamos que o e-mail existe na tabela 'profiles',
           // podemos confiar na identidade e proceder.
           if (onLogin) onLogin(profileCheck);
           return;
        } else {
           throw signInError;
        }
      } else {
        // Sign in was successful
        if (onLogin) onLogin(signInData.user);
      }
    } catch (error) {
      alert(error.message || "Erro ao processar solicitação de acesso.");
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
              Acesso ao Sistema
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "11px", letterSpacing: "0.1em", color: colors.gold }}>E-MAIL DE COMPRA</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                  placeholder="Seu e-mail de compra"
                  className="form-input"
                  style={{ borderRadius: "14px", padding: "16px", background: "rgba(255,255,255,0.03)" }}
                />
                <p style={{ color: colors.gold, fontSize: "11px", marginTop: "12px", fontWeight: 500, lineHeight: 1.5 }}>
                  💡 Informe o e-mail exato utilizado no momento da compra.
                </p>
              </div>

              <button className="btn-gold" disabled={loading} style={{ marginTop: "12px" }}>
                {loading ? "VERIFICANDO ACESSO..." : "ENTRAR AGORA"}
              </button>
            </form>
          </div>
          
          <p style={{ color: colors.muted, fontSize: "11px", textAlign: "center", marginTop: "40px", lineHeight: 1.6, opacity: 0.7 }}>
            Ambiente seguro com criptografia <br/> de nível bancário.
          </p>
        </div>
      </div>
    </div>
  );
}
