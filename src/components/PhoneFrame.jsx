import { colors } from "../theme";

export default function PhoneFrame({ children, onBack, showBack }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "20px",
      background: "radial-gradient(ellipse at center, #1a1410 0%, #050403 70%)",
      fontFamily: "DM Sans, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;700&family=Inter:wght@400;500;600&display=swap');
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        ::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A96E 0%, #F5EFE6 50%, #C9A96E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>
      <div style={{ width: "100%", maxWidth: "380px", position: "relative" }}>
        <div style={{
          background: "linear-gradient(145deg, #2a2420, #1a1410)",
          borderRadius: "54px", padding: "14px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", width: "110px", height: "30px", background: "#0a0908", borderRadius: "15px", zIndex: 10 }} />
          <div style={{
            borderRadius: "44px", overflow: "hidden", height: "760px", background: colors.bg, position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50px", zIndex: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {showBack && (
                  <button onClick={onBack} style={{ background: "rgba(30,25,20,0.8)", border: `1px solid ${colors.border}`, borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke={colors.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", opacity: 0 }}>
                {/* Icons Removed */}
              </div>
            </div>
            <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column", paddingTop: "50px" }}>
              {children}
            </div>
          </div>
        </div>
        <div style={{ width: "120px", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", margin: "16px auto 0" }} />
      </div>
    </div>
  );
}
