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
    { label: "Protocolo", icon: "📋", action: "ResultView" },
    { label: "Diamante", icon: "✨", action: "DiamanteView" },
    { label: "Créditos", icon: "💎", action: "CreditsView" },
  ];

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "60px",
      background: "rgba(10, 9, 8, 0.98)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "0 12px",
      zIndex: 1000,
      borderTop: "1px solid rgba(201, 169, 110, 0.1)",
      backdropFilter: "blur(20px)"
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
            height: "36px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "#C9A96E",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "0 4px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 2px",
            opacity: 0.85
          }}
        >
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
        .nav-button:hover {
          opacity: 1 !important;
          color: #F5EFE6 !important;
          transform: translateY(-1px);
        }
        .nav-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}


