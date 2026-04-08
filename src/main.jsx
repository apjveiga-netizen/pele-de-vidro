import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import SalesPage from './pages/SalesPage'
import QuizStandalone from './quiz/QuizStandalone'

// Forensics: confirm in console that JS is executing
console.log("Forensics: main.jsx start.");

// Forensics: Remove loader on successful hydration
const clearLoader = () => {
  const loader = document.getElementById('pdv-loader');
  if (loader) {
    loader.style.transition = 'opacity 0.5s';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.parentNode?.removeChild(loader);
      console.log("Forensics: Loader cleared.");
    }, 500);
  }
};

window.addEventListener('load', clearLoader);
// Immediate attempt in case React renders before load event
setTimeout(clearLoader, 3000); 

import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0A0908', color: '#F5EFE6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 className="cormorant" style={{ color: '#C9A96E', fontSize: '32px', marginBottom: '14px' }}>Algo deu errado</h1>
          <p style={{ color: '#8C7B6B', fontSize: '14px', marginBottom: '24px' }}>Não foi possível carregar a página completamente.</p>
          <pre style={{ background: '#13110F', padding: '16px', borderRadius: '12px', fontSize: '11px', textAlign: 'left', overflow: 'auto', maxWidth: '100%' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.href = "/"} style={{ marginTop: '24px', padding: '12px 24px', borderRadius: '100px', background: '#C4907A', color: '#fff', border: 'none', cursor: 'pointer' }}>Recarregar Página</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Forced redeploy: 2026-03-29T02:45:00Z - Clean build triggered
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/analise" element={<QuizStandalone />} />
          <Route path="/quiz" element={<QuizStandalone />} />
          <Route path="/vendas" element={<SalesPage />} />
          <Route path="/app" element={<App />} />
          <Route path="/pele" element={<App />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
