import { colors } from "../theme";

export default function MenuScreen({ onNavigate, screens }) {
  const menuItems = [
    { label: "Upload", screen: screens.UPLOAD, icon: "📤", desc: "Envie suas fotos para análise" },
    { label: "Upsell", screen: screens.UPSELL_TEMP, icon: "⭐", desc: "Minha Melhor Versão" },
    { label: "Diamante", screen: screens.UPSELL, icon: "💎", desc: "Protocolos Exclusivos" },
    { label: "Página de Vendas", screen: screens.SALES_PAGE, icon: "🛒", desc: "Ver a oferta principal" },
    { label: "Seu Protocolo", screen: screens.DASHBOARD, icon: "📋", desc: "Resumo do seu plano" },
  ];

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          <div style={{ marginBottom: "32px" }}>
            <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.25em", marginBottom: "8px" }}>
              MENU ADICIONAL
            </div>
            <div className="cormorant" style={{ fontSize: "32px", color: colors.cream, fontWeight: 300, lineHeight: 1.2 }}>
              Explorar
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate(item.screen)}
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "18px",
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  width: "100%",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}
                className="card-glow"
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  border: "1px solid rgba(201,169,110,0.1)",
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: colors.cream, fontSize: "17px", fontWeight: 600, marginBottom: "4px" }}>
                    {item.label}
                  </div>
                  <div style={{ color: colors.muted, fontSize: "12px", lineHeight: 1.4, opacity: 0.8 }}>
                    {item.desc}
                  </div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                  <path d="M9 18L15 12L9 6" stroke={colors.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="button-group">
          {/* Optional: Add a logout or settings link here if needed */}
        </div>
      </div>
    </div>
  );
}
