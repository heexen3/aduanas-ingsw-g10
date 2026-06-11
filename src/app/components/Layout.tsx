import { useState } from "react";
import {
  LayoutDashboard, Plane, Baby, Leaf, Car, Search,
  Users, BarChart2, Settings, Shield, Bell, LogOut,
  Menu, X, ChevronRight, CheckCircle2
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  role: string;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["traveler", "official", "sag", "admin"] },
  { id: "travel", label: "Registro de Viaje", icon: Plane, roles: ["traveler", "official", "admin"] },
  { id: "minors", label: "Validación Menores", icon: Baby, roles: ["traveler", "official", "admin"] },
  { id: "sag", label: "Declaración SAG", icon: Leaf, roles: ["traveler", "sag", "official", "admin"] },
  { id: "vehicles", label: "Registro Vehículos", icon: Car, roles: ["traveler", "official", "admin"] },
  { id: "tracking", label: "Seguimiento", icon: Search, roles: ["traveler", "official", "sag", "admin"] },
  { id: "officials", label: "Portal Funcionarios", icon: Users, roles: ["official", "sag", "admin"] },
  { id: "reports", label: "Reportes", icon: BarChart2, roles: ["official", "admin"] },
  { id: "admin", label: "Administración", icon: Settings, roles: ["admin"] },
];

const ROLE_LABELS: Record<string, string> = {
  traveler: "Viajero",
  official: "Func. Aduanas",
  sag: "Func. SAG",
  admin: "Administrador",
};

const ROLE_COLORS: Record<string, string> = {
  traveler: "#27ae60",
  official: "#1b5fad",
  sag: "#e67e22",
  admin: "#8e44ad",
};

export function Layout({ children, currentPage, onNavigate, role, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const notifications = [
    { id: 1, text: "Trámite #ADN-2024-1547 aprobado", time: "hace 5 min", type: "success" },
    { id: 2, text: "Documentación pendiente de revisión SAG", time: "hace 22 min", type: "warning" },
    { id: 3, text: "Nuevo paso fronterizo habilitado: Pino Hachado", time: "hace 1h", type: "info" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center border border-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Aduanas Inteligente</div>
            <div className="text-blue-300 text-xs">Chile · Sistema Integrado</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROLE_COLORS[role] }} />
          <span className="text-xs text-blue-200">{ROLE_LABELS[role]}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all relative"
              style={{
                color: active ? "#ffffff" : "rgba(200,220,255,0.75)",
                backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
              }}
            >
              {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-300 rounded-r" />}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: ROLE_COLORS[role] }}>
            {role === "traveler" ? "JR" : role === "official" ? "FO" : role === "sag" ? "FS" : "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">
              {role === "traveler" ? "Juan Rodríguez" : role === "official" ? "Felipe Ortega" : role === "sag" ? "Sara González" : "Admin Sistema"}
            </div>
            <div className="text-blue-300 text-xs truncate">
              {role === "traveler" ? "RUT 12.345.678-9" : role === "official" ? "Func. #A-0234" : role === "sag" ? "SAG #S-0089" : "Superadmin"}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-xs text-blue-300 hover:text-white transition-colors py-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#f4f6f9" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ backgroundColor: "#0b3a6e" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col" style={{ backgroundColor: "#0b3a6e" }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b flex items-center justify-between px-4 lg:px-6 h-14 flex-shrink-0" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">
                {NAV_ITEMS.find(n => n.id === currentPage)?.label ?? "Dashboard"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: "rgba(11,58,110,0.1)" }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(11,58,110,0.08)" }}>
                    <span className="text-sm font-semibold text-gray-900">Notificaciones</span>
                    <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(11,58,110,0.05)" }}>
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.type === "success" ? "text-green-500" : n.type === "warning" ? "text-orange-500" : "text-blue-500"}`} />
                      <div>
                        <div className="text-xs font-medium text-gray-800">{n.text}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: ROLE_COLORS[role] }}>
              <Shield className="w-3 h-3" />
              {ROLE_LABELS[role]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
