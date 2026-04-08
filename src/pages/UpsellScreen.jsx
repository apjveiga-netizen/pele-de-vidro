import { useState, useRef } from "react";
import { colors } from "../theme";

const products = [
  {
    icon: "🧴",
    title: "Rotina de Skincare Personalizada",
    desc: "Produtos ideais para seu tipo de pele, com foco em rugas, hidratação profunda, clareamento de manchas e proteção solar! Um cronograma completo e personalizado!",
    price: "R$ 47,00",
    checkoutUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-30352ce8-6286-457a-b620-3c8c0dfec0c0"
  },
  {
    icon: "🥗",
    title: "Alimentação Anti-Idade",
    desc: "Receitas com antioxidantes, colágeno natural e vitaminas específicas para a saúde da sua pele de dentro para fora. Nutrição e saúde a um clique!",
    price: "R$ 29,00",
    checkoutUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-ed64d8a6-8c3c-4043-b333-8be3e40e7aeb"
  },
];

export default function UpsellScreen({ onAccept, onDecline }) {
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleBuy = (item) => {
    if (item.checkoutUrl) {
      window.location.href = item.checkoutUrl;
    } else {
      alert(`Link de pagamento para: ${item.title} (Em breve)`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, padding: "60px 24px 32px" }}>
      {/* Cabeçalho premium */}
      <div style={{
        background: `linear-gradient(135deg, #1e1206, #150e06)`,
        border: `1px solid rgba(201,169,110,0.3)`,
        borderRadius: "16px", padding: "24px 20px", marginBottom: "20px",
        textAlign: "center", animation: "fadeUp 0.5s ease",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
        }} />
        <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "10px", lineHeight: 1.4 }}>
          ✨ PROTOCOLOS PREMIUM
        </div>
        <div className="cormorant shimmer-text" style={{ fontSize: "32px", lineHeight: 1.15, fontWeight: 300, marginBottom: "10px" }}>
          Sua Versão Diamante
        </div>
        <p style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.6 }}>
          Acesse consultorias visagistas e nutrológicas em tempo real feitas pela Inteligência Artificial.
        </p>
      </div>

      {/* Lista de Produtos Isolados */}
      <div style={{ animation: "fadeUp 0.5s ease 0.15s both" }}>
        <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "16px", textAlign: "center" }}>
          DESBLOQUEIE SUA MELHOR VERSÃO
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
          {products.map((item, i) => (
            <div key={i} style={{
              background: colors.card, borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              overflow: "hidden",
              position: "relative"
            }}>
               {/* Padlock Icon top right */}
               <div style={{
                 position: "absolute", top: "12px", right: "12px",
                 background: "rgba(201,169,110,0.1)", borderRadius: "50%",
                 width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                 fontSize: "12px"
               }}>
                 🔒
               </div>

              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start", paddingRight: "30px" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "-2px" }}>{item.icon}</span>
                  <div>
                    <div style={{ color: colors.cream, fontSize: "15px", fontWeight: 500, lineHeight: 1.3, marginBottom: "6px" }}>
                      {item.title}
                    </div>
                    <div style={{ color: colors.muted, fontSize: "12px", lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: "16px", paddingTop: "16px", borderTop: `1px solid rgba(255,255,255,0.05)`
                }}>
                  <div className="cormorant" style={{ fontSize: "24px", color: colors.gold, fontWeight: 400 }}>
                    {item.price}
                  </div>
                  <button 
                    onClick={() => handleBuy(item)}
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, #a67c00)`,
                      color: "#fff", border: "none", borderRadius: "8px",
                      padding: "10px 20px", fontSize: "13px", fontWeight: 600,
                      letterSpacing: "0.05em", cursor: "pointer"
                    }}
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garantia */}
      <div style={{
        display: "flex", gap: "12px", alignItems: "flex-start",
        background: colors.card, borderRadius: "14px", padding: "14px",
        marginBottom: "24px", animation: "fadeUp 0.5s ease 0.3s both",
        border: `1px solid ${colors.border}`
      }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
          <path d="M16 2L28 7V16C28 22.63 22.63 29.25 16 30C9.37 29.25 4 22.63 4 16V7L16 2Z" stroke={colors.gold} strokeWidth="1.2" fill="rgba(201,169,110,0.1)"/>
          <path d="M10 16L14 20L22 12" stroke={colors.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div style={{ color: colors.cream, fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>Garantia de 7 dias</div>
          <div style={{ color: colors.muted, fontSize: "11px", lineHeight: 1.5 }}>Para qualquer um dos produtos adquiridos. Se não ficar satisfeita, devolvemos 100% do seu dinheiro.</div>
        </div>
      </div>
    </div>
  );
}
