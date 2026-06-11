import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { TravelRegistration } from "./components/TravelRegistration";
import { MinorValidation } from "./components/MinorValidation";
import { SAGDeclaration } from "./components/SAGDeclaration";
import { VehicleRegistration } from "./components/VehicleRegistration";
import { TramiteTracking } from "./components/TramiteTracking";
import { OfficialsPortal } from "./components/OfficialsPortal";
import { Reports } from "./components/Reports";
import { Administration } from "./components/Administration";

export default function App() {
  /* MARKER-MAKE-KIT-INVOKED */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("traveler");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (userRole: string) => {
    setRole(userRole);
    setIsLoggedIn(true);
    if (userRole === "admin") setCurrentPage("admin");
    else if (userRole === "official" || userRole === "sag") setCurrentPage("officials");
    else setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "travel": return <TravelRegistration />;
      case "minors": return <MinorValidation />;
      case "sag": return <SAGDeclaration />;
      case "vehicles": return <VehicleRegistration />;
      case "tracking": return <TramiteTracking />;
      case "officials": return <OfficialsPortal />;
      case "reports": return <Reports />;
      case "admin": return <Administration />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} role={role} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
}
