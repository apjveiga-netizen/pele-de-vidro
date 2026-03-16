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
      <div style={{ width: "100%", maxWidth: "360px", position: "relative" }}>
        <div style={{
          background: "linear-gradient(145deg, #2a2420, #1a1410)",
          borderRadius: "44px", padding: "10px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <div style={{ position: "absolute", top: "18px", left: "50%", transform: "translateX(-50%)", width: "100px", height: "28px", background: "#0a0908", borderRadius: "14px", zIndex: 10 }} />
          <div style={{
            borderRadius: "36px", overflow: "hidden", height: "580px", background: colors.bg, position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50px", zIndex: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {showBack && (
                  <button onClick={onBack} style={{ background: "rgba(30,25,20,0.8)", border: `1px solid ${colors.border}`, borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke={colors.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
                <span style={{ color: colors.cream, fontSize: "11px", fontWeight: 500 }}>9:41</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <div style={{ width: "14px", height: "10px", border: `1.5px solid ${colors.cream}`, borderRadius: "2px", position: "relative" }}><div style={{ position: "absolute", inset: "1.5px", background: colors.cream, width: "70%" }} /></div>
                <svg width="12" height="10" viewBox="0 0 12 10" fill={colors.cream}><path d="M0 7h2v3H0zM3 5h2v5H3zM6 3h2v7H6zM9 1h2v9H9z"/></svg>
                <span>📶</span>
              </div>
            </div>
            <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column", paddingTop: "50px" }}>
              {children}
            </div>
          </div>
        </div>
        <div style={{ width: "120px", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", margin: "12px auto 0" }} />
      </div>
    </div>
  );
}
