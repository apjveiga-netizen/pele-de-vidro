import { useState } from "react";
import { colors } from "../theme";

export default function OfferScreen({ onNext, onUpsell, userEmail, credits }) {
  const [email, setEmail] = useState(userEmail || "");
  const [loading, setLoading] = useState(false);

  const allPlans = [
    { 
      id: 1, 
      name: "PACOTE DE ANÁLISES", 
      price: "R$ 29", 
      creditsValue: 3,
      credits: "3 novas análises faciais com IA",
      desc: "Os créditos nunca expiram.",
      features: [
        "Compre créditos e acompanhe o seu desempenho semanal, quinzenal ou mensal.", 
        "Receba novos protocolos de acordo com a sua evolução"
      ],
      tag: "MELHOR VALOR" 
    }
  ];

  const plans = allPlans;

  const handleCheckout = (planName) => {
    if (!email || !email.includes("@")) {
      alert("Por favor, insira um e-mail válido para vincular seus créditos.");
      return;
    }
    // Redirect directly to the generated Mercado Pago Link
    window.location.href = "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-b3c6a643-5ab5-4ce2-88bb-75ece89bd0b0";
  };

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <div style={{ color: colors.gold, fontSize: "11px", letterSpacing: "0.3em", marginBottom: "12px", fontWeight: 600 }}>
              PACOTE DE CRÉDITOS IA
            </div>
            <div className="cormorant shimmer-text" style={{ fontSize: "36px", lineHeight: 1.1, fontWeight: 300, marginBottom: "16px" }}>
              Upgrade
            </div>
            <div style={{ 
              background: "rgba(201,169,110,0.08)", 
              display: "inline-block", 
              padding: "8px 16px", 
              borderRadius: "20px", 
              marginBottom: "20px",
              border: "1px solid rgba(201,169,110,0.15)"
            }}>
              <span style={{ color: colors.gold, fontSize: "12px", fontWeight: "600" }}>PAGAMENTO ÚNICO — ACESSO IMEDIATO</span>
            </div>
            
            <div style={{ marginTop: "16px", marginBottom: "12px" }}>
              <input 
                type="email" 
                placeholder="Confirme seu melhor e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${email ? colors.gold : colors.border}`,
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  outline: "none",
                  textAlign: "center",
                  transition: "all 0.3s ease"
                }}
              />
              <p style={{ color: colors.muted, fontSize: "12px", marginTop: "14px", opacity: 0.8 }}>
                Seus créditos serão vinculados a este endereço.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
            {plans.map((plan) => (
              <div key={plan.id} className="card-glow" style={{
                border: plan.id === 2 ? `1px solid rgba(201,169,110,0.4)` : undefined,
                background: plan.id === 2 ? `linear-gradient(135deg, rgba(201,169,110,0.08), rgba(10,9,8,1))` : undefined,
                position: "relative", overflow: "hidden",
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? "none" : "auto",
                transition: "all 0.3s ease",
                paddingBottom: "24px" // Added padding to prevent button clipping
              }}>
                {plan.tag && (
                  <div style={{
                    position: "absolute", top: "0", right: "0",
                    background: plan.id === 2 ? colors.gold : colors.border,
                    color: plan.id === 2 ? "#000" : colors.muted,
                    fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em",
                    padding: "8px 14px", borderBottomLeftRadius: "14px",
                  }}>
                    {plan.tag}
                  </div>
                )}
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                  <div>
                    <div style={{ color: colors.gold, fontSize: "14px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "6px" }}>
                      {plan.name}
                    </div>
                    <div className="cormorant" style={{ fontSize: "44px", color: colors.cream, fontWeight: 300, lineHeight: 1 }}>
                      {plan.price}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: "rgba(201,169,110,0.06)", borderRadius: "14px", padding: "16px", marginBottom: "20px",
                  border: `1px solid rgba(201,169,110,0.2)`
                }}>
                  <div style={{ color: colors.gold, fontSize: "16px", fontWeight: 700, marginBottom: "4px", letterSpacing: "0.05em" }}>
                    ✨ {plan.credits}
                  </div>
                  <div style={{ color: colors.cream, fontSize: "13px", opacity: 0.9, fontWeight: 500 }}>{plan.desc}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M20 6L9 17L4 12" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                      </svg>
                      <span style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.4 }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleCheckout(plan.name)}
                  className="btn-gold"
                >
                  {loading ? "PROCESSANDO..." : "COMPRAR CRÉDITOS AGORA"}
                </button>
              </div>
            ))}
          </div>

          <div className="card-glow" style={{
            display: "flex", gap: "16px", alignItems: "center",
            background: "rgba(201,169,110,0.04)", 
            marginBottom: "32px"
          }}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
              <path d="M16 2L28 7V16C28 22.63 22.63 29.25 16 30C9.37 29.25 4 22.63 4 16V7L16 2Z" stroke={colors.gold} strokeWidth="1.5" fill="rgba(201,169,110,0.1)"/>
              <path d="M10 16L14 20L22 12" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div style={{ color: colors.cream, fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Segurança Garantida</div>
              <div style={{ color: colors.muted, fontSize: "12px", lineHeight: 1.5, opacity: 0.8 }}>Processamento seguro via criptografia avançada.</div>
            </div>
          </div>
        </div>

        <div className="button-group" style={{ paddingBottom: "32px", position: "relative" }}>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            🔄 Já fiz o pagamento
          </button>
          <button onClick={onNext} className="btn-text">
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}
