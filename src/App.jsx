import { useState, useEffect } from "react";
import { colors } from "./theme";

// Import Screens
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import UploadScreen from "./pages/UploadScreen";
import ScanningScreen from "./pages/ScanningScreen";
import ResultScreen from "./pages/ResultScreen";
import ProtocolScreen from "./pages/ProtocolScreen";
import OfferScreen from "./pages/OfferScreen";
import UpsellScreen from "./pages/UpsellScreen";
import DashboardScreen from "./pages/DashboardScreen";
import ExerciseScreen from "./pages/ExerciseScreen";
import ManageExercisesScreen from "./pages/ManageExercisesScreen";
import ScanHistoryScreen from "./pages/ScanHistoryScreen";
import ProfileScreen from "./pages/ProfileScreen";
import LoginScreen from "./pages/LoginScreen";
import MenuScreen from "./pages/MenuScreen";
import SalesPage from "./pages/SalesPage";
import QuizStandalone from "./quiz/QuizStandalone";
import QuizScreen from "./quiz/QuizScreen";

const SCREENS = {
  SPLASH: "splash",
  LOGIN: "login",
  ONBOARDING: "onboarding",
  UPLOAD: "upload",
  SCANNING: "scanning",
  RESULT: "result",
  PROTOCOL: "protocol",
  OFFER: "offer",
  UPSELL: "upsell",
  DASHBOARD: "dashboard",
  EXERCISE: "exercise",
  MANAGE_EXERCISES: "manage_exercises",
  SCANS: "scans",
  PROFILE: "profile",
  MENU: "menu",
  QUIZ_STANDALONE: "quiz_standalone",
  // QUIZ: "quiz",
};

// Import Components
import PhoneFrame from "./components/PhoneFrame";
import BottomNav from "./components/BottomNav";

