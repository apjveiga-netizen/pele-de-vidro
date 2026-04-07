import React, { useReducer, useEffect, useRef, useState } from 'react';
import { QuizTracker } from '../lib/tracking';

// CSS portado diretamente do index.html V8.1
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'quiz-v8-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    :root { 
      --bg: #FDF8F3; 
      --rose: #C4706B; 
      --wine: #3D1A1A; 
      --gold: #C9A87C; 
      --stone: #8C7B72; 
      --ink: #1E1410;
      --white: #FFFFFF;
      --border: #E8A9A633;
    }
    .quiz-container {
      font-family: 'DM Sans', sans-serif;
      color: var(--ink);
      background: var(--bg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .cormorant { font-family: 'Cormorant Garamond', serif; }
    
    #phone-frame-inner {
      width: 100%;
      max-width: 430px;
      background: var(--bg);
      position: relative;
      min-height: 100vh;
      padding-bottom: 40px;
    }

    .btn-primary {
      width: 100%;
      padding: 20px;
      background: var(--rose);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 800;
      cursor: pointer;
      transition: 0.3s;
      text-transform: uppercase;
      box-shadow: 0 10px 25px rgba(196, 112, 107, 0.3);
    }
    .btn-primary:disabled { background: #ccc; cursor: not-allowed; box-shadow: none; }
    
    .option-card {
      padding: 18px 20px;
      background: white;
      border-radius: 15px;
      border: 2px solid var(--border);
      margin-bottom: 12px;
      cursor: pointer;
      transition: 0.2s;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
    }
    .option-card.selected { border-color: var(--rose); background: #fff5f4; }
    
    .check-circle {
      width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--stone);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .selected .check-circle { border-color: var(--rose); background: var(--rose); }
    .selected .check-circle::after { content: '✓'; color: white; font-size: 12px; }

    .header-logo {
      padding: 25px 0;
      text-align: center;
      width: 100%;
      display: block;
    }
    .header-logo p {
      color: var(--rose);
      letter-spacing: 0.5em;
      font-size: 13px;
      font-weight: 800;
      margin: 0;
      text-transform: uppercase;
    }

    /* Scanner Styles */
    .scanner-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--rose), transparent);
      box-shadow: 0 0 15px var(--rose);
      z-index: 5;
      animation: scanLine 3s linear infinite;
    }
    @keyframes scanLine {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .hud-corner {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 3px solid var(--rose);
      z-index: 10;
      opacity: 0.6;
    }
    .tl { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
    .tr { top: 20px; right: 20px; border-left: 0; border-bottom: 0; }
    .bl { bottom: 20px; left: 20px; border-right: 0; border-top: 0; }
    .br { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }
    
    .guidance-msg {
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .camera-flash {
      position: absolute;
      inset: 0;
      background: white;
      opacity: 0;
      pointer-events: none;
      z-index: 10;
    }
    .camera-flash.active { animation: flashAnim 0.3s ease-out; }
    @keyframes flashAnim {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
};

const steps = [
  { id: 'genero', q: 'Qual é o seu gênero?', type: 'radio', autoNext: true, options: [{l:'A) Feminino', v:'F'}, {l:'B) Masculino', v:'M'}] },
  { id: 'nome', q: 'Como você se chama?', type: 'input', placeholder: 'Seu nome' },
  { id: 'idade', q: 'Qual é a sua idade?', type: 'input', placeholder: 'Sua idade' },
  { id: 'choca', q: 'Quando você se olha no espelho pela manhã, qual é a primeira coisa que te choca?', type: 'radio', multiple: true, options: [
    {l:'A) Rugas profundas ao redor dos olhos (pés de galinha que parecem garras)', v:'rugas'},
    {l:'B) Flacidez no rosto — como se o rosto estivesse derretendo', v:'flacidez'},
    {l:'C) Manchas e melasma espalhados pela face', v:'manchas'},
    {l:'D) Tudo junto — rugas, flacidez, manchas, tudo ao mesmo tempo', v:'tudo'}
  ]},
  { id: 'incomoda', q: 'Qual dessas situações mais te incomoda?', type: 'radio', multiple: true, options: [
    {l:'A) Não saio de casa sem maquiagem', v:'make'},
    {l:'B) Evito tirar fotos porque meu rosto está feio', v:'fotos'},
    {l:'C) Meu marido/parceiro não me olha mais da mesma forma', v:'parceiro'},
    {l:'D) Todas as acima — é uma cascata de inseguranças', v:'todas'}
  ]},
  { id: 'afeta', q: 'Como esse envelhecimento está afetando sua vida?', type: 'radio', multiple: true, options: [
    {l:'A) Só afeta meu lado emocional — me sinto mais velha do que realmente sou', v:'emocional'},
    {l:'B) Meu lado social — evito sair, evito fotos, evito espelhos', v:'social'},
    {l:'C) Afeta meu relacionamento — sinto que perdi meu poder de atração', v:'relacionamento'},
    {l:'D) Afeta tudo — emocional, social, relacionamento, autoestima no chão', v:'tudo'}
  ]},
  { id: 'tempo', q: 'Há quanto tempo você começou a notar esses sinais de envelhecimento?', type: 'radio', options: [
    {l:'A) Há menos de 1 ano — apareceu do nada', v:'menos1'},
    {l:'B) Há 2-3 anos — vem piorando gradualmente', v:'23'},
    {l:'C) Há mais de 5 anos — já é uma situação crítica', v:'mais5'},
    {l:'D) Não sei — só sei que acordei um dia e estava assim', v:'naosei'}
  ]},
  { id: 'velocidade', q: 'Nos últimos 6 meses, como você avalia a velocidade do envelhecimento?', type: 'radio', options: [
    {l:'A) Está estável — não piorou muito', v:'estavel'},
    {l:'B) Está piorando lentamente — eu percebo', v:'lento'},
    {l:'C) Está piorando rápido — cada mês vejo uma ruga nova', v:'rapido'},
    {l:'D) Está acelerado demais — parece que envelheci 5 anos em 6 meses', v:'acelerado'}
  ]},
  { id: 'emocional', q: 'Como você se sente emocionalmente com essa situação?', type: 'radio', multiple: true, options: [
    {l:'A) Incomodada, mas consigo lidar', v:'lidar'},
    {l:'B) Frustrada — já tentei tudo e nada funciona', v:'frustrada'},
    {l:'C) Desesperada — sinto que estou perdendo meu tempo de vida', v:'desesperada'},
    {l:'D) Deprimida — isso está afetando a minha vida', v:'deprimida'}
  ]},
  { id: 'gastou', q: 'Quanto você já gastou em cremes, tratamentos e procedimentos tentando resolver isso?', type: 'radio', options: [
    {l:'A) Menos de R$ 500 — tentei alguns produtos básicos', v:'500'},
    {l:'B) Entre R$ 500 e R$ 2.000 — investi em marcas boas nos últimos anos', v:'2000'},
    {l:'C) Entre R$ 2.000 e R$ 5.000 — fiz alguns procedimentos', v:'5000'},
    {l:'D) Mais de R$ 5.000 — já perdi a conta de quanto já gastei', v:'mais'}
  ]},
  { id: 'resultado', q: 'Qual foi o resultado de tudo que você já tentou?', type: 'radio', options: [
    {l:'A) Funcionou um pouco — mas os resultados não duraram', v:'pouco'},
    {l:'B) Não funcionou nada — foi dinheiro jogado fora', v:'nada'},
    {l:'C) Parece que só funciona para os outros', v:'outros'},
    {l:'D) Percebo que tive melhora, mas ainda não está bom o suficiente', v:'parcial'}
  ]},
  { id: 'porque', q: 'Por que você acha que nada funcionou até agora?', type: 'radio', multiple: true, options: [
    {l:'A) Porque não encontrei o produto certo', v:'produto'},
    {l:'B) Porque meu tipo de pele é muito difícil', v:'pele'},
    {l:'C) Porque os procedimentos são caros, duram pouco e não tratam a causa raiz', v:'proc'},
    {l:'D) Porque a idade já avançou demais para reverter', v:'idade'}
  ]},
  { id: 'rotina', q: 'Qual é sua rotina atual de cuidados com a pele?', type: 'radio', options: [
    {l:'A) Praticamente nenhuma — só lavo o rosto e pronto', v:'nenhuma'},
    {l:'B) Básica — limpeza e hidratante', v:'basica'},
    {l:'C) Completa — limpeza, sérum, hidratante, protetor solar', v:'completa'},
    {l:'D) Obsessiva — tenho 10+ produtos, mas ainda assim não resolve', v:'obsessiva'}
  ]},
  { id: 'raiz', q: 'Você sabe REALMENTE qual é a causa raiz do seu envelhecimento?', type: 'radio', multiple: true, options: [
    {l:'A) Acho que é genética — minha mãe também envelheceu assim', v:'genetica'},
    {l:'B) Acho que é falta de colágeno — mas não sei como repor', v:'colageno'},
    {l:'C) Acho que é sol — mas não sei como reverter os danos', v:'sol'},
    {l:'D) Não faço ideia — só sei que está acontecendo', v:'naosei'}
  ]},
  { id: 'disposicao', q: 'Se você descobrisse EXATAMENTE o que sua pele precisa, você estaria disposta a fazer?', type: 'radio', multiple: true, options: [
    {l:'A) Sim, mas só se for rápido e fácil', v:'facil'},
    {l:'B) Sim, mas só se for acessível financeiramente', v:'acessivel'},
    {l:'C) Sim, mas só se tiver garantia de resultado', v:'garantia'},
    {l:'D) Sim, sem importar o custo — quero meu rosto de volta', v:'custo'}
  ]},
  { id: 'sentir', q: 'Como você quer se sentir daqui a 30 dias?', type: 'radio', multiple: true, options: [
    {l:'A) Transformada — quero que as pessoas a minha volta notem a diferença', v:'transf'},
    {l:'B) Jovem novamente — quero parecer 5 ou 10 anos mais jovem', v:'jovem'},
    {l:'C) Poderosa — quero que as pessoas me olhem com admiração', v:'poder'},
    {l:'D) Todas as opções anteriores', v:'all'}
  ]},
  { id: 'recuperar', q: 'O que você mais deseja recuperar?', type: 'radio', multiple: true, options: [
    {l:'A) Minha autoestima — quero me amar no espelho novamente', v:'auto'},
    {l:'B) Meu poder de atração — quero me sentir desejada', v:'atr'},
    {l:'C) Minha juventude — quero parecer mais jovem do que sou', v:'juv'},
    {l:'D) Mais confiante — não quero usar maquiagem para esconder meu rosto', v:'conf'}
  ]},
  { id: 'começar', q: 'Se você tivesse acesso a um protocolo personalizado que realmente funcionasse, quando você gostaria de começar?', type: 'radio', multiple: true, options: [
    {l:'A) Assim que possível — não aguento mais esperar', v:'agora'},
    {l:'B) Nos próximos 30 dias — preciso resolver isso logo', v:'30d'},
    {l:'C) Me sentir jovem e bonita é prioridade na minha vida', v:'prioridade'}
  ]}
];

const Logo = () => (
  <div className="header-logo">
    <p>PELE DE VIDRO</p>
  </div>
);

const LandingScreen = ({ onStart }) => (
  <div key="landing" style={{ padding: '0 24px 40px', textAlign: 'center' }}>
    <Logo />
    <h1 className="cormorant" style={{ color: '#1a1a1a', fontSize: '2.4rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-0.02em' }}>
      Não seja mais <span style={{ color: '#C4706B' }}>Escrava</span> de Cremes, Maquiagem e Botox.
    </h1>
    <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '15px' }}>
      Essa IA vai analisar sua pele e entregar um protocolo personalizado que levanta e rejuvenesce!
    </p>
    <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '15px', marginBottom: '30px', border: '1px solid #eee' }}>
      <p style={{ color: '#C4706B', fontSize: '1rem', fontWeight: '800', margin: 0 }}>
        Apenas 1 análise por pessoa.
      </p>
    </div>
    <button onClick={onStart} className="btn-primary" style={{ height: 'auto', padding: '22px' }}>
      Começar
    </button>
  </div>
);

