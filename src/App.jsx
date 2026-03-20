import { useState, useEffect } from "react";
import { colors } from "./theme";

// Import Screens
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import UploadScreen from "./screens/UploadScreen";
import ScanningScreen from "./screens/ScanningScreen";
import ResultScreen from "./screens/ResultScreen";
import ProtocolScreen from "./screens/ProtocolScreen";
import OfferScreen from "./screens/OfferScreen";
import UpsellScreen from "./screens/UpsellScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ExerciseScreen from "./screens/ExerciseScreen";
import ManageExercisesScreen from "./screens/ManageExercisesScreen";
import ScanHistoryScreen from "./screens/ScanHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import MenuScreen from "./screens/MenuScreen";
import SalesPage from "./screens/SalesPage";

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
  SALES_PAGE: "sales_page",
};

// Import Components
import PhoneFrame from "./components/PhoneFrame";
import BottomNav from "./components/BottomNav";

import { supabase } from "./lib/supabase";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH); 
  const [credits, setCredits] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
        if (screen === SCREENS.LOGIN || screen === SCREENS.SPLASH) {
          setScreen(SCREENS.DASHBOARD);
        }
      } else {
        setUser(null);
        setCredits(0);
        setScreen(SCREENS.LOGIN);
      }
    });

    return () => subscription.unsubscribe();
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
      }
  };

  const refreshCredits = async (email) => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const handleLogin = (userData) => {
    // Supabase Listener handles the state update
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
      case SCREENS.SPLASH:      return <SplashScreen onFinish={() => setScreen(SCREENS.LOGIN)} />;
      case SCREENS.LOGIN:       return <LoginScreen onLogin={handleLogin} />;
      case SCREENS.ONBOARDING:  return <OnboardingScreen onFinish={() => setScreen(SCREENS.UPLOAD)} />;
      case SCREENS.UPLOAD:      return <UploadScreen onNext={(data) => { setPhotos(data.photos); setScreen(SCREENS.SCANNING); }} />;
      case SCREENS.SCANNING:    return <ScanningScreen onNext={(aiResult) => navigateTo(SCREENS.RESULT, { aiResult })} userEmail={userEmail} credits={credits} useCredit={handleUseCredit} goToOffer={() => setScreen(SCREENS.OFFER)} userPhotos={photos} user={user} />;
      case SCREENS.RESULT:      return <ResultScreen onNext={() => setScreen(SCREENS.OFFER)} goToProtocol={() => setScreen(SCREENS.PROTOCOL)} aiData={screenData?.aiResult} />;
      case SCREENS.PROTOCOL:    return <ProtocolScreen onExercise={goToExercise} onBack={() => setScreen(SCREENS.DASHBOARD)} credits={credits} onUseCredit={handleUseCredit} onBuyCredits={() => setScreen(SCREENS.OFFER)} user={user} />;
      case SCREENS.OFFER:       return <OfferScreen onNext={() => setScreen(SCREENS.DASHBOARD)} credits={credits} userEmail={userEmail} />;
      case SCREENS.UPSELL:      return <UpsellScreen onDecline={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.DASHBOARD:   return <DashboardScreen credits={credits} userEmail={userEmail} onExercise={goToExercise} onNavigate={setScreen} screens={SCREENS} refreshCredits={refreshCredits} />;
      case SCREENS.EXERCISE:    return <ExerciseScreen exerciseId={activeExerciseId} onBack={() => setScreen(SCREENS.PROTOCOL)} />;
      case SCREENS.MANAGE_EXERCISES: return <ManageExercisesScreen onBack={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.SCANS:       return <ScanHistoryScreen credits={credits} userEmail={userEmail} user={user} />;
      case SCREENS.PROFILE:     return <ProfileScreen user={user} profile={userEmail} credits={credits} />;
      case SCREENS.MENU:        return <MenuScreen onNavigate={setScreen} screens={SCREENS} />;
      case SCREENS.SALES_PAGE:  return <SalesPage />;
      default: return null;
    }
  };

  const isNavVisible = ![SCREENS.SPLASH, SCREENS.LOGIN, SCREENS.ONBOARDING].includes(screen);

  return (
    <PhoneFrame onBack={() => setScreen(SCREENS.DASHBOARD)} showBack={isNavVisible && screen !== SCREENS.DASHBOARD}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Version Banner for Debugging */}
        <div style={{ 
          position: "absolute", top: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", 
          color: colors.gold, fontSize: "9px", textAlign: "center", zIndex: 9999,
          pointerEvents: "none", padding: "2px"
        }}>
          DEBUG MODE: V.8.2.2 (Local Build)
        </div>

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
 
