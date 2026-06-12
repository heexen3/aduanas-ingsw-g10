import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { TramitesProvider } from "../context/TramitesContext";
import { LoginPage } from "../components/auth/LoginPage";
import { AppLayout } from "../components/layout/AppLayout";

// Componentes del Módulo Viajero
import { Dashboard } from "../components/viajero/Dashboard";
import { NuevoViaje } from "../components/viajero/NuevoViaje";
import { DeclaracionSAG } from "../components/viajero/DeclaracionSAG";
import { RegistroVehiculos } from "../components/viajero/RegistroVehiculos";
import { MenoresDocumentacion } from "../components/viajero/MenoresDocumentacion";
import { SeguimientoTramites } from "../components/viajero/SeguimientoTramites";

// Componentes del Módulo Funcionarios
import { PortalAduanas } from "../components/funcionarios/PortalAduanas";
import { PortalSAG } from "../components/funcionarios/PortalSAG";
import { PortalPDI } from "../components/funcionarios/PortalPDI";

// Componentes de Administración y Reportes
import { Administration } from "../components/admin/Administration";
import { Reports } from "../components/reportes/Reports";

function AppContent() {
  const { isAuthenticated, role } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Si cambia de rol (ej: demo login), forzar redirección al dashboard correspondiente
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === "admin") {
        setCurrentPage("admin");
      } else if (role === "aduanas") {
        setCurrentPage("portal-aduanas");
      } else if (role === "sag") {
        setCurrentPage("portal-sag");
      } else if (role === "pdi") {
        setCurrentPage("portal-pdi");
      } else {
        setCurrentPage("dashboard");
      }
    }
  }, [isAuthenticated, role]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Renderizar la página actual en base a la navegación
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "nuevo-viaje":
        return <NuevoViaje onNavigate={setCurrentPage} />;
      case "menores":
        return <MenoresDocumentacion />;
      case "sag":
        return <DeclaracionSAG />;
      case "vehiculos":
        return <RegistroVehiculos />;
      case "seguimiento":
        return <SeguimientoTramites />;
      case "portal-aduanas":
        return <PortalAduanas />;
      case "portal-sag":
        return <PortalSAG />;
      case "portal-pdi":
        return <PortalPDI />;
      case "reportes":
        return <Reports />;
      case "admin":
        return <Administration />;
      default:
        return <Dashboard />;
    }
  };

  // Título dinámico para el header en base a la página actual
  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard": return "Panel Principal y Resumen Operativo";
      case "nuevo-viaje": return "Formulario de Registro de Viaje Terrestre";
      case "menores": return "Autorizaciones de Salida de Menores de Edad";
      case "sag": return "Declaraciones Juradas Sanitarias del SAG";
      case "vehiculos": return "Salida y Admisión Temporal de Vehículos";
      case "seguimiento": return "Historial y Seguimiento de Trámites";
      case "portal-aduanas": return "Bandeja del Inspector de Aduanas";
      case "portal-sag": return "Bandeja del Inspector del SAG";
      case "portal-pdi": return "Puesto de Control Migratorio de la PDI";
      case "reportes": return "Análisis Estadístico y Reportes Operacionales";
      case "admin": return "Consola de Administración y Auditoría General";
      default: return "Aduanas Inteligente";
    }
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      pageTitle={getPageTitle()}
    >
      <div className="animate-fadeIn">
        {renderPage()}
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TramitesProvider>
        <AppContent />
      </TramitesProvider>
    </AuthProvider>
  );
}