const QuizScreen = ({ step, currentStep, totalSteps, answers, onOption, onNext }) => {
  const selection = answers[step.id] || (step.multiple ? [] : '');
  const canNext = step.type === 'input' 
    ? (selection && selection.length > 0) 
    : (step.multiple ? (Array.isArray(selection) && selection.length > 0) : !!selection);

  return (
    <div key="quiz" style={{ padding: '0 24px 40px', textAlign: 'center' }}>
      <Logo />
      <div style={{ height: '4px', background: '#eee', borderRadius: '10px', marginBottom: '30px', marginTop: '10px' }}>
        <div style={{ width: `${((currentStep + 1) / totalSteps) * 100}%`, height: '100%', background: 'var(--rose)', transition: '0.3s' }} />
      </div>
      <h2 className="cormorant" style={{ fontSize: '1.8rem', color: 'var(--wine)', marginBottom: '30px', fontWeight: 600, textAlign: 'left' }}>{step.q}</h2>
      {step.type === 'input' ? (
        <input 
          type="text" 
          placeholder={step.placeholder}
          value={selection || ''}
          onChange={e => onOption(e.target.value)}
          autoFocus
          style={{ width: '100%', padding: '20px', borderRadius: '15px', border: '2px solid var(--border)', fontSize: '1.1rem', marginBottom: '20px', outline: 'none' }}
        />
      ) : (
        <div>
          {step.options.map(o => {
            const isSelected = step.multiple 
              ? (Array.isArray(selection) && selection.includes(o.v)) 
              : selection === o.v;
            return (
              <div key={o.v} className={`option-card ${ isSelected ? 'selected' : '' }`} onClick={() => onOption(o.v)}>
                <div className="check-circle" />
                {o.l}
              </div>
            );
          })}
        </div>
      )}
      {!step.autoNext && (
        <button className="btn-primary" disabled={!canNext} onClick={onNext} style={{ marginTop: '20px' }}>Continuar</button>
      )}
    </div>
  );
};

