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
    { label: "Análise", icon: "📤", action: "UploadView" },
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
            background: "#FFFFFF",
            border: "1px solid #D9D9D9",
            borderRadius: "10px",
            color: "#3A3A3A",
            cursor: "pointer",
            transition: "all 120ms ease",
            padding: "0 10px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px", // Slightly smaller for more delicate look
            fontWeight: "500",
            letterSpacing: "0.15px",
            margin: "0 2px",
          }}
        >
          <span style={{ 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            width: "100%",
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