import { supabase } from "./lib/supabase";
import { saveProtocol, getProtocol, isValidProtocol, CURRENT_SCHEMA_VERSION } from "./data/store";
import { generateProtocol } from "./data/protocolEngine";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.DASHBOARD); 
  const [credits, setCredits] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [photos, setPhotos] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  // Track if initial path routing has been handled
  const [initialPathHandled, setInitialPathHandled] = useState(false);

  // 1. Initial Path Routing (Only once on mount)
  useEffect(() => {
    const path = window.location.pathname;
    console.log("App: Initial path detection:", path);

    if (path === "/analise" || path === "/quiz") {
      setScreen(SCREENS.QUIZ_STANDALONE);
      setIsCheckingSession(false); // No session check needed for quiz
    }
  }, []);

  // 2. Authentication Flow & Listener (Only once on mount)
  useEffect(() => {
    let active = true;

    // Check Initial Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        // Direct to dashboard if at root
        const path = window.location.pathname;
        if (path === "/" || path === "/app" || path === "/pele") {
          setScreen(SCREENS.DASHBOARD);
        }
      } else {
        // Local Session Fallback
        const localSessionStr = localStorage.getItem("pele_de_vidro_session");
        if (localSessionStr) {
          try {
            const ls = JSON.parse(localSessionStr);
            setUser(ls);
            fetchProfile(ls.id);
            setScreen(SCREENS.DASHBOARD);
          } catch(e) {
            setScreen(SCREENS.LOGIN);
          }
        } else {
          setScreen(SCREENS.LOGIN);
        }
      }
      setIsCheckingSession(false);
    });

    // Subscriptions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);
      if (!active) return;

      if (event === 'SIGNED_OUT') {
        resetAllData();
        localStorage.removeItem("pele_de_vidro_session");
        localStorage.removeItem("pele_de_vidro_email");
        localStorage.removeItem("pdv_admin_bypass");
        setUser(null);
        setCredits(0);
        setScreen(SCREENS.LOGIN);
      } else if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        // Force protocol sync on fresh login
        syncProtocolWithDatabase(session.user.id, true);
        
        // Only auto-navigate to Dashboard if coming from Login/Splash
        setScreen(current => (current === SCREENS.LOGIN || current === SCREENS.SPLASH) ? SCREENS.DASHBOARD : current);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
      if (data) {
        setCredits(data.credits);
        setUserEmail(data.email);
        // Persist admin status if matching
        if (data.email?.toLowerCase().trim() === "apjveiga@gmail.com") {
          localStorage.setItem("pdv_admin_bypass", data.email.toLowerCase().trim());
        }
        
        // --- AUTO-RESTORATION (V.8.2.4) ---
        syncProtocolWithDatabase(userId);
      }
  };

  const syncProtocolWithDatabase = async (userId, force = false) => {
    const existing = getProtocol();
    
    // --- CACHE INVALIDATION LOGIC (V.8.3) ---
    const storedVersion = localStorage.getItem("pdv_schema_version");
    const isOldVersion = storedVersion !== CURRENT_SCHEMA_VERSION;
    
    if (!force && isValidProtocol(existing) && !isOldVersion) return; 

    if (isOldVersion) {
      console.log("App: Versão de ativos antiga detectada (", storedVersion, "). Forçando regeneração...");
      localStorage.setItem("pdv_schema_version", CURRENT_SCHEMA_VERSION);
    }

    console.log("App: Protocolo local ausente ou inválido. Buscando restauração no Supabase...");
    
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('result_json')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (analysis && analysis.result_json) {
      console.log("App: Análise encontrada! Regenerando protocolo...");
      const restoredProtocol = generateProtocol(analysis.result_json);
      saveProtocol(restoredProtocol);
      // Notificamos as telas de que os dados mudaram sem recarregar a página
      setDataVersion(v => v + 1);
    } else {
      console.log("App: Nenhuma análise anterior encontrada para restauração.");
    }
  };

  const refreshCredits = async (email) => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const handleLogin = (userData) => {
    // Fallback or override logic setting user locally when Supabase Auth is bypassed.
    localStorage.setItem("pele_de_vidro_session", JSON.stringify(userData));
    if (userData.email) {
      localStorage.setItem("pele_de_vidro_email", userData.email.toLowerCase().trim());
    }
    setUser(userData);
    fetchProfile(userData.id);
    syncProtocolWithDatabase(userData.id, true);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleUseCredit = async () => {
    // --- NUCLEAR ADMIN BYPASS (V.7) ---
    const adminEmail = "apjveiga@gmail.com";
    // Check session email, state email, or stored email
    const storedEmail = localStorage.getItem("pdv_admin_bypass") || "";
    const currentUserEmail = (user?.email || userEmail || storedEmail || "").toLowerCase().trim();
    
    if (currentUserEmail === adminEmail) {
      console.log("NUCLEAR BYPASS ACTIVE (V.7): Permitindo acesso total para", adminEmail);
      localStorage.setItem("pdv_admin_bypass", adminEmail); // Persist for next time
      setCredits(999999);
      return true; 
    }

    if (credits > 0 && user) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ credits: Math.max(0, credits - 1) })
        .eq('id', user.id);
      
      if (!error) {
        setCredits(Math.max(0, credits - 1));
        return true;
      }
    }
    return false;
  };

  const goToExercise = (exerciseId) => {
    setActiveExerciseId(exerciseId);
    setScreen(SCREENS.EXERCISE);
  };

  const [screenData, setScreenData] = useState({});

  const navigateTo = (newScreen, data = {}) => {
    setScreenData(data);
    setScreen(newScreen);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.SPLASH:      return <SplashScreen onFinish={() => (user || localStorage.getItem("pele_de_vidro_session")) ? setScreen(SCREENS.DASHBOARD) : setScreen(SCREENS.LOGIN)} />;
      case SCREENS.LOGIN:       return <LoginScreen onLogin={handleLogin} />;
      case SCREENS.ONBOARDING:  return <OnboardingScreen onFinish={() => setScreen(SCREENS.UPLOAD)} />;
      case SCREENS.UPLOAD:      return <UploadScreen onNext={(data) => { setPhotos(data.photos); setScreen(SCREENS.SCANNING); }} />;
      case SCREENS.SCANNING:    return <ScanningScreen onNext={(aiResult) => navigateTo(SCREENS.RESULT, { aiResult })} userEmail={userEmail} credits={credits} useCredit={handleUseCredit} goToOffer={() => setScreen(SCREENS.OFFER)} userPhotos={photos} user={user} />;
      case SCREENS.RESULT:      return <ResultScreen onNext={() => setScreen(SCREENS.OFFER)} goToProtocol={() => setScreen(SCREENS.PROTOCOL)} aiData={screenData?.aiResult} />;
      case SCREENS.PROTOCOL:    return <ProtocolScreen key={`prot-${dataVersion}`} onExercise={goToExercise} onBack={() => setScreen(SCREENS.DASHBOARD)} credits={credits} onUseCredit={handleUseCredit} onBuyCredits={() => setScreen(SCREENS.OFFER)} user={user} />;
      case SCREENS.OFFER:       return <OfferScreen onNext={() => setScreen(SCREENS.DASHBOARD)} credits={credits} userEmail={userEmail} />;
      case SCREENS.UPSELL:      return <UpsellScreen onDecline={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.DASHBOARD:   return <DashboardScreen key={`dash-${dataVersion}`} credits={credits} userEmail={userEmail} onExercise={goToExercise} onNavigate={setScreen} screens={SCREENS} refreshCredits={refreshCredits} />;
      case SCREENS.EXERCISE:    return <ExerciseScreen exerciseId={activeExerciseId} onBack={() => setScreen(SCREENS.PROTOCOL)} />;
      case SCREENS.MANAGE_EXERCISES: return <ManageExercisesScreen onBack={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.SCANS:       return <ScanHistoryScreen credits={credits} userEmail={userEmail} user={user} />;
      case SCREENS.PROFILE:     return <ProfileScreen user={user} profile={userEmail} credits={credits} />;
      case SCREENS.MENU:        return <MenuScreen onNavigate={setScreen} screens={SCREENS} />;
      case SCREENS.QUIZ_STANDALONE: return <QuizStandalone />;
      // case SCREENS.QUIZ:        return <QuizScreen onFinish={(data) => {
      //   if (data.name) {
      //     saveProfile({ name: data.name, age: data.answers.age || 30 });
      //   }
      //   setScreen(SCREENS.UPLOAD);
      // }} />;
      default: return null;
    }
  };

  const isNavVisible = ![SCREENS.SPLASH, SCREENS.LOGIN, SCREENS.ONBOARDING, SCREENS.QUIZ_STANDALONE].includes(screen);

  if (screen === SCREENS.QUIZ_STANDALONE) {
    return <QuizStandalone />;
  }

  return (
    <PhoneFrame onBack={() => setScreen(SCREENS.DASHBOARD)} showBack={isNavVisible && screen !== SCREENS.DASHBOARD}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>

        <div style={{ flex: 1, overflowY: "auto", paddingBottom: isNavVisible ? "60px" : "0" }}>
          {renderScreen()}
        </div>

        {isNavVisible && (
          <BottomNav onNavigate={(action) => {
            if (action === "HomeView") setScreen(SCREENS.DASHBOARD);
            if (action === "UploadView") setScreen(SCREENS.UPLOAD);
            if (action === "CreditsView") setScreen(SCREENS.OFFER); // Using OfferScreen for Credits
            if (action === "ResultView") setScreen(SCREENS.PROTOCOL); // ResultView goes directly to Protocol
            if (action === "DiamanteView") setScreen(SCREENS.UPSELL); // Using Upsell for Diamante ecosystem
          }} />
        )}
      </div>
    </PhoneFrame>
  );
}
 