const CameraScreen = ({ onCapture }) => {
  const vRef = useRef(null);
  const sRef = useRef(null);
  const [err, setErr] = useState('');
  const [ready, setReady] = useState(false);
  const [mIdx, setMIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  const msgs = [
    "Mapeando derme profunda...",
    "Detectando simetria facial...",
    "Ajustando iluminação da cena...",
    "Enquadramento de alta precisão...",
    "PRONTA! PODE FOTOGRAFAR"
  ];

  useEffect(() => {
    const mi = setInterval(() => setMIdx(prev => Math.min(prev + 1, 4)), 1800);
    
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: false 
        });
        if (vRef.current) {
          vRef.current.srcObject = stream;
          sRef.current = stream;
          setReady(true);
        }
      } catch (e) {
        setErr(e.name === 'NotAllowedError' ? 'Acesso à câmera negado' : 'Câmera não encontrada');
      }
    }
    start();
    
    return () => {
      clearInterval(mi);
      if (sRef.current) {
        sRef.current.getTracks().forEach(t => t.stop());
        sRef.current = null;
      }
    };
  }, []);

  const handleCapture = () => {
    if (!ready || mIdx < 4) return;
    setFlash(true);
    const video = vRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const photo = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop immediately
    if (sRef.current) {
      sRef.current.getTracks().forEach(t => t.stop());
      sRef.current = null;
    }
    if (vRef.current) vRef.current.srcObject = null;

    setTimeout(() => onCapture(photo), 500);
  };

  const isReady = mIdx >= 4;
  
  return (
    <div key="camera" style={{ padding: '0 24px 40px', textAlign: 'center' }}>
      <Logo />
      <h2 className="cormorant" style={{ fontSize: '1.8rem', color: 'var(--wine)', marginBottom: '10px' }}>
        Vamos analisar seu rosto com IA
      </h2>
      <p style={{ color: '#666', fontSize: '1rem', marginBottom: '30px' }}>
        Posicione seu rosto na moldura
      </p>
      <div style={{ position: 'relative', width: '280px', height: '350px', margin: '0 auto 40px', borderRadius: '150px', overflow: 'hidden', border: '1px solid rgba(196,112,107,0.3)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', background: '#000' }}>
        {err ? <div style={{ color: '#fff', padding: '100px 20px' }}>{err}</div> : (
          <>
            <video ref={vRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <div className="scanner-line" />
            <div className="hud-corner tl" />
            <div className="hud-corner tr" />
            <div className="hud-corner bl" />
            <div className="hud-corner br" />
            <div className={`camera-flash ${flash ? 'active' : ''}`} />
            <div className="guidance-msg" style={{ backgroundColor: isReady ? '#4CAF50' : 'rgba(0,0,0,0.7)', transition: '0.3s' }}>
              {msgs[mIdx]}
            </div>
          </>
        )}
      </div>
      <button onClick={handleCapture} className="btn-primary" disabled={!!err || !isReady} style={{ backgroundColor: isReady ? 'var(--rose)' : '#999', transition: '0.5s' }}>
        {isReady ? 'FAZER ANÁLISE' : 'ANALISANDO...'}
      </button>
    </div>
  );
};

