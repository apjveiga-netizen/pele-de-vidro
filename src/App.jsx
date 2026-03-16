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

// ─── MAIN APP ───────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SPLASH); 
  const [credits, setCredits] = useState(3);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("pele_de_vidro_email") || "");
  const [user, setUser] = useState(null);
  const [activeExerciseId, setActiveExerciseId] = useState(null);

  const refreshCredits = (email) => {
    console.log("Refreshing credits for", email);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setUserEmail(userData.email);
    localStorage.setItem("pele_de_vidro_email", userData.email);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleUseCredit = () => {
    if (credits > 0) {
      setCredits(credits - 1);
    }
  };

  const goToExercise = (exerciseId) => {
    setActiveExerciseId(exerciseId);
    setScreen(SCREENS.EXERCISE);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.SPLASH:      return <SplashScreen onFinish={() => setScreen(SCREENS.LOGIN)} />;
      case SCREENS.LOGIN:       return <LoginScreen onLogin={handleLogin} />;
      case SCREENS.ONBOARDING:  return <OnboardingScreen onFinish={() => setScreen(SCREENS.UPLOAD)} />;
      case SCREENS.UPLOAD:      return <UploadScreen onNext={() => setScreen(SCREENS.SCANNING)} />;
      case SCREENS.SCANNING:    return <ScanningScreen onNext={() => setScreen(SCREENS.RESULT)} />;
      case SCREENS.RESULT:      return <ResultScreen onNext={() => setScreen(SCREENS.OFFER)} goToProtocol={() => setScreen(SCREENS.PROTOCOL)} />;
      case SCREENS.PROTOCOL:    return <ProtocolScreen onExercise={goToExercise} onBack={() => setScreen(SCREENS.DASHBOARD)} credits={credits} onUseCredit={handleUseCredit} onBuyCredits={() => setScreen(SCREENS.OFFER)} />;
      case SCREENS.OFFER:       return <OfferScreen onNext={() => setScreen(SCREENS.DASHBOARD)} credits={credits} userEmail={userEmail} />;
      case SCREENS.UPSELL:      return <UpsellScreen onDecline={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.DASHBOARD:   return <DashboardScreen credits={credits} userEmail={userEmail} refreshCredits={refreshCredits} onExercise={goToExercise} onNavigate={setScreen} screens={SCREENS} />;
      case SCREENS.EXERCISE:    return <ExerciseScreen exerciseId={activeExerciseId} onBack={() => setScreen(SCREENS.PROTOCOL)} />;
      case SCREENS.MANAGE_EXERCISES: return <ManageExercisesScreen onBack={() => setScreen(SCREENS.DASHBOARD)} />;
      case SCREENS.SCANS:       return <ScanHistoryScreen />;
      case SCREENS.PROFILE:     return <ProfileScreen />;
      case SCREENS.MENU:        return <MenuScreen onNavigate={setScreen} screens={SCREENS} />;
      case SCREENS.SALES_PAGE:  return <SalesPage />;
      default: return null;
    }
  };

  const isNavVisible = ![SCREENS.SPLASH, SCREENS.LOGIN, SCREENS.ONBOARDING].includes(screen);

  return (
    <PhoneFrame onBack={() => setScreen(SCREENS.DASHBOARD)} showBack={isNavVisible && screen !== SCREENS.DASHBOARD}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: isNavVisible ? "68px" : "0" }}>
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
 
