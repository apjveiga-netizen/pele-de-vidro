import { useState, useEffect } from "react";

export default function BottomNav({ onNavigate }) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // If the window height decreases significantly, assume keyboard is open
      const isKeyboard = window.innerHeight < 500; // Threshold for mobile keyboards
      setIsKeyboardOpen(isKeyboard);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isKeyboardOpen) return null;

  const items = [
    { label: "Início", icon: "🏠", action: "HomeView" },
    { label: "Análise", icon: "📸", action: "UploadView" },
    { label: "Créditos", icon: "💎", action: "CreditsView" },
    { label: "Protocolo", icon: "📋", action: "ResultView" },
    { label: "Diamante", icon: "✨", action: "DiamanteView" },
  ];

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "68px",
      background: "transparent",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 8px",
      zIndex: 1000,
    }}>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => {
            console.log(`Action: ${item.action}`);
            if (onNavigate) onNavigate(item.action);
          }}
          className="nav-button"
          style={{
            height: "42px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(30, 25, 20, 0.95)",
            border: `1px solid rgba(201, 169, 110, 0.2)`,
            borderRadius: "14px",
            color: "#C9A96E",
            cursor: "pointer",
            transition: "all 0.2s ease",
            padding: "0 4px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "10px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 4px",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <span style={{ fontSize: "18px", marginBottom: "2px" }}>{item.icon}</span>
          <span style={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            textAlign: "center"
          }}>
            {item.label}
          </span>
        </button>
      ))}
      <style>{`
        .nav-button:hover, .nav-button:active {
          background: #F3F3F3 !important;
        }
      `}</style>
    </div>
  );
}