const ProcessingScreen = ({ prg, fin, onContinue }) => {
  const bars = [
    { l: 'Analisando seu tipo de pele', p: Math.min(100, prg * 1.5) }, 
    { l: 'Analisando rugas e pontos críticos', p: Math.min(100, prg * 1.2) }, 
    { l: 'Avaliando sua musculatura', p: Math.min(100, prg * 1.1) }, 
    { l: 'Gerando sua análise completa', p: prg }
  ];

  return (
    <div key="proc" style={{ padding: '0 20px 40px', textAlign: 'center' }}>
      <Logo />
      <h2 className="cormorant" style={{ color: 'var(--wine)', marginBottom: '10px', fontSize: '1.6rem', lineHeight: 1.2 }}>Seu resultado está sendo gerado agora...</h2>
      
      <div style={{ textAlign: 'left', margin: '20px auto 10px', maxWidth: '315px', padding: '0 5px' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '15px', fontWeight: '500' }}>
          Enquanto isso, assista este vídeo rápido (1 minuto) onde você vai descobrir:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            'Por que nenhum creme funcionou até agora pra você',
            'O que sua pele REALMENTE precisa',
            'Como reverter os sinais de envelhecimento (mesmo que você já tenha tentado tudo)'
          ].map((txt, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--rose)', fontWeight: '900' }}>✓</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--stone)', lineHeight: '1.3', fontWeight: '600' }}>{txt}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', width: '92%', maxWidth: '315px', margin: '15px auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(191,149,63,0.1)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99, cursor: 'default', background: 'transparent' }}></div>
        <div id="vsl-player" style={{ width: '100%', aspectRatio: '9/16' }}></div>
      </div>

      <div style={{ textAlign: 'left', marginBottom: '40px', padding: '0 5px' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', fontWeight: 800, color: 'var(--stone)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span>{b.l}</span>
              <span style={{ color: b.p === 100 ? '#4CAF50' : 'var(--rose)' }}>{Math.floor(b.p)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.04)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${b.p}%`, 
                height: '100%', 
                background: b.p === 100 ? '#4CAF50' : 'linear-gradient(90deg, #D4AF37, var(--rose))', 
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: b.p > 0 && b.p < 100 ? '0 0 12px rgba(212,175,55,0.4)' : 'none'
              }} />
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" disabled={!fin} onClick={onContinue} style={{ 
        boxShadow: fin ? '0 15px 35px rgba(196,112,107,0.4)' : 'none',
        opacity: fin ? 1 : 0.6,
        transform: fin ? 'scale(1)' : 'scale(0.98)'
      }}>
        {fin ? 'VER MEU RESULTADO' : 'Assista para liberar seu resultado'}
      </button>
    </div>
  );
};

const SalesScreen = ({ checkout, answers, photo }) => {
  const nome = answers?.nome || 'Paciente';
  const idade = answers?.idade || '--';

  return (
    <div key="sales" style={{ padding: '0 20px 40px' }}>
      <Logo />
      
      <p style={{ color: 'var(--rose)', letterSpacing: '0.4em', fontSize: '11px', fontWeight: 800, textAlign: 'center', marginBottom: '10px' }}>SEU PROTOCOLO PERSONALIZADO CHEGOU:</p>
      
      <h1 className="cormorant" style={{ fontSize: '1.8rem', color: 'var(--wine)', textAlign: 'center', marginBottom: '10px', marginTop: '5px', lineHeight: 1.2 }}>
        Você Não Está Velha. Sua Pele é que Está <span style={{ color: 'var(--rose)' }}>Feia</span> — Vamos Recuperá-la
      </h1>
      
      <div style={{ background: '#fff', padding: '25px', borderRadius: '25px', border: '1px solid var(--border)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <p className="cormorant" style={{ fontSize: '1.15rem', color: 'var(--wine)', lineHeight: 1.5, marginBottom: '25px', fontStyle: 'italic' }}>
          "Você está em uma situação crítica de envelhecimento. Todos os sinais estão presentes e visíveis. Você já investiu muito dinheiro, tentou muitas coisas, e nada funcionou. Você pode estar até pensando em alguns procedimentos mais invasivos e mais caros. Mas antes de fazer isso, você precisa entender o que realmente está acontecendo com sua pele e a causa raiz."
        </p>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--bg)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ width: '100px', height: '130px', background: '#000', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--white)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            {photo ? (
              <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.7rem' }}>FOTO IA</div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--stone)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dossiê Facial</div>
            <div className="cormorant" style={{ fontSize: '1.4rem', color: 'var(--wine)', fontWeight: 700, margin: '5px 0' }}>{nome}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--stone)' }}>Idade: <strong>{idade} anos</strong></div>
            <div style={{ fontSize: '0.9rem', color: 'var(--stone)', marginTop: '5px' }}>Status: <span style={{ color: '#D32F2F', fontWeight: 800 }}>CRÍTICO</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 10px', marginBottom: '40px' }}>
        <h3 className="cormorant" style={{ fontSize: '1.4rem', color: 'var(--wine)', marginBottom: '20px', borderLeft: '4px solid var(--rose)', paddingLeft: '15px' }}>Sinais Identificados:</h3>
        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--stone)', fontSize: '1rem' }}>
          {[
            'Rugas em várias áreas do rosto',
            'Perda de firmeza (rosto "derretendo")',
            'Falta de uniformidade e manchas visíveis',
            'Surgimento de bigode chinês e linhas de expressão'
          ].map((s, i) => (
            <li key={i} style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: 'var(--rose)', fontWeight: 900 }}>✓</span> 
              <span style={{ color: 'var(--wine)', fontWeight: 500 }}>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '0 10px', marginBottom: '40px' }}>
        <h3 className="cormorant" style={{ fontSize: '1.4rem', color: 'var(--wine)', marginBottom: '20px', borderLeft: '4px solid var(--rose)', paddingLeft: '15px', lineHeight: 1.2 }}>
          Com base na sua análise, criamos um protocolo exclusivo e personalizado:
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--stone)', fontSize: '1rem' }}>
          {[
            'Exercícios faciais diários para a sua pele — 7 minutos por dia',
            'Receitas Pele de Porcelana — para clarear olheiras, manchas, eliminar células mortas, etc',
            'Cronograma personalizado — montado exclusivamente para você, é como ter um profissional trabalhando 24 horas por dia para você!'
          ].map((s, i) => (
            <li key={i} style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--rose)', fontWeight: 900 }}>✓</span> 
              <span style={{ color: 'var(--wine)', fontWeight: 500, lineHeight: 1.4 }}>{s}</span>
            </li>
          ))}
        </ul>
        <p style={{ color: 'var(--rose)', fontWeight: 800, textAlign: 'center', marginTop: '20px', fontSize: '1.1rem' }}>
          Resultados visíveis em apenas 2 semanas.
        </p>
      </div>

      <div style={{ padding: '0 10px', marginBottom: '50px' }}>
        <h2 className="cormorant" style={{ textAlign: 'center', color: 'var(--wine)', fontSize: '1.8rem', marginBottom: '30px' }}>Veja os resultados</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--stone)', fontWeight: 700, marginBottom: '10px' }}>14 dias de protocolo</p>
             <img src="/assets/results/14dias.jpg" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} alt="14 dias" />
          </div>
          <div style={{ textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--stone)', fontWeight: 700, marginBottom: '10px' }}>40 dias de protocolo</p>
             <img src="/assets/results/30dias.jpg" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} alt="40 dias" />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 10px', marginBottom: '50px' }}>
        <h2 className="cormorant" style={{ textAlign: 'center', color: 'var(--wine)', fontSize: '1.8rem', marginBottom: '30px' }}>💬 OPINIÕES</h2>
        
        {[
          { n: 'Fernanda C.', a: '47 anos, São Paulo', t: '"Minha filha tirou uma foto minha na festa de aniversário dela. Eu vi e quase chorei — de vergonha. Fiquei meses sem tirar fotos. Comecei o Pele de Vidro sem muita expectativa. Quatro semanas depois, meu marido perguntou: \'O que você fez no rosto?\' Eu não tinha feito nada. Só os 7 minutinhos."' },
          { n: 'Renata M.', a: '41 anos, Belo Horizonte', t: '"Desativava a câmera em toda reunião de trabalho. Tinha vergonha do meu próprio rosto numa tela. O scanner identificou exatamente os músculos que derretiam o meu rosto — que é o que mais me incomoda. Fiquei chocada com a precisão. E em 3 semanas já vi a diferença."' },
          { n: 'Carla S.', a: '52 anos, Curitiba', t: '"Já joguei muito dinheiro fora em creme. Comprei o Pele de Vidro sem muita esperança. Dois meses depois minha colega de trabalho perguntou se eu tinha feito botox. Não fiz nada. Só os exercícios."' }
        ].map((d, i) => (
          <div key={i} style={{ background: '#fff', padding: '25px', borderRadius: '25px', border: '1px solid var(--border)', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '1rem', color: 'var(--wine)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '15px' }}>{d.t}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--wine)', fontSize: '0.9rem' }}>{d.n}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>{d.a}</div>
              </div>
              <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#FDF1F0', padding: '30px 25px', borderRadius: '30px', border: '2px dashed var(--rose)', marginBottom: '50px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🛡️</div>
        <h3 className="cormorant" style={{ fontSize: '1.4rem', color: 'var(--wine)', marginBottom: '10px', fontWeight: 800 }}>GARANTIA DE 7 DIAS</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--stone)', lineHeight: 1.5 }}>
          Se em uma semana você não sentir diferença nos seus músculos faciais, devolvemos 100% do seu dinheiro sem perguntas, sem burocracia.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '50px', padding: '0 10px' }}>
        <p style={{ fontSize: '1rem', color: 'var(--wine)', lineHeight: 1.6, marginBottom: '20px' }}>
          Um único procedimento estético custa entre R$ 500 e R$ 3.000. E dura meses — até você ter que repetir. <strong>Aqui você paga uma vez.</strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--stone)', marginBottom: '15px' }}>
          Não renova automaticamente. Não te cobra enquanto você dorme.
        </p>
        <h2 className="cormorant" style={{ fontSize: '1.8rem', color: 'var(--wine)', fontWeight: 800, lineHeight: 1.2, marginTop: '10px' }}>
          Em menos de 1 minuto a IA analisa como te dar uma pele lisa e jovem
        </h2>
      </div>

      <div id="pricing-section" style={{ marginTop: '0' }}>
         {[
           { t: 'BÁSICO', p: '29', l: ['1 análise facial com IA', 'Protocolo Exclusivo e Personalizado', 'Exercícios diários', 'Receitas Pele de Porcelana'], link: 'https://pay.celetus.com/IWRUJCJW' },
         ].map((p, i) => (
           <div key={i} style={{ background: '#fff', padding: '35px 25px', borderRadius: '30px', border: '1px solid var(--border)', marginBottom: '30px', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', position: 'relative' }}>
              <h3 className="cormorant" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--wine)', fontWeight: 800 }}>{p.t}</h3>
              <div style={{ fontSize: '2.8rem', color: 'var(--rose)', fontWeight: 900, margin: '15px 0' }}>R$ {p.p}</div>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--stone)', fontSize: '0.95rem', textAlign: 'left', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {p.l.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--rose)', fontWeight: 900 }}>✓</span> 
                    <span style={{ color: 'var(--wine)', fontWeight: 500 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-primary" onClick={() => checkout(p.t, p.link)} style={{ marginTop: '5px', padding: '22px' }}>Comprar Agora</button>
           </div>
         ))}
      </div>

      <div style={{ padding: '20px 10px 50px' }}>
        <h2 className="cormorant" style={{ textAlign: 'center', color: 'var(--wine)', fontSize: '1.8rem', marginBottom: '30px' }}>Perguntas Frequentes</h2>
        
        {[
          { q: 'Será que funciona pra mim? Já tentei tanta coisa…', a: 'Faz sentido desconfiar. Te prometeram mundos e fundos e nada mudou. A diferença aqui é a personalização: o protocolo é criado a partir do seu rosto, mulher real — não de um rosto genérico de modelo de 22 anos. Mulheres que nunca viram resultado com creme estão vendo com o protocolo personalizado porque, pela primeira vez, estão trabalhando os músculos certos.' },
          { q: 'Não tenho tempo pra mais uma coisa.', a: '7 minutos. Com vídeo guiado. A maioria das nossas usuárias faz enquanto o café esquenta. Se você tem tempo para rolar o Instagram, você tem tempo para investir em você.' },
          { q: 'É tarde demais pra mim?', a: 'A pele tem memória muscular. Em qualquer fase, quando você começa a trabalhar os músculos faciais certos, a resposta aparece. Temos usuárias de 55, 58, 62 anos relatando melhora visível. Tarde só seria se você nunca começasse.' },
          { q: 'Vai me deixar com cara artificial?', a: 'Nunca. O protocolo fortalece e reposiciona os músculos do rosto de forma natural — o resultado é que você parece você, só mais descansada, mais firme, mais viva. Sem cara de cera. Sem expressão congelada.' },
          { q: 'Os créditos expiram?', a: 'Não. Cada crédito = uma análise facial completa pela IA, e eles não têm prazo de validade. Use no seu ritmo para acompanhar sua evolução e atualizar seu protocolo conforme sua pele vai respondendo.' },
          { q: 'Posso usar junto com meus cremes e procedimentos?', a: 'Sim — e muitas usuárias relatam que os cremes passaram a funcionar melhor depois que começaram o protocolo. Músculo facial ativo circula mais, absorve mais, responde mais.' }
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h4 style={{ color: 'var(--wine)', fontSize: '1rem', fontWeight: 800, marginBottom: '10px', lineHeight: 1.4 }}>{item.q}</h4>
            <p style={{ color: 'var(--stone)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '40px 20px 60px', textAlign: 'center', background: 'var(--wine)', borderRadius: '40px', margin: '20px 0' }}>
        <h2 className="cormorant" style={{ color: 'var(--white)', fontSize: '2rem', marginBottom: '30px', lineHeight: 1.2 }}>
          Qual mulher você escolhe ver no espelho hoje?
        </h2>
        <button 
          className="btn-primary" 
          onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })} 
          style={{ background: 'var(--white)', color: 'var(--wine)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
        >
          Quero meu protocolo personalizado
        </button>
      </div>

    </div>
  );
};

const initialState = { 
  sc: 'LANDING', 
  step: 0, 
  ans: {}, 
  cam: { photo: null }, 
  proc: { prg: 0, fin: false } 
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SC': return { ...state, sc: action.payload };
    case 'NEXT_STEP': return { ...state, step: state.step + 1 };
    case 'SET_ANS': 
      return { ...state, ans: { ...state.ans, ...action.payload } };
    case 'SET_CAM': return { ...state, cam: { ...state.cam, ...action.payload } };
    case 'SET_PROC': return { ...state, proc: { ...state.proc, ...action.payload } };
    default: return state;
  }
}

const QuizStandalone = () => {
  const [st, dispatch] = useReducer(reducer, initialState);
  const ytRef = useRef(null);
  const ivRef = useRef(null); // Ref to store interval ID

  useEffect(() => {
    injectStyles();
    return () => { if (ivRef.current) clearInterval(ivRef.current); }; // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (st.sc === 'PROCESSING') {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => { initYT(); };
      } else {
        initYT();
      }
    }
  }, [st.sc]);

  const initYT = () => {
    ytRef.current = new window.YT.Player('vsl-player', {
      videoId: 'oHJmnDO3GEc',
      playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
      events: {
        onReady: (e) => { 
          e.target.unMute(); 
          e.target.setVolume(100); 
          e.target.playVideo(); 
        },
        onStateChange: (e) => {
          if (ivRef.current) clearInterval(ivRef.current);
          
          // Detect ENDED state (0)
          if (e.data === 0) {
            dispatch({ type: 'SET_PROC', payload: { prg: 100, fin: true } });
          }
          // Update progress while playing (1)
          if (e.data === 1) {
            ivRef.current = setInterval(() => {
              if (!ytRef.current?.getCurrentTime) { 
                if (ivRef.current) clearInterval(ivRef.current);
                return; 
              }
              const cur = ytRef.current.getCurrentTime();
              const dur = ytRef.current.getDuration() || 160;
              const p = Math.min(100, (cur / dur) * 100);
              
              if (p >= 99) { // Unlock slightly before the absolute end
                dispatch({ type: 'SET_PROC', payload: { prg: 100, fin: true } });
                if (ivRef.current) clearInterval(ivRef.current);
              } else {
                dispatch({ type: 'SET_PROC', payload: { prg: p, fin: false } });
              }
            }, 500);
          }
        }
      }
    });
  };

  const next = () => {
    if (st.step < steps.length - 1) {
      dispatch({ type: 'NEXT_STEP' }); 
      QuizTracker.step(st.step + 2); 
      window.scrollTo(0, 0);
    } else { 
      dispatch({ type: 'SET_SC', payload: 'CAMERA' }); 
    }
  };

  const onOpt = (val) => {
    const s = steps[st.step];
    if (s.multiple) {
      const cur = st.ans[s.id] || [];
      const nAns = cur.includes(val) ? cur.filter(a => a !== val) : [...cur, val];
      dispatch({ type: 'SET_ANS', payload: { [s.id]: nAns } });
    } else {
      dispatch({ type: 'SET_ANS', payload: { [s.id]: val } });
      if (s.autoNext) setTimeout(next, 300);
    }
  };

  const handleCapture = (photo) => {
    dispatch({ type: 'SET_CAM', payload: { photo } });
    setTimeout(() => dispatch({ type: 'SET_SC', payload: 'PROCESSING' }), 100);
  };

  return (
    <div className="quiz-container">
      <div id="phone-frame-inner">
        {st.sc === 'LANDING' && <LandingScreen onStart={() => { dispatch({ type: 'SET_SC', payload: 'QUIZ' }); QuizTracker.startQuiz(); }} />}
        {st.sc === 'QUIZ' && <QuizScreen step={steps[st.step]} currentStep={st.step} totalSteps={steps.length} answers={st.ans} onOption={onOpt} onNext={next} />}
        {st.sc === 'CAMERA' && <CameraScreen onCapture={handleCapture} />}
        {st.sc === 'PROCESSING' && <ProcessingScreen prg={st.proc.prg} fin={st.proc.fin} onContinue={() => { dispatch({ type: 'SET_SC', payload: 'SALES' }); QuizTracker.complete(st.ans); }} />}
        {st.sc === 'SALES' && <SalesScreen answers={st.ans} photo={st.cam.photo} checkout={(plan, link) => { QuizTracker.checkout(plan); window.location.href = link; }} />}
      </div>
    </div>
  );
};

export default QuizStandalone;
