import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizTracker } from '../lib/tracking';

const colors = {
  bg: "#FDF8F3",
  warm: "#F5EDE0",
  white: "#FFFFFF",
  wine: "#3D1A1A",
  wine2: "#5C2A2A",
  rose: "#C4706B",
  roseLight: "#E8A9A6",
  roseDark: "#9B4A46",
  gold: "#C9A87C",
  goldLight: "#E8D5B0",
  stone: "#8C7B72",
  ink: "#1E1410",
  border: "#E8A9A633"
};

const SCREENS = {
  LANDING: 'LANDING',
  QUIZ: 'QUIZ',
  CAMERA: 'CAMERA',
  ANALYZING: 'ANALYZING',
  PROCESSING: 'PROCESSING',
  SALES: 'SALES'
};

const QuizStandalone = () => {
  // ── Todos os estados declarados primeiro (evita TDZ no bundle minificado) ──
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [vslProgress, setVslProgress] = useState(0);
  const [stream, setStream] = useState(null);
  const [scanMessage, setScanMessage] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const videoRef = useRef(null);
  const vslPlayerRef = useRef(null);
  const vslContainerRef = useRef(null);
  const progressInterval = useRef(null);
  const timeouts = useRef([]);
  const trackedSteps = useRef(new Set());

  // ── Tracking: ViewContent na montagem ──
  useEffect(() => { QuizTracker.viewContent(); }, []);

  // ── Tracking: QuizStep a cada pergunta ──
  useEffect(() => {
    if (screen === SCREENS.QUIZ && !trackedSteps.current.has(currentStep)) {
      trackedSteps.current.add(currentStep);
      QuizTracker.step(currentStep + 1);
    }
  }, [screen, currentStep]);

  useEffect(() => {
    if (screen === SCREENS.CAMERA) {
      const messages = [
        { text: "Detectando rosto...", time: 1500, color: colors.gold },
        { text: "Afaste um pouco para enquadrar...", time: 2000, color: colors.stone },
        { text: "Aproxime seu rosto suavemente...", time: 2000, color: colors.rose },
        { text: "Quase lá... Mais um pouco...", time: 1500, color: colors.roseDark },
        { text: "Perfeito! Fique parada...", time: 2000, color: "#2E7D32" }
      ];

      let currentStage = 0;

      const runSequence = () => {
        if (currentStage < messages.length) {
          setScanMessage(messages[currentStage]);
          const timeoutId = setTimeout(() => {
            currentStage++;
            runSequence();
          }, messages[currentStage].time);
          timeouts.current.push(timeoutId);
        } else {
          setIsCapturing(true);
          takePhoto();
          playShutterSound();
          const finalId = setTimeout(() => {
            setScreen(SCREENS.ANALYZING);
          }, 600);
          timeouts.current.push(finalId);
        }
      };

      const startCamera = async () => {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
          });
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          runSequence();
        } catch (err) {
          console.error("Erro ao acessar câmera:", err);
          setScanMessage({ text: "Permissão de câmera negada", color: "#FF0000" });
        }
      };
      startCamera();
    } else {
      setScanMessage('');
      setIsCapturing(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screen]);

  useEffect(() => {
    if (screen === SCREENS.ANALYZING) {
      const timer = setTimeout(() => {
        setScreen(SCREENS.PROCESSING);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === SCREENS.PROCESSING) {
      const stages = [
        setTimeout(() => setProcessingStage(1), 1500),
        setTimeout(() => setProcessingStage(2), 3000),
        setTimeout(() => setProcessingStage(3), 4500)
      ];
      
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => {
          initYoutubePlayer();
        };
      } else {
        initYoutubePlayer();
      }

      return () => {
        stages.forEach(clearTimeout);
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (vslPlayerRef.current) {
          try { vslPlayerRef.current.destroy(); } catch(e) {}
          vslPlayerRef.current = null;
        }
      };
    }
  }, [screen]);

  const initYoutubePlayer = () => {
    if (!vslContainerRef.current) return;
    
    vslPlayerRef.current = new window.YT.Player(vslContainerRef.current, {
      videoId: 'SooSEqjUsCE',
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
        disablekb: 1,
        showinfo: 0
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
          progressInterval.current = setInterval(() => {
            const currentTime = event.target.getCurrentTime();
            const duration = event.target.getDuration();
            if (duration > 0) {
              const progress = (currentTime / duration) * 100;
              setVslProgress(progress);
            }
          }, 500);
        },
        onStateChange: (event) => {
          if (event.data === 0) {
            setIsVideoFinished(true);
            setVslProgress(100);
            if (progressInterval.current) clearInterval(progressInterval.current);
          }
          if (event.data === 2 && !isVideoFinished) {
            event.target.playVideo();
          }
        }
      }
    });
  };

  const takePhoto = () => {
    try {
      const video = videoRef.current;
      if (!video || !video.videoWidth) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
    } catch (e) {
      console.error("Erro ao capturar foto:", e);
    }
  };

  const playShutterSound = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const noise = context.createBufferSource();
      const bufferSize = context.sampleRate * 0.1;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.1);
      
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      noise.start();
    } catch (e) {}
  };

  const renderLanding = () => {
    return (
      <div style={{
        backgroundColor: colors.bg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(circle at top right, #FFF0F0, transparent), radial-gradient(circle at bottom left, #FDF8F5, transparent)'
      }}>
        <p style={{ 
          color: colors.rose, 
          letterSpacing: '0.4em', 
          fontSize: '12px', 
          fontWeight: 800, 
          marginBottom: '50px',
          opacity: 0.8
        }}>
          PELE DE VIDRO
        </p>

        <h1 className="cormorant" style={{
          color: colors.ink,
          fontSize: '2.5em',
          fontWeight: '700',
          lineHeight: '1.1',
          marginBottom: '20px',
          maxWidth: '320px'
        }}>
          Não seja mais <span style={{ color: colors.rose }}>Escrava</span> de Cremes, Maquiagem e Botox.
        </h1>

        <p style={{
          color: colors.stone,
          fontSize: '1.2em',
          lineHeight: '1.5',
          marginBottom: '30px',
          maxWidth: '300px',
          fontWeight: '500'
        }}>
          A IA vai analisar sua pele e entregar um protocolo personalizado que levanta e rejuvenesce!
        </p>

        <p style={{
          color: colors.roseDark,
          fontSize: '0.9em',
          fontStyle: 'italic',
          marginBottom: '40px',
          fontWeight: '600'
        }}>
          ⚠️ Apenas 1 análise por pessoa.
        </p>

        <button
          onClick={() => { QuizTracker.startQuiz(); setScreen(SCREENS.QUIZ); }}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '22px',
            backgroundColor: colors.rose,
            color: colors.white,
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.3em',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: `0 15px 35px ${colors.rose}44`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            animation: 'pulseBtn 2s infinite'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Começar
        </button>

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulseBtn {
            0% { transform: scale(1); box-shadow: 0 15px 35px ${colors.rose}44; }
            50% { transform: scale(1.02); box-shadow: 0 20px 45px ${colors.rose}66; }
            100% { transform: scale(1); box-shadow: 0 15px 35px ${colors.rose}44; }
          }
        `}</style>
      </div>
    );
  };

  // ── CORREÇÃO: totalSteps e steps declarados ANTES de handleNext e isSelectionMade ──
  const totalSteps = 18;

  const steps = [
    {
      type: 'radio',
      autoAdvance: true,
      question: 'Qual é o seu gênero?',
      options: [
        { id: 'gender-f', value: 'Feminino', label: 'A) Feminino' },
        { id: 'gender-m', value: 'Masculino', label: 'B) Masculino' }
      ]
    },
    {
      type: 'input',
      question: 'Como você se chama?',
      placeholder: 'Digite seu nome completo',
      buttonLabel: 'Continuar'
    },
    {
      type: 'input',
      question: 'Qual é a sua idade?',
      placeholder: 'Sua idade em números (ex: 45)',
      inputMode: 'numeric',
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Quando você se olha no espelho pela manhã, qual é a primeira coisa que te choca?',
      options: [
        { id: 'q1-a', value: 'Rugas profundas ao redor dos olhos', label: 'A) Rugas profundas ao redor dos olhos (pés de galinha que parecem garras)' },
        { id: 'q1-b', value: 'Flacidez no rosto', label: 'B) Flacidez no rosto — como se o rosto estivesse derretendo' },
        { id: 'q1-c', value: 'Manchas e melasma', label: 'C) Manchas e melasma espalhados pela face' },
        { id: 'q1-d', value: 'Tudo junto', label: 'D) Tudo junto — rugas, flacidez, manchas, tudo ao mesmo tempo' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Qual dessas situações mais te incomoda?',
      options: [
        { id: 'q2-a', value: 'Sem maquiagem', label: 'A) Não saio de casa sem maquiagem' },
        { id: 'q2-b', value: 'Evito tirar fotos', label: 'B) Evito tirar fotos porque meu rosto está feio' },
        { id: 'q2-c', value: 'Não me sinto mais desejada', label: 'C) Não me sinto mais desejada' },
        { id: 'q2-d', value: 'Todas as opções acima', label: 'D) Todas as opções acima — são muitas inseguranças' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Como esse envelhecimento está afetando sua vida?',
      options: [
        { id: 'q3-a', value: 'Emocional', label: 'A) Afeta diretamente o meu lado emocional — me sinto mais velha do que realmente sou' },
        { id: 'q3-b', value: 'Social', label: 'B) Meu lado social — evito sair, evito fotos, evito espelhos' },
        { id: 'q3-c', value: 'Relacionamento', label: 'C) Afeta meu relacionamento — sinto que perdi meu poder de atração' },
        { id: 'q3-d', value: 'Tudo', label: 'D) Afeta tudo — emocional, social, relacionamento, autoestima no chão' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      question: 'Há quanto tempo você começou a notar esses sinais de envelhecimento?',
      options: [
        { id: 'q4-a', value: '< 1 ano', label: 'A) Há menos de 1 ano — apareceu do nada' },
        { id: 'q4-b', value: '2-3 anos', label: 'B) Há 2-3 anos — vem piorando gradualmente' },
        { id: 'q4-c', value: '> 5 anos', label: 'C) Há mais de 5 anos — já é uma situação crítica' },
        { id: 'q4-d', value: 'Não sei', label: 'D) Não sei — só sei que acordei um dia e estava assim' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      question: 'Nos últimos 6 meses, como você avalia a velocidade do envelhecimento?',
      options: [
        { id: 'q5-a', value: 'Estável', label: 'A) Está estável — não piorou muito' },
        { id: 'q5-b', value: 'Lentamente', label: 'B) Está piorando lentamente — eu percebo' },
        { id: 'q5-c', value: 'Rápido', label: 'C) Está piorando rápido — cada mês vejo uma ruga nova' },
        { id: 'q5-d', value: 'Acelerado demais', label: 'D) Está acelerado demais — parece que envelheci 5 anos em 6 meses' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Como você se sente emocionalmente com essa situação?',
      options: [
        { id: 'q6-a', value: 'Incomodada', label: 'A) Incomodada, mas consigo lidar' },
        { id: 'q6-b', value: 'Frustrada', label: 'B) Frustrada — já tentei tudo e nada funciona' },
        { id: 'q6-c', value: 'Desesperada', label: 'C) Desesperada — sinto que estou perdendo meu tempo de vida' },
        { id: 'q6-d', value: 'Deprimida', label: 'D) Deprimida — isso está afetando a minha vida' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      question: 'Quanto você já gastou em cremes, tratamentos e procedimentos tentando resolver isso?',
      options: [
        { id: 'q7-a', value: '< 500', label: 'A) Menos de R$ 500 — tentei alguns produtos básicos' },
        { id: 'q7-b', value: '500-2000', label: 'B) Entre R$ 500 e R$ 2.000 — Ao longo dos anos investi em marcas boas' },
        { id: 'q7-c', value: '2000-5000', label: 'C) Entre R$ 2.000 e R$ 5.000 — fiz alguns procedimentos' },
        { id: 'q7-d', value: '> 5000', label: 'D) Mais de R$ 5.000 — já perdi a conta de quanto já gastei' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      question: 'Qual foi o resultado de tudo que você já tentou?',
      options: [
        { id: 'q8-a', value: 'Pouco', label: 'A) Funcionou um pouco — mas os resultados não duraram' },
        { id: 'q8-b', value: 'Nada', label: 'B) Não funcionou nada — foi dinheiro jogado fora' },
        { id: 'q8-c', value: 'Outros', label: 'C) Parece que só funciona para os outros' },
        { id: 'q8-d', value: 'Insuficiente', label: 'D) Percebo que tive melhora, mas ainda não está bom o suficiente' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Por que você acha que nada funcionou até agora?',
      options: [
        { id: 'q9-a', value: 'Produto errado', label: 'A) Porque não encontrei o produto certo' },
        { id: 'q9-b', value: 'Pele difícil', label: 'B) Porque meu tipo de pele é muito difícil' },
        { id: 'q9-c', value: 'Causa raiz', label: 'C) Porque os procedimentos são caros, duram pouco e não tratam a causa raiz' },
        { id: 'q9-d', value: 'Idade', label: 'D) Porque a idade já avançou demais para reverter' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      question: 'Qual é sua rotina atual de cuidados com a pele?',
      options: [
        { id: 'q10-a', value: 'Nenhuma', label: 'A) Praticamente nenhuma — só lavo o rosto e pronto' },
        { id: 'q10-b', value: 'Básica', label: 'B) Básica — limpeza e hidratante' },
        { id: 'q10-c', value: 'Completa', label: 'C) Completa — limpeza, sérum, hidratante, protetor solar' },
        { id: 'q10-d', value: 'Obsessiva', label: 'D) Obsessiva — tenho 10+ produtos, mas ainda assim não resolve' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Você sabe REALMENTE qual é a causa raiz do seu envelhecimento?',
      options: [
        { id: 'q11-a', value: 'Genética', label: 'A) Acho que é genética — minha mãe também envelheceu assim' },
        { id: 'q11-b', value: 'Colágeno', label: 'B) Acho que é falta de colágeno — mas não sei como repor' },
        { id: 'q11-c', value: 'Sol', label: 'C) Acho que é sol — mas não sei como reverter os danos' },
        { id: 'q11-d', value: 'Desconhecida', label: 'D) Não faço ideia — só sei que está acontecendo' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Se você descobrisse EXATAMENTE o que sua pele precisa, você estaria disposta a fazer?',
      options: [
        { id: 'q12-a', value: 'Rápido', label: 'A) Sim, mas só se for rápido e fácil' },
        { id: 'q12-b', value: 'Acessível', label: 'B) Sim, mas só se for acessível financeiramente' },
        { id: 'q12-c', value: 'Garantia', label: 'C) Sim, mas só se tiver garantia de resultado' },
        { id: 'q12-d', value: 'Sem importar o custo', label: 'D) Sim, sem importar o custo — quero meu rosto de volta' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Como você quer se sentir daqui a 30 dias?',
      options: [
        { id: 'q13-a', value: 'Transformada', label: 'A) Transformada — quero que as pessoas a minha volta notem a diferença' },
        { id: 'q13-b', value: 'Jovem', label: 'B) Jovem novamente — quero parecer 5, 10 ou até 15 anos mais jovem' },
        { id: 'q13-c', value: 'Poderosa', label: 'C) Poderosa — quero que as pessoas me olhem com admiração' },
        { id: 'q13-d', value: 'Tudo', label: 'D) Todas as opções anteriores' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'O que você mais deseja recuperar?',
      options: [
        { id: 'q14-a', value: 'Autoestima', label: 'A) Minha autoestima — quero me amar no espelho novamente' },
        { id: 'q14-b', value: 'Atração', label: 'B) Meu poder de atração — quero me sentir desejada' },
        { id: 'q14-c', value: 'Juventude', label: 'C) Minha juventude — quero parecer mais jovem do que sou' },
        { id: 'q14-d', value: 'Confiança', label: 'D) Mais confiante — não quero usar maquiagem para esconder meu rosto' }
      ],
      buttonLabel: 'Continuar'
    },
    {
      type: 'radio',
      multiple: true,
      question: 'Se você tivesse acesso a um protocolo personalizado que realmente funcionasse, quando você gostaria de começar?',
      options: [
        { id: 'q15-a', value: 'Possível', label: 'A) Assim que possível — não aguento mais esperar' },
        { id: 'q15-b', value: 'Próximos 30 dias', label: 'B) Nos próximos 30 dias — preciso resolver isso logo' },
        { id: 'q15-c', value: 'Prioridade', label: 'C) Me sentir jovem e bonita é prioridade na minha vida' }
      ],
      buttonLabel: 'Continuar'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      QuizTracker.complete({ name, age });
      setScreen(SCREENS.CAMERA);
    }
  };

  const handleSelection = (key, value, multiple = false, autoAdvance = false) => {
    if (multiple) {
      const currentSelections = Array.isArray(answers[key]) ? answers[key] : [];
      const newSelections = currentSelections.includes(value)
        ? currentSelections.filter(v => v !== value)
        : [...currentSelections, value];
      setAnswers(prev => ({ ...prev, [key]: newSelections }));
    } else {
      setAnswers(prev => ({ ...prev, [key]: value }));
      if (autoAdvance) {
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
          } else {
            setScreen(SCREENS.CAMERA);
          }
        }, 300);
      }
    }
  };

  const isSelectionMade = () => {
    if (currentStep === 0) return answers.gender;
    if (currentStep === 1) return name.trim().length > 2;
    if (currentStep === 2) return age.trim().length > 0 && !isNaN(age);
    
    const key = `q${currentStep - 2}`;
    const value = answers[key];
    const step = steps[currentStep];

    if (step?.multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return !!value;
  };

  const renderQuiz = () => {
    const step = steps[currentStep];
    const progress = ((currentStep) / (totalSteps)) * 100;

    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '500px', padding: '40px 24px', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ color: colors.rose, letterSpacing: '0.4em', fontSize: '11px', fontWeight: 800, marginBottom: '10px' }}>PELE DE VIDRO</p>
            <div style={{ width: '100%', height: '4px', backgroundColor: colors.warm, borderRadius: '10px', overflow: 'hidden', marginTop: '15px' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.rose, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {step.type === 'radio' ? (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <h2 className="cormorant" style={{ color: colors.ink, fontSize: '2.2em', marginBottom: '30px', fontWeight: 600, lineHeight: 1.1 }}>{step.question}</h2>
                <div>
                  {step.options.map((option) => {
                    const key = currentStep === 0 ? 'gender' : (currentStep === 2 ? 'age' : `q${currentStep - 2}`);
                    const value = answers[key];
                    const isSelected = step.multiple 
                      ? Array.isArray(value) && value.includes(option.value)
                      : value === option.value;
                    
                    return (
                      <label
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: isSelected ? colors.roseLight + "22" : colors.white,
                          padding: '22px',
                          marginBottom: '14px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: `1px solid ${isSelected ? colors.rose : colors.roseLight + "44"}`,
                          color: isSelected ? colors.roseDark : colors.stone,
                          fontSize: '1em',
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: step.multiple ? '4px' : '50%',
                          border: `2px solid ${isSelected ? colors.rose : colors.stone + "44"}`,
                          marginRight: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          backgroundColor: isSelected ? colors.rose : 'transparent'
                        }}>
                          {isSelected && !step.multiple && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.white }} />}
                          {isSelected && step.multiple && <span style={{ color: colors.white, fontSize: '12px' }}>✓</span>}
                        </div>
                        <input
                          type={step.multiple ? "checkbox" : "radio"}
                          name={key}
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleSelection(key, option.value, step.multiple, step.autoAdvance)}
                          style={{ display: 'none' }}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <h2 className="cormorant" style={{ color: colors.ink, fontSize: '2.2em', marginBottom: '30px', fontWeight: 600 }}>{step.question}</h2>
                <input
                  type={step.inputMode === 'numeric' ? 'number' : 'text'}
                  inputMode={step.inputMode || 'text'}
                  placeholder={step.placeholder}
                  value={currentStep === 1 ? name : age}
                  onChange={(e) => currentStep === 1 ? setName(e.target.value) : setAge(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '24px',
                    marginBottom: '30px',
                    border: `1px solid ${colors.roseLight}`,
                    borderRadius: '16px',
                    fontSize: '1.2em',
                    color: colors.ink,
                    backgroundColor: colors.white,
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>

          {(!step.autoAdvance || step.multiple) && (
            <div style={{ marginTop: '40px' }}>
              <button
                onClick={handleNext}
                disabled={!isSelectionMade()}
                style={{
                  width: '100%',
                  padding: '22px',
                  backgroundColor: isSelectionMade() ? colors.rose : colors.stone + "33",
                  color: colors.white,
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '1.1em',
                  fontWeight: '700',
                  cursor: isSelectionMade() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelectionMade() ? `0 12px 25px ${colors.rose}44` : 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {step.buttonLabel || 'Continuar'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderCamera = () => {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
        <h2 className="cormorant" style={{ color: colors.ink, fontSize: '2.2em', marginBottom: '10px', fontWeight: 600, textAlign: 'center' }}>Vamos analisar seu rosto com IA</h2>
        <p style={{ color: colors.stone, marginBottom: '30px', textAlign: 'center' }}>Posicione seu rosto na moldura</p>
        
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          aspectRatio: '3/4', 
          backgroundColor: '#1E1410', 
          borderRadius: '30px', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            style={{ 
              width: '100%', height: '100%', 
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }} 
          />
          
          <div style={{ 
            position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '20%', 
            border: `3px dashed ${colors.rose}`, borderRadius: '50%',
            boxShadow: '0 0 0 1000px rgba(30, 20, 16, 0.4)',
            zIndex: 2
          }} />

          {scanMessage && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '12px 24px',
              borderRadius: '30px',
              color: scanMessage.color,
              fontSize: '15px',
              fontWeight: 800,
              zIndex: 10,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              animation: 'pulse 1.5s infinite',
              whiteSpace: 'nowrap',
              border: `2px solid ${scanMessage.color}`
            }}>
              {scanMessage.text}
            </div>
          )}

          {isCapturing && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: '#fff',
              zIndex: 20,
              animation: 'flashEffect 0.4s ease-out forwards'
            }} />
          )}

          <div style={{ 
            position: 'absolute', top: '0', left: '0', right: '0', height: '3px', 
            background: `linear-gradient(90deg, transparent, ${colors.rose}, transparent)`, 
            boxShadow: `0 0 20px ${colors.rose}`,
            animation: 'scan 3s linear infinite',
            zIndex: 3
          }} />

          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${colors.rose}33 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            opacity: 0.3,
            zIndex: 1
          }} />
        </div>

        <button 
          onClick={() => {
            playShutterSound();
            setTimeout(() => {
              setIsVideoFinished(false);
              setProcessingStage(0);
              setVslProgress(0);
              setScreen(SCREENS.PROCESSING);
            }, 300);
          }}
          style={{ 
            marginTop: '40px', width: '100%', maxWidth: '300px', padding: '22px', 
            backgroundColor: colors.rose, color: colors.white, border: 'none', 
            borderRadius: '50px', fontSize: '1.2em', fontWeight: '800', cursor: 'pointer',
            boxShadow: `0 15px 30px ${colors.rose}44`,
            transition: 'all 0.3s ease'
          }}
        >
          TIRAR FOTO
        </button>
        
        <p style={{ marginTop: '20px', color: colors.stone, fontSize: '12px', opacity: 0.6 }}>
          Sua privacidade é nossa prioridade. Nenhum dado é salvo.
        </p>

        <style>{`
          @keyframes pulse {
            0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.98); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
            100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.98); }
          }
          @keyframes flashEffect {
            0% { opacity: 0; }
            30% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(400px); } }
        `}</style>
      </div>
    );
  };

  const renderAnalyzing = () => {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <style>{`
          .ring { width: 80px; height: 80px; border: 4px solid ${colors.roseLight}22; border-top: 4px solid ${colors.rose}; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 30px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <div className="ring" />
        <h2 className="cormorant" style={{ color: colors.ink, fontSize: '2em', maxWidth: '300px', lineHeight: 1.3 }}>
          Seu rosto está sendo analisado por nossa IA.
        </h2>
        <p style={{ color: colors.stone, marginTop: '20px', fontSize: '1.2em' }}>Aguarde o resultado...</p>
      </div>
    );
  };

  const renderProcessing = () => {
    const stages = [
      { text: "Analisando seu tipo de pele", progress: 100 },
      { text: "Analisando rugas e pontos críticos", progress: 100 },
      { text: "Avaliando sua musculatura", progress: 100 },
      { text: "Gerando sua análise", progress: Math.floor(vslProgress) }
    ];

    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>
        <h2 className="cormorant" style={{ color: colors.ink, fontSize: '2em', marginBottom: '10px', textAlign: 'center' }}>Seu resultado está sendo gerado agora...</h2>
        <p style={{ color: colors.stone, marginBottom: '30px', textAlign: 'center', maxWidth: '300px' }}>Enquanto isso, assista este vídeo rápido (1 minuto) onde você vai descobrir:</p>
        
        <ul style={{ color: colors.stone, textAlign: 'left', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>
          <li>✓ Por que nenhum creme funcionou até agora pra você</li>
          <li>✓ O que sua pele REALMENTE precisa</li>
          <li>✓ Como reverter os sinais de envelhecimento (mesmo que você já tenha tentado tudo)</li>
        </ul>

        <div style={{ 
          width: '100%', maxWidth: '320px', aspectRatio: '9/16', 
          backgroundColor: '#000', borderRadius: '15px', overflow: 'hidden',
          marginBottom: '40px', position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div ref={vslContainerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 10 }} />
        </div>

        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
          {stages.map((stage, idx) => {
            const isLastStage = idx === stages.length - 1;
            const currentStageProgress = isLastStage 
              ? vslProgress 
              : (processingStage > idx ? 100 : (processingStage === idx ? 70 : 0));

            return (
              <div key={idx} style={{ marginBottom: '15px', opacity: processingStage >= idx || isLastStage ? 1 : 0.3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: colors.ink, fontWeight: 600 }}>
                  <span>{stage.text}</span>
                  <span>{Math.floor(currentStageProgress)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: colors.warm, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${currentStageProgress}%`, 
                    height: '100%', backgroundColor: colors.rose, transition: isLastStage ? 'none' : 'width 1s ease' 
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => { QuizTracker.offer(); setScreen(SCREENS.SALES); }}
          disabled={!isVideoFinished}
          style={{ 
            width: '100%', maxWidth: '350px', padding: '22px', 
            backgroundColor: isVideoFinished ? colors.rose : colors.stone + "33", 
            color: colors.white, border: 'none', 
            borderRadius: '50px', fontSize: '1.2em', fontWeight: '800', 
            cursor: isVideoFinished ? 'pointer' : 'not-allowed',
            boxShadow: isVideoFinished ? `0 15px 30px ${colors.rose}44` : 'none',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: isVideoFinished ? 1 : 0.7
          }}
        >
          {isVideoFinished ? 'Continuar' : 'Assista para Liberar Resultado'}
        </button>
      </div>
    );
  };

  const renderSales = () => {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <style>{`
          .sales-card { background: white; padding: 30px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid ${colors.roseLight}33; margin-bottom: 25px; width: 100%; box-sizing: border-box; }
          .price-card { padding: 40px 30px; border-radius: 30px; text-align: center; margin-bottom: 30px; transition: transform 0.3s ease; border: 1px solid ${colors.roseLight}33; }
          .price-card.featured { border: 2px solid ${colors.rose}; background: ${colors.white}; transform: scale(1.05); }
          .faq-item { margin-bottom: 20px; border-bottom: 1px solid ${colors.warm}; padding-bottom: 15px; text-align: left; }
          .faq-q { color: ${colors.ink}; font-weight: 700; cursor: pointer; margin-bottom: 10px; display: block; }
          .faq-a { color: ${colors.stone}; font-size: 14px; line-height: 1.6; }
          .cormorant { font-family: 'Cormorant Garamond', serif; }
          @keyframes scan { 0% { transform: translateY(0); } 100% { transform: translateY(400px); } }
          @keyframes growBar { from { width: 0%; } }
        `}</style>

        <div style={{ width: '100%', maxWidth: '600px', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 className="cormorant" style={{ fontSize: '2.8em', color: colors.ink, lineHeight: 1.1, marginBottom: '20px', fontWeight: 700 }}>
              Você Não Está Velha. <span style={{ color: colors.rose }}>Sua Pele é que Está Feia</span> — Vamos Recuperá-la
            </h1>
            <p style={{ color: colors.stone, fontSize: '1.2em', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Você está em uma situação crítica de envelhecimento. Todos os sinais estão presentes e visíveis. 
              Você já investiu muito dinheiro, tentou muitas coisas, e nada funcionou. 
              Você pode estar até pensando em alguns procedimentos mais invasivos e mais caros. 
              Mas antes de fazer isso, você precisa entender o que realmente está acontecendo com sua pele e a causa raiz.
            </p>
          </div>

          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '20px', 
            backgroundColor: colors.white, padding: '20px', borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px',
            border: `1px solid ${colors.roseLight}`
          }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${colors.rose}`, flexShrink: 0 }}>
              {capturedImage ? (
                <img src={capturedImage} alt="Sua Análise" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: colors.warm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '30px' }}>👤</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 className="cormorant" style={{ color: colors.ink, margin: 0, fontSize: '1.6em', fontWeight: 700 }}>
                {(name || 'Paciente').charAt(0).toUpperCase() + (name || 'Paciente').slice(1).toLowerCase()}
              </h2>
              <p style={{ color: colors.rose, margin: '5px 0', fontSize: '14px', fontWeight: 600 }}>
                {age || '--'} anos • Análise Facial Concluída
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>✓ Protocolo Liberado</span>
              </div>
            </div>
          </div>

          <div className="sales-card" style={{ padding: '40px 24px' }}>
            <h3 className="cormorant" style={{ color: colors.ink, marginBottom: '25px', fontSize: '1.8em', textAlign: 'center' }}>
              Seu Plano de Transformação em 14 Dias
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '35px', fontSize: '12px', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: colors.roseDark }}></div>
                <span>Hoje (Sinais Identificados)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2E7D32' }}></div>
                <span>Após 14 Dias (Meta)</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {[
                { label: "Rugas e Linhas", current: 90, goal: 15 },
                { label: "Firmeza (Efeito Lift)", current: 85, goal: 10 },
                { label: "Uniformidade (Manchas)", current: 75, goal: 20 },
                { label: "Bigode Chinês", current: 95, goal: 25 }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: colors.ink }}>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ height: '10px', backgroundColor: colors.warm, borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.current}%`, height: '100%', backgroundColor: colors.roseDark, animation: 'growBar 1.5s ease-out forwards', boxShadow: `0 0 10px ${colors.roseDark}44` }} />
                    </div>
                    <div style={{ height: '10px', backgroundColor: colors.warm, borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.goal}%`, height: '100%', backgroundColor: '#2E7D32', animation: 'growBar 2s ease-out forwards', boxShadow: '0 0 10px rgba(46, 125, 50, 0.3)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '30px', color: colors.stone, fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>
              Resultados projetados com base no Protocolo Personalizado.
            </p>
          </div>

          <div className="sales-card" style={{ backgroundColor: colors.wine, color: colors.white }}>
            <h3 style={{ color: colors.goldLight, marginBottom: '20px', fontSize: '1.3em' }}>Seu Protocolo Personalizado:</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, opacity: 0.9 }}>Com base na sua análise, criamos um protocolo exclusivo e personalizado:</p>
            <div style={{ marginTop: '20px' }}>
              <p>✓ Exercícios faciais diários — 7 min/dia</p>
              <p>✓ Receitas Pele de Porcelana</p>
              <p>✓ Cronograma personalizado</p>
            </div>
            <p style={{ marginTop: '20px', fontWeight: 700, color: colors.goldLight }}>Resultados visíveis em apenas 2 semanas.</p>
          </div>

          <div style={{ margin: '60px 0' }}>
            <h2 className="cormorant" style={{ textAlign: 'center', fontSize: '1.8em', marginBottom: '30px', color: colors.wine, lineHeight: 1.3 }}>
              Veja os resultados de quem trocou os cremes pelo protocolo personalizado:
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="sales-card" style={{ padding: '10px', overflow: 'hidden', border: `1px solid ${colors.gold}` }}>
                <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: colors.wine }}>14 dias de protocolo</div>
                <img src="/assets/14dias.jpg" alt="14 dias" style={{ width: '100%', borderRadius: '12px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              </div>
              <div className="sales-card" style={{ padding: '10px', overflow: 'hidden', border: `1px solid ${colors.gold}` }}>
                <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: colors.wine }}>40 dias de protocolo</div>
                <img src="/assets/40dias.jpg" alt="40 dias" style={{ width: '100%', borderRadius: '12px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          </div>

          <div style={{ margin: '60px 0' }}>
            <h2 className="cormorant" style={{ textAlign: 'center', fontSize: '2.2em', marginBottom: '40px' }}>Histórias de Transformação</h2>
            {[
              { name: "Fernanda C. — 47 anos, São Paulo", text: '"Minha filha tirou uma foto minha na festa de aniversário dela. Eu vi e quase chorei — de vergonha. Fiquei meses sem tirar fotos. Comecei o aplicativo sem muita expectativa. Quatro semanas depois, meu marido perguntou: \'O que você fez no rosto?\' Eu não tinha feito nada kkkk. Só os 7 minutinhos."', image: "/assets/fernanda.png" },
              { name: "Renata M. — 41 anos, Belo Horizonte", text: '"Desativava a câmera em toda reunião de trabalho. Tinha vergonha do meu próprio rosto numa tela. O scanner identificou exatamente os músculos que derretiam o meu rosto — que é o que mais me incomoda. Fiquei chocada com a precisão. E em 3 semanas já vi a diferença."', image: "/assets/renata.png" },
              { name: "Carla S. — 52 anos, Curitiba", text: '"Já joguei muito dinheiro fora em creme. Comprei o Pele de Vidro sem muita esperança. Dois meses depois minha colega de trabalho perguntou se eu tinha feito botox. Não fiz nada. Só os exercícios e as receitinhas."', image: "/assets/carla.png" }
            ].map((t, idx) => (
              <div key={idx} className="sales-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  <img src={t.image} alt={t.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.gold}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFD700', marginBottom: '8px', fontSize: '14px' }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ fontStyle: 'italic', color: colors.ink, marginBottom: '10px', fontSize: '14px', lineHeight: 1.5 }}>{t.text}</p>
                  <p style={{ fontWeight: 700, fontSize: '12px', color: colors.stone }}>{t.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sales-card" style={{ textAlign: 'center', border: `2px solid ${colors.gold}` }}>
            <img src="https://cdn-icons-png.flaticon.com/512/1000/1000958.png" width="80" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: colors.wine }}>Garantia de 7 dias</h3>
            <p style={{ fontSize: '14px', color: colors.stone }}>Se em uma semana você não sentir diferença nos seus músculos faciais, devolvemos 100% do seu dinheiro sem perguntas.</p>
          </div>

          <div style={{ marginTop: '80px' }}>
            <h2 className="cormorant" style={{ textAlign: 'center', fontSize: '2.5em', marginBottom: '50px' }}>Escolha o seu nível de transformação</h2>
            
            <div className="price-card" style={{ backgroundColor: colors.white }}>
              <h3 style={{ color: colors.stone }}>BÁSICO</h3>
              <div style={{ fontSize: '3em', fontWeight: 800, color: colors.ink, margin: '20px 0' }}>R$ 47</div>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: colors.stone, fontSize: '15px' }}>
                <li>✦ 1 análise facial com IA</li>
                <li>✦ Protocolo Exclusivo e Personalizado</li>
                <li>✦ Exercícios diários</li>
                <li>✦ Receitas Pele de Porcelana</li>
              </ul>
              <button onClick={() => { QuizTracker.checkout('Básico'); window.location.href = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-e7329e19-5ee0-4851-8076-951541d1ea64'; }} style={{ width: '100%', marginTop: '30px', padding: '15px', background: colors.stone, color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>
                Comprar Agora
              </button>
            </div>

            <div className="price-card featured">
              <span style={{ background: colors.rose, color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>🏆 MAIS ESCOLHIDO</span>
              <h3 style={{ color: colors.rose, marginTop: '15px' }}>PRÓ</h3>
              <div style={{ fontSize: '3.5em', fontWeight: 800, color: colors.ink, margin: '20px 0' }}>R$ 97</div>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: colors.stone, fontSize: '15px' }}>
                <li>✦ 3 análises faciais com IA</li>
                <li>✦ Protocolo Exclusivo e Personalizado</li>
                <li>✦ Exercícios diários + Receitas</li>
                <li>✦ <b>BÔNUS:</b> Protocolo Adeus Papada</li>
              </ul>
              <button onClick={() => { QuizTracker.checkout('Pró'); window.location.href = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-2323deb7-5efe-4c81-b67d-7d6e44e27a94'; }} style={{ width: '100%', marginTop: '30px', padding: '20px', background: colors.rose, color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}>
                Eu Quero o Pró
              </button>
            </div>

            <div className="price-card" style={{ backgroundColor: colors.wine, color: colors.white }}>
              <h3 style={{ color: colors.goldLight }}>PREMIUM</h3>
              <div style={{ fontSize: '3em', fontWeight: 800, color: colors.white, margin: '20px 0' }}>R$ 117</div>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, opacity: 0.8, fontSize: '15px' }}>
                <li>✦ 10 análises faciais com IA</li>
                <li>✦ Protocolo Exclusivo e Personalizado</li>
                <li>✦ Exercícios diários + Receitas</li>
                <li>✦ <b>BÔNUS:</b> Protocolo Adeus Papada</li>
                <li>✦ <b>BÔNUS:</b> Protocolo Pescoço e Colo</li>
              </ul>
              <button onClick={() => { QuizTracker.checkout('Premium'); window.location.href = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-a7336747-c1f9-4a6b-886b-12db980e2b6b'; }} style={{ width: '100%', marginTop: '30px', padding: '15px', background: colors.gold, color: colors.wine, border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }}>
                Comprar Agora
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: colors.stone, marginTop: '20px', marginBottom: '80px' }}>
            "Pagamento único e seguro. Sem mensalidade. Sem renovação automática. Acesso imediato."
          </p>

          <div style={{ marginBottom: '80px' }}>
            <h2 className="cormorant" style={{ textAlign: 'center', fontSize: '2.2em', marginBottom: '40px' }}>Perguntas Frequentes</h2>
            {[
              { q: '"Será que funciona pra mim? Já tentei tanta coisa…"', a: "Faz sentido desconfiar. Te prometeram mundos e fundos e nada mudou. A diferença aqui é a personalização..." },
              { q: '"Não tenho tempo pra mais uma coisa."', a: "7 minutos por dia. A maioria das nossas usuárias faz a noite, enquanto assiste Netflix..." },
              { q: '"É tarde demais pra mim?"', a: "A pele tem memória muscular. Em qualquer fase, quando você começa a trabalhar os músculos faciais certos, a resposta aparece..." },
              { q: '"Vai me deixar com cara artificial?"', a: "Nunca. O protocolo fortalece e reposiciona músculos específicos do seu rosto de forma natural..." },
              { q: '"O que são os créditos de análise?"', a: "Cada crédito = uma análise facial completa pela IA. Use para acompanhar sua evolução..." }
            ].map((item, idx) => (
              <div key={idx} className="faq-item">
                <span className="faq-q">{item.q}</span>
                <p className="faq-a">{item.a}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '60px 0', borderTop: `1px solid ${colors.warm}` }}>
            <h2 className="cormorant" style={{ fontSize: '2.5em', marginBottom: '30px' }}>Qual mulher você escolhe ser hoje?</h2>
            <button onClick={() => { QuizTracker.checkout('Pró - Final CTA'); window.location.href = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3266402800-2323deb7-5efe-4c81-b67d-7d6e44e27a94'; }} style={{ padding: '20px 40px', background: colors.rose, color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '1.2em', cursor: 'pointer', boxShadow: `0 15px 30px ${colors.roseDark}44` }}>
              Quero meu protocolo personalizado
            </button>
            <p style={{ marginTop: '20px', color: colors.stone, fontSize: '14px' }}>
              Análise em menos de 1 minuto. Protocolo em segundos. Resultado em 2 semanas.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {screen === SCREENS.LANDING && renderLanding()}
      {screen === SCREENS.QUIZ && renderQuiz()}
      {screen === SCREENS.CAMERA && renderCamera()}
      {screen === SCREENS.ANALYZING && renderAnalyzing()}
      {screen === SCREENS.PROCESSING && renderProcessing()}
      {screen === SCREENS.SALES && renderSales()}
    </div>
  );
};

export default QuizStandalone;
