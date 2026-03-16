import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── THEME (From PV.PeleDeVidro.jsx) ───────────────────────────────
const colors = {
  bg: "#0A0908",
  surface: "#13110F",
  card: "#1C1916",
  border: "#2E2820",
  gold: "#C9A96E",
  goldLight: "#E8CFA0",
  cream: "#F5EFE6",
  muted: "#8C7B6B",
  rose: "#C4907A",
  success: "#7DAA8A",
  danger: "#C47A7A",
};

export default function SalesPage({ userEmail }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll observation for reveal effect
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-on");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePurchase = (url) => {
    if (url) {
      window.location.href = url;
    } else {
      alert("Link de pagamento pendente de configuração.");
    }
  };

  const PlanCard = ({ name, price, sub, credits, features, highlight, tier, checkoutUrl }) => (
    <div className="reveal" style={{
      background: highlight ? "linear-gradient(135deg, #F5EFE6 0%, #E8CFA0 100%)" : colors.card,
      border: highlight ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
      borderRadius: "26px",
      padding: "40px 30px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      transition: "transform 0.3s ease",
      transform: highlight ? "scale(1.05)" : "scale(1)",
      boxShadow: highlight ? `0 20px 50px ${colors.gold}33` : "none",
    }}>
      {highlight && (
        <div style={{
          position: "absolute",
          top: "-15px",
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(135deg, ${colors.rose}, #9B4A46)`,
          color: "#fff",
          fontSize: "11px",
          letterSpacing: "0.16em",
          fontWeight: "bold",
          padding: "8px 24px",
          borderRadius: "100px",
          whiteSpace: "nowrap"
        }}>🏆 MAIS ESCOLHIDO</div>
      )}
      <div style={{ fontSize: "11px", letterSpacing: "0.18em", color: highlight ? "#9B4A46" : colors.rose, marginBottom: "6px", textTransform: "uppercase" }}>{tier}</div>
      <h3 className="cormorant" style={{ color: highlight ? "#3D1A1A" : colors.gold, fontSize: "32px", marginBottom: "4px", fontWeight: highlight ? "700" : "500" }}>{name}</h3>
      <div style={{ color: highlight ? "#5C4638" : colors.muted, fontSize: "13px", marginBottom: "22px", lineHeight: 1.5 }}>
        {name === "Básico" ? "Para quem quer começar e sentir a diferença" : name === "Pró" ? "Para quem quer acompanhar a evolução de verdade" : "O investimento mais inteligente."}
      </div>
      
      <div style={{ borderTop: `1px solid ${highlight ? "rgba(61, 26, 26, 0.1)" : colors.border}`, padding: "22px 0", marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ color: highlight ? "#9B4A46" : colors.rose, fontSize: "18px", fontWeight: "600" }}>R$</span>
          <span className="cormorant" style={{ color: highlight ? "#3D1A1A" : colors.gold, fontSize: "58px", lineHeight: 1, fontWeight: highlight ? "700" : "400" }}>{price}</span>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} style={{ color: highlight ? "#3D1A1A" : colors.muted, fontSize: highlight ? "14px" : "13px", marginBottom: "11px", display: "flex", alignItems: "start", gap: "10px", lineHeight: 1.55 }}>
            <span style={{ color: highlight ? "#9B4A46" : colors.rose, fontSize: "11px", marginTop: "4px" }}>✦</span> 
            <span>{f.includes("—") ? (
              <><strong>{f.split(" — ")[0]}</strong> — {f.split(" — ")[1]}</>
            ) : f}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => handlePurchase(checkoutUrl)}
        style={{
          width: "100%",
          padding: "20px",
          borderRadius: "100px",
          background: highlight ? `linear-gradient(135deg, #3D1A1A, #1A0908)` : "transparent",
          border: highlight ? "none" : `1.5px solid ${colors.border}`,
          color: highlight ? colors.goldLight : "#fff",
          fontWeight: highlight ? "700" : "500",
          fontSize: "15px",
          letterSpacing: "0.05em",
          cursor: "pointer",
          boxShadow: highlight ? `0 14px 30px rgba(61,26,26,0.3)` : "none",
          transition: "all 0.25s",
          textTransform: "uppercase"
        }}
      >
        {highlight ? "EU QUERO O PRÓ" : "Comprar agora"}
      </button>
    </div>
  );

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: colors.cream }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');
        .cormorant { font-family: 'Cormorant Garamond', serif; }
        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .75s ease, transform .75s ease; }
        .reveal-on { opacity: 1; transform: translateY(0); }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A96E 0%, #F5EFE6 50%, #C9A96E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Topbar */}
      <div style={{ background: "#3D1A1A", padding: "11px 20px", textAlign: "center", fontSize: "12px", letterSpacing: "0.05em", color: "rgba(253,248,243,0.6)" }}>
        <strong style={{ color: colors.goldLight }}>Protocolo de 7 minutos</strong> que transforma rugas e flacidez em rejuvenescimento — sem agulha, sem consultório.
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(10, 9, 8, 0.95)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${colors.border}`, padding: "16px 40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Link to="/" className="cormorant" style={{ color: colors.gold, fontSize: "24px", textDecoration: "none" }}>Pele de <span style={{ color: colors.rose }}>Vidro</span></Link>
      </nav>

      {/* Hero */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", minHeight: "80vh" }}>
        <div style={{ padding: "80px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 className="cormorant reveal" style={{ fontSize: "64px", lineHeight: 1.1, color: colors.gold, marginBottom: "28px" }}>
            Você não está velha. <br/>
            <em style={{ color: colors.rose, fontStyle: "italic", display: "block" }}>Sua pele é que está feia.</em>
          </h1>
          <div className="reveal" style={{ fontSize: "16px", lineHeight: 1.88, color: colors.muted, maxWidth: "640px", marginBottom: "38px", textAlign: "left" }}>
            <p style={{ marginBottom: "20px" }}>Rugas mais fundas do que deveriam estar. Pele caindo onde antes era firme. Manchas, olheiras, bigode chinês, papada. O rosto que você vê no espelho — especialmente na câmera frontal sem filtro — não combina com a mulher que você gostaria de ser.</p>
            <p style={{ marginBottom: "20px" }}>Você já tentou creme. Já tentou rotina. Talvez já tenha feito procedimento. E a pele continua envelhecendo do mesmo jeito — porque nenhuma dessas soluções foi feita para o seu rosto, para as suas rugas, para os seus músculos específicos.</p>
            <p>O <strong>App Pele de Vidro</strong> usa IA para escanear exatamente onde você está perdendo firmeza e cria um protocolo de exercícios faciais 100% personalizado. <strong>7 minutos por dia. Resultado visível em apenas 2 semanas.</strong></p>
          </div>
        </div>
        <div style={{ background: `url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&q=85&fit=crop') center/cover`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0A0908 0%, transparent 20%)" }}></div>
        </div>
      </section>

      {/* Evolução Real (Images) */}
      <section style={{ padding: "80px 24px", background: colors.surface }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 className="cormorant reveal" style={{ fontSize: "42px", color: colors.gold, textAlign: "center", marginBottom: "48px", padding: "0 24px" }}>Análise facial em segundos.<br/><span style={{fontSize: "28px", color: colors.rose}}>Primeiros resultados em 2 semanas.</span></h2>
          
          <div className="reveal" style={{ background: "#fff", borderRadius: "14px", padding: "16px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <img src="/antes_e_depois.png" style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }} alt="Antes e Depois" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 className="cormorant reveal" style={{ fontSize: "44px", color: colors.cream }}>Quando foi a última vez <br/> que você gostou do que viu?</h2>
          </div>
          <div className="reveal" style={{ fontSize: "16px", lineHeight: 2, color: colors.muted, maxWidth: "640px", margin: "0 auto 64px", textAlign: "left" }}>
            <p style={{ marginBottom: "20px" }}>Olha uma foto. Vê o reflexo no espelho. Ou a câmera do Zoom abre de surpresa.</p>
            <p style={{ marginBottom: "20px" }}>E o pensamento vem: <em>"Quando eu fiquei assim?"</em></p>
            <p style={{ marginBottom: "20px" }}>Não foi gradual. Foi de repente. E brutal.</p>
            <p style={{ marginBottom: "20px" }}>A pele que antes sustentava tudo agora parece estar derretendo. O contorno foi embora. As olheiras não saem mais com dormir bem. O bigode chinês que você jurava que "nunca ia aparecer em você" — apareceu. E a papada que você nota só nas fotos ruins agora aparece o tempo todo.</p>
            <p style={{ marginBottom: "20px" }}>Você já tentou resolver. Comprou cremes. Assistiu vídeos. Talvez tenha até feito algum procedimento. E a pele continua envelhecendo. Continua caindo. Continua te incomodando todos os dias.</p>
            <p style={{ marginBottom: "20px" }}>Não porque você se descuidou. Mas porque cremes são genéricos. Procedimentos são caros e temporários. E tutorial de YouTube não sabe nada sobre o seu rosto.</p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 className="cormorant reveal" style={{ fontSize: "40px", color: colors.gold }}>Mulher, você já passou por alguma dessas situações?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
            {[
              { i: "🪞", t: '"Meu rosto está horrível"', d: "A flacidez avançou. O contorno sumiu. A pele que antes ficava no lugar agora parece ter desistido. E quanto mais você olha, mais difícil é aceitar o que vê." },
              { i: "📸", t: '"Tiro 10 fotos e nenhuma presta"', d: "Você ajusta o ângulo. Muda a luz. Tenta de novo. Só posta com filtro — mas a dor não é a foto ruim. É saber que a câmera está mostrando o que você preferia não ver. A câmera não mente." },
              { i: "💸", t: '"Já joguei dinheiro fora demais"', d: "R$ 500. R$ 900. R$1.200 em procedimentos que prometeram beleza, mas doeram, custaram caro e duraram poucos meses. Te prometeram muito, mas não entregaram nada." },
              { i: "💄", t: '"Encho a cara de maquiagem pra sair de casa"', d: "Base pra cobrir mancha. Corretivo em camadas para esconder olheiras. Contorno para recriar o que a flacidez levou embora. Você não se maquia mais pra se sentir bonita — você se maquia pra se esconder. E quando a maquiagem sai, vem aquela sensação de que o rosto 'real' não pode ser mostrado." }
            ].map((p, i) => (
              <div key={i} className="reveal" style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "36px 30px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "32px" }}>{p.i}</span>
                <div>
                  <h3 className="cormorant" style={{ fontSize: "20px", color: colors.gold, marginBottom: "8px" }}>{p.t}</h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, color: colors.muted }}>{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virada */}
      <section style={{ padding: "100px 24px", background: colors.surface }}>
        <div className="reveal" style={{ maxWidth: "640px", margin: "0 auto", fontSize: "16px", lineHeight: 2, color: colors.muted, textAlign: "left" }}>
          <p style={{ marginBottom: "18px" }}>Nenhum creme foi feito para o seu bigode chinês. Para a sua flacidez no maxilar. Para os músculos que derretem quando você franze a testa ou sorri.</p>
          <p style={{ marginBottom: "18px" }}>Creme hidrata. Procedimento preenche. Mas nenhum dos dois fortalece os músculos responsáveis por sustentar o seu rosto. E músculo facial fraco é o que faz a pele cair.</p>
          <p>O que falta não é mais produto. Não é mais procedimento. É saber exatamente o que o seu rosto precisa.</p>
        </div>
      </section>

      {/* Solution */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="cormorant reveal" style={{ fontSize: "40px", textAlign: "center", marginBottom: "64px" }}>Agora imagine ter um app que analisa <br/> o seu rosto e cria o protocolo certo pra você.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "80px", alignItems: "center" }}>
            <div className="reveal" style={{ textAlign: "center" }}>
               {/* App Screenshot Spotlight */}
               <div style={{ width: "280px", margin: "0 auto", borderRadius: "30px", padding: "10px", background: "linear-gradient(135deg, rgba(201,169,110,0.3) 0%, rgba(196,144,122,0.1) 100%)", border: `1px solid ${colors.gold}44`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                 <img src="/app-screenshot.png" alt="Interface do App Pele de Vidro" style={{ width: "100%", borderRadius: "20px", display: "block" }} />
               </div>
            </div>
            <div className="reveal" style={{ fontSize: "16px", lineHeight: 1.92, color: colors.muted, textAlign: "left" }}>
              <p style={{ marginBottom: "18px" }}>Você tira uma foto. A IA do Pele de Vidro mapeia em segundos: onde está a flacidez, quais rugas são dominantes, que grupos musculares precisam de atenção. Com base nisso — monta o seu protocolo de exercícios faciais.</p>
              <p style={{ marginBottom: "18px" }}>E mais, ainda analisa seu tipo de pele, indica receitas naturais personalizadas e monta o seu cronograma!</p>
              <p style={{ color: colors.rose, fontWeight: "600", marginBottom: "20px" }}>Não tem outra usuária com o mesmo cronograma que o seu.</p>
              <p>7 minutos por dia. Com orientação em vídeo. No seu ritmo, no seu espelho, na sua rotina.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", background: colors.surface }}>
        <h2 className="cormorant reveal" style={{ fontSize: "40px", marginBottom: "28px" }}>Você vai continuar escondendo seu rosto com maquiagem <br/> ou vai começar a resolver?</h2>
        <div className="reveal" style={{ maxWidth: "640px", margin: "0 auto 36px", fontSize: "16px", lineHeight: 1.9, color: colors.muted, textAlign: "left" }}>
           <p style={{ marginBottom: "12px" }}>Mais uma camada de corretivo. Mais um ângulo de foto. Mais um filtro no stories.</p>
           <p style={{ marginBottom: "12px" }}>Ou um plano <strong>PERSONALIZADO</strong> pra você!?</p>
           <p style={{ marginBottom: "12px" }}>Pela primeira vez existe uma ferramenta que mapeia, analisa, e cria um protocolo só seu.</p>
           <p>Não pra uma mulher genérica de 40 anos. <strong>Pra você!</strong></p>
        </div>
        <div className="reveal">
          <button onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})} style={{ background: `linear-gradient(135deg, ${colors.rose}, #9B4A46)`, color: "#fff", border: "none", padding: "20px 48px", borderRadius: "100px", fontSize: "16px", fontWeight: "600", cursor: "pointer", boxShadow: `0 14px 44px ${colors.rose}44` }}>Quero Analisar meu rosto agora</button>
          <p style={{ fontSize: "12px", color: colors.muted, marginTop: "14px" }}>Pagamento único · Sem renovação automática · Acesso imediato</p>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="cormorant reveal" style={{ fontSize: "44px", textAlign: "center", marginBottom: "64px" }}>Depoimentos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {[
              { n: "Fernanda C.", a: "47 anos · São Paulo", d: "Minha filha tirou uma foto minha na festa de aniversário dela. Eu vi e quase chorei — de vergonha. Fiquei meses sem tirar fotos. Comecei o Pele de Vidro sem muita expectativa. Quatro semanas depois, meu marido perguntou: 'O que você fez no rosto?' Eu não tinha feito nada. Só os 7 minutinhos." },
              { n: "Renata M.", a: "41 anos · Belo Horizonte", d: "Desativava a câmera em toda reunião de trabalho. Tinha vergonha do meu próprio rosto numa tela. O scanner identificou exatamente a flacidez no meu maxilar — que é o que mais me incomoda. Fiquei chocada com a precisão. E em 3 semanas já via diferença." },
              { n: "Carla S.", a: "52 anos · Curitiba", d: "Já joguei muito dinheiro fora em creme. Comprei o Pele de Vidro sem muita esperança. Dois meses depois minha colega de trabalho perguntou se eu tinha feito botox. Não fiz nada. Só os exercícios." }
            ].map((t, i) => (
              <div key={i} className="reveal" style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "34px 28px" }}>
                <span className="cormorant" style={{ fontSize: "48px", color: colors.rose, lineHeight: 0.1, display: "block", marginBottom: "20px" }}>“</span>
                <p style={{ fontSize: "14px", lineHeight: 1.82, color: colors.muted, fontStyle: "italic", marginBottom: "22px" }}>{t.d}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                   <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#222" }}></div>
                   <div>
                      <div style={{ color: colors.cream, fontSize: "14px", fontWeight: "600" }}>{t.n}</div>
                      <div style={{ color: colors.muted, fontSize: "12px" }}>{t.a}</div>
                      <div style={{ color: colors.gold, fontSize: "10px", marginTop: "2px" }}>★★★★★</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "120px 24px", background: colors.surface }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 className="cormorant reveal" style={{ fontSize: "48px", color: colors.gold }}>Em menos de 1 minuto a IA analisa como te dar uma pele lisa e jovem</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
            <PlanCard 
              tier="Básico"
              name="Básico" 
              price="47" 
              checkoutUrl="https://mpago.la/1nmokBx"
              features={["1 análise facial com IA", "Protocolo Exclusivo e Personalizado — montado só pra você", "Exercícios diários — para reduzir rugas, levantar músculos e rejuvenescer", "Receitas Pele de Porcelana — para clarear olheiras, manchas, eliminar células mortas"]} 
            />
            <PlanCard 
              tier="Mais Escolhido"
              name="Pró" 
              price="97" 
              highlight={true}
              checkoutUrl="https://mpago.la/2JCbXtn"
              features={["3 análises faciais com IA — Acompanhe sua evolução", "Protocolo Exclusivo e Personalizado — montado só pra você", "Exercícios diários — para reduzir rugas, levantar músculos e rejuvenescer", "Receitas Pele de Porcelana — para clarear olheiras, manchas, eliminar células mortas", "BÔNUS: Protocolo Adeus Papada — exercícios para eliminar essa super vilã"]} 
            />
            <PlanCard 
              tier="Premium"
              name="Premium" 
              price="117" 
              checkoutUrl="https://mpago.la/1NS9HZD"
              features={["10 análises faciais com IA — Acompanhe sua evolução", "Protocolo Exclusivo e Personalizado — montado só pra você", "Exercícios diários — Para reduzir rugas, levantar músculos e rejuvenescer", "Receitas Pele de Porcelana — para clarear olheiras, manchas, eliminar células mortas", "BÔNUS: Protocolo Adeus Papada — exercícios para eliminar essa super vilã", "BÔNUS: Protocolo Pescoço e Colo — rosto + pescoço + colo = liso"]} 
            />
          </div>
          <p className="reveal" style={{ textAlign: "center", marginTop: "48px", color: colors.muted, fontSize: "12px" }}>🔒 Pagamento único e seguro. Sem mensalidade. Sem renovação automática. Acesso imediato.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: '"Será que funciona pra mim? Já tentei tanta coisa…"', a: "Faz sentido desconfiar. Te prometeram mundos e fundos e nada mudou. A diferença aqui é a personalização: o protocolo é criado a partir do seu rosto, mulher real, não de um rosto genérico de modelo de 22 anos. Mulheres que nunca viram resultado com creme estão vendo com o protocolo personalizado porque, pela primeira vez, estão trabalhando os músculos certos." },
              { q: '"Não tenho tempo pra mais uma coisa."', a: "7 minutos por dia. A maioria das nossas usuárias faz enquanto o café esquenta. Se você tem tempo para rolar o Instagram, você tem tempo para investir em você." },
              { q: '"É tarde demais pra mim?"', a: "A pele tem memória muscular. Em qualquer fase, quando você começa a trabalhar os músculos faciais certos, a resposta aparece. Temos usuárias de 55, 58, 62 anos relatando melhora visível. Tarde só seria se você nunca começasse." },
              { q: '"Vai me deixar com cara artificial?"', a: "Nunca. O protocolo fortalece e reposiciona os músculos do rosto de forma natural — o resultado é que você parece você, só mais descansada, mais firme, mais viva. Sem cara de cera. Sem expressão congelada." },
              { q: '"O que são os créditos de análise?"', a: "Cada crédito = uma análise facial completa pela IA. Use para acompanhar sua evolução e atualizar seu protocolo conforme sua pele vai respondendo. Quanto mais créditos, mais frequente você pode reavaliar e otimizar seu desempenho." }
            ].map((f, i) => (
              <details key={i} className="reveal" style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: "16px", overflow: "hidden" }}>
                <summary style={{ padding: "22px 28px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: colors.gold, fontWeight: "500" }}>{f.q}</summary>
                <div style={{ padding: "0 28px 24px", color: colors.muted, fontSize: "14px", lineHeight: 1.8 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section style={{ padding: "80px 24px" }}>
        <div className="reveal" style={{ maxWidth: "760px", margin: "0 auto", background: "#fff", color: "#1E1410", borderRadius: "28px", padding: "54px 60px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
           <div style={{ fontSize: "56px", marginBottom: "20px" }}>🛡️</div>
           <h3 className="cormorant" style={{ fontSize: "32px", marginBottom: "16px" }}>Garantia de 7 dias</h3>
           <p style={{ fontSize: "15px", lineHeight: 1.85, opacity: 0.8 }}>Se em uma semana você não sentir diferença nos seus músculos faciais, devolvemos 100% do seu dinheiro sem perguntas, sem burocracia.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "130px 24px", textAlign: "center", background: "linear-gradient(155deg, #3D1A1A 0%, #1A0908 100%)" }}>
        <div className="reveal">
          <h2 className="cormorant" style={{ fontSize: "48px", marginBottom: "40px" }}>Qual mulher você escolhe ser hoje?</h2>
          <button onClick={() => document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})} style={{ background: `linear-gradient(135deg, ${colors.rose}, #9B4A46)`, color: "#fff", border: "none", padding: "20px 54px", borderRadius: "100px", fontSize: "18px", fontWeight: "600", cursor: "pointer", boxShadow: "0 16px 50px rgba(155,74,70,0.5)" }}>Quero meu protocolo personalizado</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#050403", padding: "60px 24px", textAlign: "center", borderTop: `1px solid ${colors.border}` }}>
        <div className="cormorant" style={{ color: colors.gold, fontSize: "24px", marginBottom: "16px" }}>Pele de Vidro</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "20px", flexWrap: "wrap", fontSize: "12px" }}>
           <a href="#" style={{ color: colors.muted, textDecoration: "none" }}>Termos de Uso</a>
           <a href="#" style={{ color: colors.muted, textDecoration: "none" }}>Política de Privacidade</a>
           <a href="#" style={{ color: colors.muted, textDecoration: "none" }}>Suporte</a>
        </div>
        <p style={{ color: colors.muted, fontSize: "11px", opacity: 0.4 }}>© 2026 Pele de Vidro. Todos os direitos reservados. Este app não substitui diagnóstico ou tratamento médico dermatológico.</p>
      </footer>
    </div>
  );
}
