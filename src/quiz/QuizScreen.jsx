import React, { useState, useEffect } from 'react';
import { colors } from '../theme';

const QuizScreen = ({ onFinish }) => {
  const totalSteps = 18; // 3 identificação + 15 perguntas + 1 câmera
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');

  // Carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quizPeleVidro');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentStep(data.currentStep || 0);
      setAnswers(data.answers || {});
      setName(data.name || '');
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('quizPeleVidro', JSON.stringify({
      currentStep,
      answers,
      name
    }));
  }, [currentStep, answers, name]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onFinish) onFinish({ answers, name });
    }
  };

  const handleSelection = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const isSelectionMade = () => {
    if (currentStep === 0) return answers.gender; // Gênero
    if (currentStep === 1) return name.trim(); // Nome
    if (currentStep === 2) return answers.age; // Idade
    if (currentStep === 17) return true; // Câmera (sempre habilitado no MVP)
    return answers[`q${currentStep - 2}`]; // Perguntas (ajustado para índice 1-15)
  };

  const steps = [
    {
      type: 'radio',
      question: 'Qual é o seu gênero?',
      options: [
        { id: 'gender-f', value: 'Feminino', label: 'A) Feminino' },
        { id: 'gender-m', value: 'Masculino', label: 'B) Masculino' }
      ]
    },
    {
      type: 'input',
      question: 'Como você se chama?',
      placeholder: 'Seu nome'
    },
    {
      type: 'radio',
      question: 'Qual é a sua idade?',
      options: [
        { id: 'age-20-30', value: '20-30 anos', label: 'A) 20-30 anos' },
        { id: 'age-31-40', value: '31-40 anos', label: 'B) 31-40 anos' },
        { id: 'age-41-50', value: '41-50 anos', label: 'C) 41-50 anos' },
        { id: 'age-51+', value: '51+ anos', label: 'D) 51+ anos' }
      ]
    },
    {
      type: 'radio',
      question: 'Quando você se olha no espelho pela manhã, qual é a primeira coisa que te choca?',
      options: [
        { id: 'q1-a', value: 'Rugas profundas ao redor dos olhos', label: 'A) Rugas profundas ao redor dos olhos' },
        { id: 'q1-b', value: 'Flacidez no rosto — "derretendo"', label: 'B) Flacidez no rosto — "derretendo"' },
        { id: 'q1-c', value: 'Manchas e melasma espalhados', label: 'C) Manchas e melasma espalhados' },
        { id: 'q1-d', value: 'Tudo junto — rugas, flacidez e manchas', label: 'D) Tudo junto — rugas, flacidez e manchas' }
      ]
    },
    {
      type: 'radio',
      question: 'Qual dessas situações mais te incomoda?',
      options: [
        { id: 'q2-a', value: 'Não saio de casa sem maquiagem', label: 'A) Não saio de casa sem maquiagem' },
        { id: 'q2-b', value: 'Evito tirar fotos do meu rosto', label: 'B) Evito tirar fotos do meu rosto' },
        { id: 'q2-c', value: 'Insegurança no meu relacionamento', label: 'C) Insegurança no meu relacionamento' },
        { id: 'q2-d', value: 'Todas as anteriores', label: 'D) Todas as anteriores' }
      ]
    },
    {
      type: 'radio',
      question: 'Como esse envelhecimento está afetando você?',
      options: [
        { id: 'q3-a', value: 'Lado emocional — sinto-me mais velha', label: 'A) Lado emocional — sinto-me mais velha' },
        { id: 'q3-b', value: 'Lado social — evito espelhos e fotos', label: 'B) Lado social — evito espelhos e fotos' },
        { id: 'q3-c', value: 'Relacionamento — perdi poder de atração', label: 'C) Relacionamento — perdi poder de atração' },
        { id: 'q3-d', value: 'Afeta tudo — autoestima no chão', label: 'D) Afeta tudo — autoestima no chão' }
      ]
    },
    {
      type: 'radio',
      question: 'Há quanto tempo notou esses sinais?',
      options: [
        { id: 'q4-a', value: 'Há menos de 1 ano', label: 'A) Há menos de 1 ano' },
        { id: 'q4-b', value: 'Há 2-3 anos', label: 'B) Há 2-3 anos' },
        { id: 'q4-c', value: 'Há mais de 5 anos', label: 'C) Há mais de 5 anos' },
        { id: 'q4-d', value: 'Não sei ao certo', label: 'D) Não sei ao certo' }
      ]
    },
    {
      type: 'radio',
      question: 'Velocidade do envelhecimento nos últimos meses:',
      options: [
        { id: 'q5-a', value: 'Está estável', label: 'A) Está estável' },
        { id: 'q5-b', value: 'Piorando lentamente', label: 'B) Piorando lentamente' },
        { id: 'q5-c', value: 'Piorando rápido', label: 'C) Piorando rápido' },
        { id: 'q5-d', value: 'Acelerado demais', label: 'D) Acelerado demais' }
      ]
    },
    {
      type: 'radio',
      question: 'Como você se sente emocionalmente?',
      options: [
        { id: 'q6-a', value: 'Incomodada, mas lido bem', label: 'A) Incomodada, mas lido bem' },
        { id: 'q6-b', value: 'Frustrada — nada funciona', label: 'B) Frustrada — nada funciona' },
        { id: 'q6-c', value: 'Desesperada', label: 'C) Desesperada' },
        { id: 'q6-d', value: 'Deprimida', label: 'D) Deprimida' }
      ]
    },
    {
      type: 'radio',
      question: 'Quanto já gastou em tratamentos?',
      options: [
        { id: 'q7-a', value: 'Menos de R$ 500', label: 'A) Menos de R$ 500' },
        { id: 'q7-b', value: 'Entre R$ 500 e R$ 2.000', label: 'B) Entre R$ 500 e R$ 2.000' },
        { id: 'q7-c', value: 'Entre R$ 2.000 e R$ 5.000', label: 'C) Entre R$ 2.000 e R$ 5.000' },
        { id: 'q7-d', value: 'Mais de R$ 5.000', label: 'D) Mais de R$ 5.000' }
      ]
    },
    {
      type: 'radio',
      question: 'Qual foi o resultado do que tentou?',
      options: [
        { id: 'q8-a', value: 'Funcionou pouco e temporário', label: 'A) Funcionou pouco e temporário' },
        { id: 'q8-b', value: 'Dinheiro jogado fora', label: 'B) Dinheiro jogado fora' },
        { id: 'q8-c', value: 'Só funciona para os outros', label: 'C) Só funciona para os outros' },
        { id: 'q8-d', value: 'Alguma melhora, mas insuficiente', label: 'D) Alguma melhora, mas insuficiente' }
      ]
    },
    {
      type: 'radio',
      question: 'Por que acha que nada funcionou?',
      options: [
        { id: 'q9-a', value: 'Não encontrei o produto certo', label: 'A) Não encontrei o produto certo' },
        { id: 'q9-b', value: 'Minha pele é muito difícil', label: 'B) Minha pele é muito difícil' },
        { id: 'q9-c', value: 'Tratamentos não tratam a causa raiz', label: 'C) Tratamentos não tratam a causa raiz' },
        { id: 'q9-d', value: 'A idade avançou demais', label: 'D) A idade avançou demais' }
      ]
    },
    {
      type: 'radio',
      question: 'Sua rotina atual de cuidados:',
      options: [
        { id: 'q10-a', value: 'Nenhuma', label: 'A) Nenhuma' },
        { id: 'q10-b', value: 'Básica (limpeza e hidratação)', label: 'B) Básica (limpeza e hidratação)' },
        { id: 'q10-c', value: 'Completa', label: 'C) Completa' },
        { id: 'q10-d', value: 'Obsessiva (muitos produtos)', label: 'D) Obsessiva (muitos produtos)' }
      ]
    },
    {
      type: 'radio',
      question: 'Sabe a causa raiz do seu envelhecimento?',
      options: [
        { id: 'q11-a', value: 'Acho que é genética', label: 'A) Acho que é genética' },
        { id: 'q11-b', value: 'Falta de colágeno', label: 'B) Falta de colágeno' },
        { id: 'q11-c', value: 'Danos do sol', label: 'C) Danos do sol' },
        { id: 'q11-d', value: 'Não faço ideia', label: 'D) Não faço ideia' }
      ]
    },
    {
      type: 'radio',
      question: 'Estaria disposta a seguir a solução ideal?',
      options: [
        { id: 'q12-a', value: 'Sim, se for rápido e fácil', label: 'A) Sim, se for rápido e fácil' },
        { id: 'q12-b', value: 'Sim, se for acessível', label: 'B) Sim, se for acessível' },
        { id: 'q12-c', value: 'Sim, com garantia de resultado', label: 'C) Sim, com garantia de resultado' },
        { id: 'q12-d', value: 'Sim, sem importar o custo', label: 'D) Sim, sem importar o custo' }
      ]
    },
    {
      type: 'radio',
      question: 'Como quer se sentir em 30 dias?',
      options: [
        { id: 'q13-a', value: 'Transformada e notada', label: 'A) Transformada e notada' },
        { id: 'q13-b', value: '10 anos mais jovem', label: 'B) 10 anos mais jovem' },
        { id: 'q13-c', value: 'Poderosa e admirada', label: 'C) Poderosa e admirada' },
        { id: 'q13-d', value: 'Todas as anteriores', label: 'D) Todas as anteriores' }
      ]
    },
    {
      type: 'radio',
      question: 'O que mais deseja recuperar?',
      options: [
        { id: 'q14-a', value: 'Minha autoestima no espelho', label: 'A) Minha autoestima no espelho' },
        { id: 'q14-b', value: 'Meu poder de atração', label: 'B) Meu poder de atração' },
        { id: 'q14-c', value: 'Minha juventude', label: 'C) Minha juventude' },
        { id: 'q14-d', value: 'Confiança sem maquiagem', label: 'D) Confiança sem maquiagem' }
      ]
    },
    {
      type: 'radio',
      question: 'Quando gostaria de começar?',
      options: [
        { id: 'q15-a', value: 'Imediatamente', label: 'A) Imediatamente' },
        { id: 'q15-b', value: 'Nos próximos 30 dias', label: 'B) Nos próximos 30 dias' },
        { id: 'q15-c', value: 'É minha prioridade máxima', label: 'C) É minha prioridade máxima' }
      ]
    }
  ];

  const renderStep = () => {
    const step = steps[currentStep] || (currentStep === 17 ? { type: 'camera' } : null);
    if (!step) return null;

    if (step.type === 'radio') {
      return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ color: colors.cream, fontSize: '1.6em', marginBottom: '25px', fontWeight: 300, lineHeight: 1.2 }}>{step.question}</h2>
          <div style={{ marginBottom: '30px' }}>
            {step.options.map((option) => {
              const isSelected = answers[`q${currentStep - 2}`] === option.value || (currentStep === 0 && answers.gender === option.value) || (currentStep === 2 && answers.age === option.value);
              const key = currentStep === 0 ? 'gender' : (currentStep === 2 ? 'age' : `q${currentStep - 2}`);
              
              return (
                <label
                  key={option.id}
                  style={{
                    display: 'block',
                    backgroundColor: isSelected ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    padding: '18px 20px',
                    marginBottom: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: `1px solid ${isSelected ? colors.gold : 'rgba(201, 169, 110, 0.1)'}`,
                    color: isSelected ? colors.goldLight : colors.muted,
                    fontSize: '1em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name={key}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleSelection(key, option.value)}
                    style={{ display: 'none' }}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      );
    } else if (step.type === 'input') {
      return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ color: colors.cream, fontSize: '1.6em', marginBottom: '25px', fontWeight: 300 }}>{step.question}</h2>
          <input
            type="text"
            placeholder={step.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '18px',
              marginBottom: '25px',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              fontSize: '1.1em',
              color: colors.cream,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = colors.gold}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
        </div>
      );
    } else if (currentStep === 17) {
      return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
          <h2 style={{ color: colors.cream, fontSize: '1.6em', marginBottom: '25px', fontWeight: 300 }}>Análise Facial Avançada</h2>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(10, 9, 8, 0.8) 100%)',
              border: `1px dashed ${colors.gold}`,
              borderRadius: '24px',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              marginBottom: '25px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
             {/* Scanner line animation placeholder */}
             <div style={{
               position: 'absolute',
               top: '0', left: '0', right: '0',
               height: '2px', background: colors.gold,
               boxShadow: `0 0 15px ${colors.gold}`,
               animation: 'scan 3s linear infinite'
             }} />
            
            <span style={{ fontSize: '4em', marginBottom: '15px' }}>📸</span>
            <p style={{ color: colors.goldLight, fontWeight: 500 }}>Scanner Facial Ativo</p>
            <p style={{ color: colors.muted, fontSize: '0.9em', marginTop: '10px', maxWidth: '200px' }}>
              Posicione seu rosto dentro da moldura para análise de IA.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
      }}
    >
      <div style={{ padding: '0 25px' }}>
        {/* Barra de Progresso */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ color: colors.muted, fontSize: '10px', letterSpacing: '0.1em' }}>PROGRESSO {Math.round(progress)}%</span>
          <span style={{ color: colors.gold, fontSize: '10px' }}>{currentStep + 1} / {totalSteps}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '2px',
            marginBottom: '40px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: colors.gold,
              boxShadow: `0 0 10px ${colors.gold}44`,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        {/* Renderizar Etapa Atual */}
        {renderStep()}

        {/* Botão Continuar */}
        <button
          onClick={handleNext}
          disabled={!isSelectionMade()}
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: isSelectionMade() ? colors.gold : colors.surface,
            color: isSelectionMade() ? colors.bg : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1em',
            fontWeight: '600',
            cursor: isSelectionMade() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: isSelectionMade() ? `0 10px 20px ${colors.gold}33` : 'none',
            marginTop: '10px'
          }}
        >
          {currentStep === 17 ? 'Finalizar Análise' : 'Continuar ➔'}
        </button>


      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}} />
    </div>
  );
};

export default QuizScreen;
