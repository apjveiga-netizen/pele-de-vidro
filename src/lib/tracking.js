/**
 * META PIXEL + CAPI TRACKING
 * Pixel: 1592455242002391 (Saúde)
 * Adaptado para React SPA
 */

// ─── CONFIGURAÇÃO ──────────────────────────────────────────────────────────
const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '1592455242002391';

// ─── INICIALIZAÇÃO DO PIXEL ────────────────────────────────────────────────
(function loadPixel() {
  if (typeof window === 'undefined' || window.fbq) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
})();


// ─── FUNÇÃO CENTRAL (browser) ──────────────────────────────────────────────
/**
 * Dispara evento no Meta Pixel (browser) e envia para CAPI (servidor).
 * @param {string} eventName
 * @param {object} data - Dados adicionais do evento.
 */
export function trackEvent(eventName, data = {}) {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, data);
    }
  } catch (err) {
    console.warn('[TRACK ERROR]', eventName, err);
  }

  // CAPI — disparo paralelo, não bloqueia UI
  sendCapi(eventName, data).catch(() => {});
}


// ─── CAPI GATEWAY ─────────────────────────────────────────────────────────
async function sendCapi(eventName, data = {}) {
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        data,
        eventTime: Math.floor(Date.now() / 1000),
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
    });
  } catch (err) {
    console.warn('[CAPI ERROR]', err);
  }
}

function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}


// ─── MAPA DE EVENTOS (API pública) ────────────────────────────────────────
export const QuizTracker = {
  /** ViewContent — ao entrar em /analise */
  viewContent() {
    trackEvent('ViewContent', { content_name: 'Quiz Pele de Vidro', content_category: 'Análise Facial' });
  },

  /** StartQuiz + Lead — ao clicar em "Começar" */
  startQuiz() {
    trackEvent('StartQuiz');
    trackEvent('Lead', { content_name: 'Início do Quiz' });
  },

  /** QuizStep[N] — a cada passo do quiz */
  step(n) {
    trackEvent(`QuizStep${n}`, { step: n });
    if (n === 5) trackEvent('Engagement', { detail: 'Meio do Quiz' });
  },

  /** QuizCompleted + CompleteRegistration — ao finalizar o quiz */
  complete(userData = {}) {
    trackEvent('QuizCompleted', userData);
    trackEvent('CompleteRegistration', { ...userData, status: 'Completed' });
  },

  /** ViewOffer — ao entrar na tela de vendas */
  offer() {
    trackEvent('ViewOffer');
    trackEvent('ViewContent', { content_name: 'Oferta Pele de Vidro', content_category: 'Vendas' });
  },

  /** InitiateCheckout — ao clicar em qualquer botão de compra */
  checkout(plan = 'unknown') {
    trackEvent('InitiateCheckout', { 
      content_name: plan,
      currency: 'BRL',
      value: 29.00
    });
  },
};
